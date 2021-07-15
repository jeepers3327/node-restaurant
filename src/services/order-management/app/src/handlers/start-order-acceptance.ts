import { CreateOrderCommandHandler } from "../domain/usecases/create-new-order";
import { WinstonLogger } from "../infrastructure/logger-winston";
import { OrderRepositoryFaunaDbImpl } from "../infrastructure/order-repository-fauna-db";
import { OrderAcceptanceState } from "../infrastructure/state-machine/order-acceptance-state";

const logger = new WinstonLogger();

export const handler = async (evt) => {
  logger.logInformation(`Received event:`);
  logger.logInformation(evt);

  const orders = new OrderRepositoryFaunaDbImpl(
    process.env.FAUNA_DB_ACCESS_KEY
  );

  const handler = new CreateOrderCommandHandler(orders, logger);

  logger.logInformation("Handling");

  await handler.execute(evt.detail);

  logger.logInformation("Building state");

  const state = new OrderAcceptanceState(
    evt.detail.customerId,
    evt.detail.orderNumber
  );

  return state;
};
