import { WinstonLogger } from "../infrastructure/logger-winston";
import { OrderRepositoryDynamoDb } from "../infrastructure/order-repository-dynamo-db";
import { OrderDispatchedHandler } from "../domain/usecases/order-dispatched";
import { OrderRepositoryFaunaDbImpl } from '../infrastructure/order-repository-fauna-db';

export const handler = async (event): Promise<void> => {
  const logger = new WinstonLogger();

  const orderDispatchedHandler = new OrderDispatchedHandler(
    new OrderRepositoryFaunaDbImpl(process.env.FAUNA_DB_ACCESS_KEY),
    logger
  );

  logger.logInformation(JSON.stringify(event));
};
