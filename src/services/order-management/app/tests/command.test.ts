import { expect, assert } from "chai";
import { instance, mock, when, verify, anything } from "ts-mockito";
import { describe, it } from "mocha";
import { StartOrderCommandHandler } from "../src/core/commands/start-order.command";
import { MockEventBus } from "./mocks/mocks";
import { AddOrderItemCommandHandler } from "../src/core/commands/add-order-item.command";
import { Events } from "../src/core/events/events";
import { StockCheckRequestedEvent } from "../src/core/events/stock-check-requested.event";
import { Order, Orders } from "../src/core/models/order.model";

const eventBus = new MockEventBus();

describe("Command tests", () => {
  it("Start Order Command - Should complete successfully with valid email address input", async () => {
    let handler = new StartOrderCommandHandler(eventBus);

    let result = handler.handle({
      emailAddress: "test@test.com",
    });

    expect(result.data.length).to.greaterThan(0);
    expect(result.success).to.equal(true);
    expect(result.friendlyMessage).to.equal("OK");
    expect(result.rowsAffected).to.equal(1);
  });

  it("Start Order Command - Should fail when a empty email address is sent", async () => {
    let handler = new StartOrderCommandHandler(eventBus);

    let result = handler.handle({
      emailAddress: "",
    });

    expect(result.data.length).to.equal(0);
    expect(result.success).to.equal(false);
    expect(result.friendlyMessage).to.equal(
      "A valid email address must be provided."
    );
    expect(result.rowsAffected).to.equal(0);
  });

  it("Start Order Command - Should fail when an invalid email address is sent", async () => {
    let handler = new StartOrderCommandHandler(eventBus);

    let result = handler.handle({
      emailAddress: "myemailaddress",
    });

    expect(result.data.length).to.equal(0);
    expect(result.success).to.equal(false);
    expect(result.friendlyMessage).to.equal(
      "A valid email address must be provided."
    );
    expect(result.rowsAffected).to.equal(0);
  });

  it("Add Order Item Command - Should complete and publish event", async () => {
    let calledEvent = "";

    let mockEventBus = mock<Events>();

    let mockOrders = mock<Orders>();

    when(mockEventBus.publish(anything())).thenCall((callback) => {
      calledEvent = callback.name;
    });

    when(mockOrders.getOrder("ORD1234")).thenReturn(
      new Promise((res) => {
        return res(new Order("ORD1234"));
      })
    );

    let handler = new AddOrderItemCommandHandler(
      instance(mockEventBus),
      instance(mockOrders)
    );

    await handler.handle({
      orderId: "ORD1234",
      itemCode: "PIZZA001",
      quantity: 1,
    });

    verify(mockEventBus.publish(anything())).once();
    expect(calledEvent).to.equal("stock-check-requested");
  });

  it("Add Order Item Command - When Invalid Order Should Error", async () => {
    let mockEventBus = mock<Events>();

    let mockOrders = mock<Orders>();

    let handler = new AddOrderItemCommandHandler(
      instance(mockEventBus),
      instance(mockOrders)
    );

    let commandResponse = await handler.handle({
      orderId: "NOTAVALIDORDER",
      itemCode: "PIZZA001",
      quantity: 1,
    });

    verify(mockEventBus.publish(anything())).never();
  });
});
