import "mocha";
import { expect, assert } from "chai";
import { CreateOrderCommandHandler } from "../src/domain/usecases/create-new-order";
import { OrderRepositoryInMemoryImpl } from "../src/infrastructure/order-repository-in-memory";
import { WinstonLogger } from "../src/infrastructure/logger-winston";
import {
  DomainEvents,
  IHandler,
} from "node-js-ddd/dist/events/domain-event-handling";
import { OrderCreatedEvent } from "../src/domain/events/order-created/order-created";
import { IAddress } from "../src/domain/entities/address";
import { OrderFactory } from "../src/domain/entities/order";
import { CheckOrderStockCommandHandler } from "../src/domain/usecases/check-order-stock";
import { StockChecker } from "../src/domain/services/stock-check-service";
import { IOrderItem } from "../src/domain/entities/order-item";
import { IOrder } from "../src/domain/entities/order";
import { ProcessPaymentCommandHandler } from "../src/domain/usecases/process-payment";
import { PaymentProcessor } from "../src/domain/services/payment-processor";
import { MockHandler, MockPaymentProcessor, MockStockChecker } from "./mocks/mocks";

const customerId = "consulting@jameseastham.co.uk";
const address: IAddress = {
  addressLine1: "Test address",
  country: "GB",
  postcode: "BB4456",
};

const handler = new CreateOrderCommandHandler(
  new OrderRepositoryInMemoryImpl(),
  new WinstonLogger()
);

describe("Create order command tests", () => {
  beforeEach(function () {
    DomainEvents.registerHandler(new MockHandler());
  });

  it("Should be able to execute a create order command", async () => {
    const newOrderNumber = await handler.execute({
      customerId: customerId,
      items: [
        {
          description: "1234",
          quantity: 1,
          price: 150,
        },
      ],
      address: address,
    });

    expect(newOrderNumber.length).to.greaterThan(0);
  });
});

describe("Check Stock Use Case Tests", () => {
  beforeEach(function () {
    DomainEvents.registerHandler(new MockHandler());
  });

  it("Should return fully stocked if order items are all in stock", async () => {
    const testOrder = OrderFactory.Create(customerId, {
      addressLine1: "Test",
      postcode: "AA1 1AA",
      country: "GB",
    });

    testOrder.details.addOrderItem("Pizza", 10, 1);

    const orderRepo = new OrderRepositoryInMemoryImpl();
    await orderRepo.addNew(testOrder);

    const handler = new CheckOrderStockCommandHandler(
      orderRepo,
      new MockStockChecker(true),
      new WinstonLogger()
    );

    const response = await handler.execute({
      orderId: testOrder.orderNumber,
      customerId: testOrder.customerId,
    });

    expect(response.fullyStocked).to.equal(true);
  });

  it("Should return fully stocked false if order items are all out of stock", async () => {
    const testOrder = OrderFactory.Create(customerId, {
      addressLine1: "Test",
      postcode: "AA1 1AA",
      country: "GB",
    });

    testOrder.details.addOrderItem("Pizza", 10, 1);

    const orderRepo = new OrderRepositoryInMemoryImpl();
    await orderRepo.addNew(testOrder);

    const handler = new CheckOrderStockCommandHandler(
      orderRepo,
      new MockStockChecker(false),
      new WinstonLogger()
    );

    const response = await handler.execute({
      orderId: testOrder.orderNumber,
      customerId: testOrder.customerId,
    });

    expect(response.fullyStocked).to.equal(false);
  });
});

describe("Process Payment Use Case Tests", () => {
  beforeEach(function () {
    DomainEvents.registerHandler(new MockHandler());
  });

  it("Should return payment processed if payment service returns ok", async () => {
    const testOrder = OrderFactory.Create(customerId, {
      addressLine1: "Test",
      postcode: "AA1 1AA",
      country: "GB",
    });

    testOrder.details.addOrderItem("Pizza", 10, 1);

    await testOrder.details.checkStock(new MockStockChecker(true));

    const orderRepo = new OrderRepositoryInMemoryImpl();
    await orderRepo.addNew(testOrder);

    const handler = new ProcessPaymentCommandHandler(
      orderRepo,
      new MockPaymentProcessor(true),
      new WinstonLogger()
    );

    const response = await handler.execute({
      orderId: testOrder.orderNumber,
      customerId: testOrder.customerId,
    });

    expect(response.success).to.equal(true);
  });

  it("Should return payment success false if payment processing fails", async () => {
    const testOrder = OrderFactory.Create(customerId, {
      addressLine1: "Test",
      postcode: "AA1 1AA",
      country: "GB",
    });

    testOrder.details.addOrderItem("Pizza", 10, 1);

    await testOrder.details.checkStock(new MockStockChecker(true));

    const orderRepo = new OrderRepositoryInMemoryImpl();
    await orderRepo.addNew(testOrder);

    const handler = new ProcessPaymentCommandHandler(
      orderRepo,
      new MockPaymentProcessor(false),
      new WinstonLogger()
    );

    const response = await handler.execute({
      orderId: testOrder.orderNumber,
      customerId: testOrder.customerId,
    });

    expect(response.success).to.equal(false);
  });

  it("Should error if order has not yet been stock checked", async () => {
    const testOrder = OrderFactory.Create(customerId, {
      addressLine1: "Test",
      postcode: "AA1 1AA",
      country: "GB",
    });

    testOrder.details.addOrderItem("Pizza", 10, 1);

    const orderRepo = new OrderRepositoryInMemoryImpl();
    await orderRepo.addNew(testOrder);

    const handler = new ProcessPaymentCommandHandler(
      orderRepo,
      new MockPaymentProcessor(false),
      new WinstonLogger()
    );

    const result = await handler.execute({
      orderId: testOrder.orderNumber,
      customerId: testOrder.customerId,
    });

    expect(result.message).to.equal('Cannot process a payment that has not been stock checked.')
    expect(result.success).to.equal(false);
  });
});
