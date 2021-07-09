import { OrderRepositoryFaunaDbImpl } from '../infrastructure/order-repository-fauna-db';
import { OrderAcceptanceState } from '../infrastructure/state-machine/order-acceptance-state';

export const handler = async (evt) => {  
  const orders = new OrderRepositoryFaunaDbImpl(process.env.FAUNA_DB_ACCESS_KEY);

  const state = new OrderAcceptanceState(await orders.getSpecific(evt.detail.data.customerId, evt.detail.data.orderNumber));

  return state;
};