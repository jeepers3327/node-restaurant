import { OrderStartedEvent } from "../src/core/events/order-started.event";
import { expect, assert } from "chai";
import { describe, it } from "mocha";
import { StockCheckRequestedEvent } from "../src/core/events/stock-check-requested.event";
import { OrderSubmittedEvent } from "../src/core/events/order-submitted.event";
import { Address } from "../src/core/models/address.model";
import { EmailAddress } from "../src/core/models/email-address.model";
import { Order, StockStatus } from '../src/core/models/order.model';

describe("Event schema tests", () => {
  it("Can create address value object", async () => {
    const address = new Address(
      "Address line 1",
      "Address line 2",
      "Address line 3",
      "Address line 4",
      "Address line 5",
      "BB11GY"
    );

    expect(address.addressLine1).to.equal("Address line 1");
    expect(address.addressLine2).to.equal("Address line 2");
    expect(address.addressLine3).to.equal("Address line 3");
    expect(address.addressLine4).to.equal("Address line 4");
    expect(address.addressLine5).to.equal("Address line 5");
    expect(address.postcode).to.equal("BB11GY");
  });

  it("Create address without address line should error", async () => {
    assert.throws(
      () => {
        new Address(
          "",
          "Address Line 2",
          "Address Line 3",
          "Address line 4",
          "Address line 5",
          "BB11GY"
        );
      },
      Error,
      "An address must have address line 1 and postcode"
    );
  });

  it("Create address without postcode should error", async () => {
    assert.throws(
      () => {
        new Address(
          "Address line 1",
          "Address Line 2",
          "Address Line 3",
          "Address line 4",
          "Address line 5",
          ""
        );
      },
      Error,
      "An address must have address line 1 and postcode"
    );
  });

  it("Can create valid email address", async () => {
    const email = new EmailAddress("test@test.com");

    expect(email.emailAddress).to.equal("test@test.com");
    expect(email.domain).to.equal("test.com");
  });

  it("Create email with blank should error", async () => {
    assert.throws(
      () => {
        new EmailAddress("");
      },
      Error,
      "An email address must not be empty."
    );
  });

  it("Create email with invalid should error", async () => {
    assert.throws(
      () => {
        new EmailAddress("iamnotanemailaddress");
      },
      Error,
      "A valid email address must be provided."
    );
  });

  it("Can create new order", async () => {
    const order = new Order();

    expect(order.orderId.length).to.greaterThan(0);
  });

  it("Can create new order with existing order ref", async () => {
    const order = new Order('9875');

    expect(order.orderId).to.equal('9875');
  });

  it("Can add multiple order item", async () => {
    const order = new Order();
    let orderItem = order.addOrderItem('PIZZA001', 1);
    let sideItem = order.addOrderItem('SIDE002', 2);

    expect(order.items.length).to.equal(2);
    expect(orderItem.itemCode).to.equal('PIZZA001');
    expect(orderItem.quantity).to.equal(1);
    expect(orderItem.stockStatus).to.equal(StockStatus.UNKNOWN, 'Order item should default to an unknown stock status');
    expect(sideItem.itemCode).to.equal('SIDE002');
    expect(sideItem.quantity).to.equal(2);
  });

  it("Can add order item for an item that is already on the order", async () => {
    const order = new Order();
    let orderItem = order.addOrderItem('PIZZA001', 1);

    expect(order.items.length).to.equal(1);
    expect(orderItem.itemCode).to.equal('PIZZA001');
    expect(orderItem.quantity).to.equal(1);

    let newOrderItem = order.addOrderItem('PIZZA001', 2);

    expect(order.items.length).to.equal(1);
    expect(newOrderItem.itemCode).to.equal('PIZZA001');
    expect(newOrderItem.quantity).to.equal(3);
  });
});
