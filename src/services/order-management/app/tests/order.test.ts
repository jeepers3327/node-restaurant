import "mocha";
import { assert, expect } from "chai";
import { OrderFactory } from "../src/domain/entities/order";
import { PutItemInput, Converter } from "aws-sdk/clients/dynamodb";
import { DomainEvents } from 'node-js-ddd/dist/events/domain-event-handling';
import { IAddress } from '../src/domain/entities/address';
import { StockServiceChecker } from "../src/infrastructure/stock-service-checker";
import { MockStockChecker } from "./mocks/mocks";

const customerId = "consulting@jameseastham.co.uk";
const address: IAddress = {
  addressLine1: 'Test address',
  country: 'GB',
  postcode: 'BB4456'
}

describe("Order model", () => {
  beforeEach(function () {
    DomainEvents.registerCallbackHandler((type, eventRaised) => {console.log(type)});
  });

  it("Should be able to create an order", () => {
    const order = OrderFactory.Create(customerId, address);

    expect(order.customerId).to.equal(customerId);
    expect(order.orderNumber.length).to.greaterThan(0);
  });

  it("Should be able to create an order and dispatch", () => {
    const order = OrderFactory.Create(customerId, address);
    order.dispatch();

    expect(order.status).to.equal("Dispatched");
    expect(order.details.dispatchDate).to.not.be.an("undefined");
  });

  it("Should be able to create an order and cancel", () => {
    const order = OrderFactory.Create(customerId, address);
    order.cancel('Manual order cancellation');

    expect(order.status).to.equal("Cancelled");
    expect(order.details.cancellationReason).to.equal('Manual order cancellation');
  });

  it("Should not be able to dispatch a cancelled order", () => {
    const order = OrderFactory.Create(customerId, address);
    order.cancel('Manual order cancellation');

    assert.throws(
      () => order.dispatch(),
      Error,
      "Cannot dispatch a cancelled order"
    );
  });

  it("Should not be able to dispatch a dispatched order", () => {
    const order = OrderFactory.Create(customerId, address);
    order.dispatch();

    assert.throws(
      () => order.dispatch(),
      Error,
      "Order has already been dispatched"
    );
  });

  it("Should not be able to cancel a dispatched order", () => {
    const order = OrderFactory.Create(customerId, address);
    order.dispatch();

    assert.throws(
      () => order.cancel('Manual order cancellation'),
      Error,
      "Cannot cancel a dispatched order"
    );
  });

  it("Should not be able to accept an order that has not been paid or stock checked", () => {
    const order = OrderFactory.Create(customerId, address);
    

    assert.throws(
      () =>order.accept(),
      Error,
      'Cannot accept an order that has not been paid and stock checked');
    });

  it("Should not be able to create an order with an empty customer id", () => {
    assert.throws(
      () => OrderFactory.Create("", address),
      Error,
      "Customer id cannot be empty"
    );
  });

  it("Should be able to accept an order", () => {
    const order = OrderFactory.Create(customerId, address);
    order.details.checkStock(new MockStockChecker(true));
    order.details.paymentReceivedOn(new Date());

    order.accept();

    expect(order.status).to.equal('Accepted');
  });

  it("Should not be able to create an order with an empty customer id", () => {
    assert.throws(
      () => OrderFactory.Create("", address),
      Error,
      "Customer id cannot be empty"
    );
  });

  it("Should be able to create an order from existing order number", () => {
    const order = OrderFactory.Create(customerId, address, "1234", new Date());

    expect(order.customerId).to.equal(customerId);
    expect(order.orderNumber).to.equal("1234");
  });

  it("Should be able to add an order item", () => {
    const order = OrderFactory.Create(customerId, address);

    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza and chips", 15, 1);

    expect(order.totalAmount.amount).to.equal(65);
    expect(order.details.orderItems.length).to.equal(2);
  });

  it("Should be able to remove one of many order items", () => {
    const order = OrderFactory.Create(customerId, address);

    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);

    order.details.removeOrderItem("Pizza", 1);

    expect(order.totalAmount.amount).to.equal(42.99);
    expect(order.details.orderItems.length).to.equal(1);
  });

  it("Should be able to remove all of many order items", () => {
    const order = OrderFactory.Create(customerId, address);

    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);

    order.details.removeOrderItem("Pizza", 5);

    expect(order.totalAmount.amount).to.equal(2.99);
    expect(order.details.orderItems.length).to.equal(0);
  });

  it("Should be able to remove a second order item", () => {
    const order = OrderFactory.Create(customerId, address);

    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Chips", 2.5, 1);

    order.details.removeOrderItem("Chips", 1);

    expect(order.totalAmount.amount).to.equal(50);
    expect(order.details.orderItems.length).to.equal(1);
  });

  it("Should be able to remove non-existing order item without error", () => {
    const order = OrderFactory.Create(customerId, address);

    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Chips", 2.5, 1);

    order.details.removeOrderItem("Salad", 1);

    expect(order.totalAmount.amount).to.equal(52.5);
    expect(order.details.orderItems.length).to.equal(2);
  });

  it("Should switch to free delivery over 50", () => {
    const order = OrderFactory.Create(customerId, address);

    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);

    expect(order.totalAmount.amount).to.equal(42.99);

    order.details.addOrderItem("Pizza", 10, 1);

    expect(order.totalAmount.amount).to.equal(50);
  });

  it("Should remove free delivery when item under 50", () => {
    const order = OrderFactory.Create(customerId, address);

    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);

    expect(order.totalAmount.amount).to.equal(42.99);

    order.details.addOrderItem("Pizza", 10, 1);

    expect(order.totalAmount.amount).to.equal(50);

    order.details.removeOrderItem("Pizza", 2);

    expect(order.totalAmount.amount).to.equal(42.99);
  });
});
