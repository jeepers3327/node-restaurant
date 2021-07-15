import { OrderRepositoryFaunaDbImpl } from "../infrastructure/order-repository-fauna-db";
import { StockServiceChecker } from "../infrastructure/stock-service-checker";
import { CheckOrderStockCommandHandler } from "../domain/usecases/check-order-stock";
import { WinstonLogger } from "../infrastructure/logger-winston";

const logger = new WinstonLogger();

export const handler = async (evt) => {
  logger.logInformation("Received event");
  logger.logInformation(evt.input.orderNumber);

  const orders = new OrderRepositoryFaunaDbImpl(
    process.env.FAUNA_DB_ACCESS_KEY
  );

  const handler = new CheckOrderStockCommandHandler(
    orders,
    new StockServiceChecker(),
    logger
  );

  const result = await handler.execute({
    orderId: evt.input.orderNumber,
    customerId: evt.input.customerId,
  });

  evt.output.stockCheckSuccess = result.fullyStocked;
  evt.output.outputMessages.concat(result.results);

  return evt;
};
