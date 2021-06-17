import { WinstonLogger } from "../infrastructure/logger-winston";
import { OrderRepositoryDynamoDb } from "../infrastructure/order-repository-dynamo-db";
import { OrderDispatchedHandler } from "../domain/usecases/order-dispatched";

export const handler = async (event): Promise<void> => {
  const logger = new WinstonLogger();

  const orderDispatchedHandler = new OrderDispatchedHandler(
    new OrderRepositoryDynamoDb(),
    logger
  );

  logger.logInformation(JSON.stringify(event));
};
