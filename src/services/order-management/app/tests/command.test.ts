import "mocha";
import { expect } from "chai";
import { CreateOrderCommandHandler } from '../src/domain/usecases/create-new-order';
import { OrderRepositoryInMemoryImpl } from "./mocks/order-repository";
import { WinstonLogger } from "../src/infrastructure/logger-winston";

const customerId = "consulting@jameseastham.co.uk";
const handler = new CreateOrderCommandHandler(new OrderRepositoryInMemoryImpl(), new WinstonLogger());

describe("Create order command tests", () => {
  beforeEach(function () {
  });
  it("Should be able to execute a create order command", async () => {
    const newOrderNumber = await handler.execute({
      customerId: customerId
    });

    expect(newOrderNumber.length).to.greaterThan(0);
  });
});
