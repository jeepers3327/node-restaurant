import { OrderRepositoryFaunaDbImpl } from '../infrastructure/order-repository-fauna-db';
import { OrderAcceptanceState } from '../infrastructure/state-machine/order-acceptance-state';
import { StockServiceChecker } from '../infrastructure/stock-service-checker';
import { CheckOrderStockCommandHandler } from '../domain/usecases/check-order-stock';
import { WinstonLogger } from '../infrastructure/logger-winston';

export const handler = async (evt) => {
  
  const state = new OrderAcceptanceState(evt.customerId, evt.orderNumber);
  const orders = new OrderRepositoryFaunaDbImpl(process.env.FAUNA_DB_ACCESS_KEY);

  const handler = new CheckOrderStockCommandHandler(orders, new StockServiceChecker(), new WinstonLogger());

  const result = await handler.execute({
    orderId: evt.orderId,
    customerId: evt.customerId
  });

  state.output.stockCheckSuccess = result.fullyStocked;
  state.output.outputMessages.concat(result.results);

  return state;
};
