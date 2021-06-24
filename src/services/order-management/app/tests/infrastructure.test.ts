import "mocha";
import { expect } from "chai";
import { IOrder, OrderFactory } from "../src/domain/entities/order";
import { DomainEvents } from "node-js-ddd/dist/events/domain-event-handling";
import { OrderRepositoryFaunaDbImpl } from "../src/infrastructure/order-repository-fauna-db";
import { IAddress } from '../src/domain/entities/address';

const customerId = "consulting@jameseastham.co.uk";
const address: IAddress = {
  addressLine1: 'Test address',
  country: 'GB',
  postcode: 'BB4456'
}
const _orderRepo = new OrderRepositoryFaunaDbImpl(
  ""
);
let testOrderNumber = '202154HATU9';

describe("Infrastructure tests", () => {
  beforeEach(async function () {
    DomainEvents.registerCallbackHandler((type, eventRaised) => {});
  });

  afterEach(async function () {
    //await _orderRepo.delete(testOrder.orderNumber);
  });

  it("FaunaDB query test", () => {
    setTimeout(async function () {
      const order = await _orderRepo.getSpecific(
        customerId,
        testOrderNumber
      );

      expect(order.orderNumber).to.equal(testOrderNumber);
      expect(order.details.orderItems.length).to.equal(3);
      expect(order.id.length).to.greaterThan(0);
    }, 1500);
  });

  it("FaunaDB update test", async () => {
    const order = await _orderRepo.getSpecific(
      customerId,
      testOrderNumber
    );

    order.cancel();

    await _orderRepo.update(order);
  });

  it("FaunaDB get customer order test", async () => {
    const orders = await _orderRepo.getForCustomer(
      customerId
    );

    expect(orders.length).to.greaterThanOrEqual(1);
  });
});
