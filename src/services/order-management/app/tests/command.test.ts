import "mocha";
import { expect } from "chai";
import { CreateOrderCommandHandler } from '../src/domain/usecases/create-new-order';
import { OrderRepositoryInMemoryImpl } from "../src/infrastructure/order-repository-in-memory";
import { WinstonLogger } from "../src/infrastructure/logger-winston";
import {
  DomainEvents,
  IHandler,
} from "node-js-ddd/dist/events/domain-event-handling";
import { OrderCreatedEvent } from "../src/domain/events/order-created/order-created";

const customerId = "consulting@jameseastham.co.uk";
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
      items: [{
        description: '1234',
        quantity: 1,
        price: 150
      }]
    });

    expect(newOrderNumber.length).to.greaterThan(0);
  });
});

class MockHandler implements IHandler<OrderCreatedEvent> {
  typeToHandle = "order-created";
  handle(evt: OrderCreatedEvent): void {
  }
}
