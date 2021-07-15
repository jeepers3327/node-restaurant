import { OrderRepositoryFaunaDbImpl } from "../infrastructure/order-repository-fauna-db";
import { WinstonLogger } from "../infrastructure/logger-winston";
import { OrderAcceptedCommandHandler } from "../domain/usecases/order-accepted";

export const handler = async (evt) => {
  const orders = new OrderRepositoryFaunaDbImpl(
    process.env.FAUNA_DB_ACCESS_KEY
  );

  const handler = new OrderAcceptedCommandHandler(orders, new WinstonLogger());

  await handler.execute({
    orderId: evt.input.orderNumber,
    customerId: evt.input.customerId,
    paymentComplete: evt.output.paymentComplete,
    inStock: evt.output.stockCheckSuccess,
    messages: evt.output.outputMessages,
  });

  return evt;
};
