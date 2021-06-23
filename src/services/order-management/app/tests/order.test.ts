import "mocha";
import { assert, expect } from "chai";
import { OrderFactory } from "../src/domain/entities/order";
import { PutItemInput, Converter } from "aws-sdk/clients/dynamodb";
import { DomainEvents } from 'node-js-ddd/dist/events/domain-event-handling';

const customerId = "consulting@jameseastham.co.uk";

describe("Order model", () => {
  beforeEach(function () {
    DomainEvents.registerCallbackHandler((type, eventRaised) => {});
  });

  it("Should be able to create an order", () => {
    const order = OrderFactory.Create(customerId);

    expect(order.customerId).to.equal(customerId);
    expect(order.orderNumber.length).to.greaterThan(0);
  });

  it("Should be able to create an order and dispatch", () => {
    const order = OrderFactory.Create(customerId);
    order.dispatch();

    expect(order.status).to.equal("Dispatched");
    expect(order.details.dispatchDate).to.not.be.an("undefined");
  });

  it("Should be able to create an order and cancel", () => {
    const order = OrderFactory.Create(customerId);
    order.cancel();

    expect(order.status).to.equal("Cancelled");
  });

  it("Should not be able to dispatch a cancelled order", () => {
    const order = OrderFactory.Create(customerId);
    order.cancel();

    assert.throws(
      () => order.dispatch(),
      Error,
      "Cannot dispatch a cancelled order"
    );
  });

  it("Should not be able to dispatch a dispatched order", () => {
    const order = OrderFactory.Create(customerId);
    order.dispatch();

    assert.throws(
      () => order.dispatch(),
      Error,
      "Order has already been dispatched"
    );
  });

  it("Should not be able to cancel a dispatched order", () => {
    const order = OrderFactory.Create(customerId);
    order.dispatch();

    assert.throws(
      () => order.cancel(),
      Error,
      "Cannot cancel a dispatched order"
    );
  });

  it("Should not be able to create an order with an empty customer id", () => {
    assert.throws(
      () => OrderFactory.Create(""),
      Error,
      "Customer id cannot be empty"
    );
  });

  it("Should be able to create an order from existing order number", () => {
    const order = OrderFactory.Create(customerId, "1234", new Date());

    expect(order.customerId).to.equal(customerId);
    expect(order.orderNumber).to.equal("1234");
  });

  it("Should be able to add an order item", () => {
    const order = OrderFactory.Create(customerId);

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
    const order = OrderFactory.Create(customerId);

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
    const order = OrderFactory.Create(customerId);

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
    const order = OrderFactory.Create(customerId);

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
    const order = OrderFactory.Create(customerId);

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
    const order = OrderFactory.Create(customerId);

    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);

    expect(order.totalAmount.amount).to.equal(42.99);

    order.details.addOrderItem("Pizza", 10, 1);

    expect(order.totalAmount.amount).to.equal(50);
  });

  it("Should remove free delivery when item under 50", () => {
    const order = OrderFactory.Create(customerId);

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

  it("Should allow marshall and unmarshall", () => {
    const order = OrderFactory.Create(customerId);

    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.addOrderItem("Pizza", 10, 1);
    order.details.removeOrderItem("Pizza", 2);

    const marshalled = Converter.marshall(order);

    const unmarshalled = Converter.unmarshall(marshalled);

    const unmarshalledOrder = OrderFactory.CreateFromObject(unmarshalled);

    expect(unmarshalledOrder.customerId).to.equal(order.customerId);
    expect(unmarshalledOrder.orderNumber).to.equal(order.orderNumber);
    expect(unmarshalledOrder.orderDate.toDateString()).to.equal(
      order.orderDate.toDateString()
    );
    expect(unmarshalledOrder.status).to.equal(order.status);
    expect(unmarshalledOrder.details.orderItems.length).to.equal(
      order.details.orderItems.length
    );
    expect(unmarshalledOrder.totalAmount.amount).to.equal(
      order.totalAmount.amount
    );
    expect(unmarshalledOrder.details.delivery.deliveryCharge.amount).to.equal(
      order.details.delivery.deliveryCharge.amount
    );
  });
});
