import { OrderRepositoryFaunaDbImpl } from "../infrastructure/order-repository-fauna-db";
import { WinstonLogger } from "../infrastructure/logger-winston";
import { CancelOrderCommandHandler } from "../domain/usecases/cancel-order";
import { InfrastructureSetup } from "../infrastructure/domain-event-handlers/add-handlers";

export const handler = async (evt): Promise<void> => {
  InfrastructureSetup.addHandlers();

  const orders = new OrderRepositoryFaunaDbImpl(
    process.env.FAUNA_DB_ACCESS_KEY
  );

  const handler = new CancelOrderCommandHandler(orders, new WinstonLogger());

  await handler.execute(evt.detail);
};
