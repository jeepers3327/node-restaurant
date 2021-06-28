import "mocha";
import { expect } from "chai";
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
    const testOrder =OrderFactory.Create(customerId, {
      addressLine1: "Test",
      postcode: "AA1 1AA",
      country: "GB",
    });
    
    testOrder.details.addOrderItem('Pizza', 10, 1);
    
    let orderRepo = new OrderRepositoryInMemoryImpl();
    await orderRepo.addNew(testOrder);

    let handler = new CheckOrderStockCommandHandler(
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
    const testOrder =OrderFactory.Create(customerId, {
      addressLine1: "Test",
      postcode: "AA1 1AA",
      country: "GB",
    });

    testOrder.details.addOrderItem('Pizza', 10, 1);

    let orderRepo = new OrderRepositoryInMemoryImpl();
    await orderRepo.addNew(testOrder);

    let handler = new CheckOrderStockCommandHandler(
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

class MockStockChecker implements StockChecker {
  private shouldReturnInStock: boolean;

  constructor(returnInStock: boolean) {
    this.shouldReturnInStock = returnInStock;
  }
  checkStock(item: IOrderItem): Promise<string> {
    return new Promise((resolve) => {
      if (this.shouldReturnInStock) {
        return resolve("OK");
      } else {
        return resolve(`${item.description} not in stock`);
      }
    });
  }
}

class MockHandler implements IHandler<OrderCreatedEvent> {
  typeToHandle = "order-created";
  handle(evt: OrderCreatedEvent): void {}
}
