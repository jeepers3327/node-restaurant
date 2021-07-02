import { OrderRepositoryFaunaDbImpl } from '../infrastructure/order-repository-fauna-db';
import { OrderAcceptanceState } from '../infrastructure/state-machine/order-acceptance-state';
import { WinstonLogger } from '../infrastructure/logger-winston';

const logger = new WinstonLogger();

export const handler = async (evt) => {
  logger.logInformation('Received event');
  logger.logInformation(evt.orderNumber);
  
  const orders = new OrderRepositoryFaunaDbImpl(process.env.FAUNA_DB_ACCESS_KEY);

  const state = new OrderAcceptanceState(await orders.getSpecific(evt.customerId, evt.orderNumber));

  return state;
};