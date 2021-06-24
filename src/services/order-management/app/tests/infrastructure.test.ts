import "mocha";
import { assert, expect } from "chai";
import { IOrder, OrderFactory } from "../src/domain/entities/order";
import { Orders } from "../src/domain/entities/order-repository";
import { PutItemInput, Converter } from "aws-sdk/clients/dynamodb";
import { DomainEvents } from "node-js-ddd/dist/events/domain-event-handling";
import { OrderRepositoryFaunaDbImpl } from "../src/infrastructure/order-repository-fauna-db";
import { doesNotMatch } from "assert";

const customerId = "consulting@jameseastham.co.uk";
const _orderRepo = new OrderRepositoryFaunaDbImpl(
  ""
);
let testOrder: IOrder;

describe("Infrastructure tests", () => {
  beforeEach(async function () {
    DomainEvents.registerCallbackHandler((type, eventRaised) => {});

    testOrder = OrderFactory.Create(customerId);

    await _orderRepo.addNew(testOrder);
  });

  afterEach(async function () {
    // await _orderRepo.delete(testOrder.orderNumber);
  });

  it("FaunaDB query test", (done) => {
    setTimeout(async function () {
      const order = await _orderRepo.getSpecific(
        customerId,
        testOrder.orderNumber
      );

      expect(order.orderNumber).to.equal(testOrder.orderNumber);

      console.log(order.id);
      done();
    }, 500);
  });

  it("FaunaDB update test", (done) => {
    setTimeout(async function () {
      const order = await _orderRepo.getSpecific(
        customerId,
        testOrder.orderNumber
      );

      order.cancel();

      await _orderRepo.update(order);

      done();
    }, 500);
  });
});
