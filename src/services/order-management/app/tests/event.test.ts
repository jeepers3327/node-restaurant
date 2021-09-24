import { OrderStartedEvent } from "../src/core/events/order-started.event";
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { StockCheckRequestedEvent } from "../src/core/events/stock-check-requested.event";
import { OrderSubmittedEvent } from '../src/core/events/order-submitted.event';
import { Address } from '../src/core/models/address.model';

describe("Event schema tests", () => {
  it("Order started event should have properties", async () => {
    const evt: OrderStartedEvent = {
      name: 'order-started',
      orderId: "ORD1234",
      emailAddress: "test@test.com",
    };

    expect(evt.orderId).to.equal("ORD1234");
    expect(evt.emailAddress).to.equal("test@test.com");
  });

  it("Stock Check Requested event should have properties", async () => {
    const evt: StockCheckRequestedEvent = {
      name: 'stock-check-requested',
      orderId: "ORD1234",
      itemCode: 'PIZZA',
      quantity: 1
    };

    expect(evt.orderId).to.equal("ORD1234");
    expect(evt.itemCode).to.equal("PIZZA");
    expect(evt.quantity).to.equal(1);
  });

  it("Order submitted event should have properties", async () => {
    const evt: OrderSubmittedEvent = {
      name: 'order-submitted',
      orderId: "ORD1234",
      deliveryAddress: new Address('AddressLine1', '', '', '' ,'', 'TEST1234')
    };

    expect(evt.orderId).to.equal("ORD1234");
    expect(evt.deliveryAddress.addressLine1).to.equal("AddressLine1");
  });
});
