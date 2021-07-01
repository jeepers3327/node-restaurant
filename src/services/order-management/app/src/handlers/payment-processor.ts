import { OrderRepositoryFaunaDbImpl } from '../infrastructure/order-repository-fauna-db';
import { OrderAcceptanceState } from '../infrastructure/state-machine/order-acceptance-state';
import { WinstonLogger } from '../infrastructure/logger-winston';
import { ProcessPaymentCommandHandler } from '../domain/usecases/process-payment';
import { PaymentProcessingService } from '../infrastructure/payment-processing-service';

export const handler = async (evt) => {
  
  const state = new OrderAcceptanceState(evt.customerId, evt.orderNumber);
  const orders = new OrderRepositoryFaunaDbImpl(process.env.FAUNA_DB_ACCESS_KEY);

  const handler = new ProcessPaymentCommandHandler(orders, new PaymentProcessingService(), new WinstonLogger());

  const result = await handler.execute({
    orderId: evt.orderId,
    customerId: evt.customerId
  });

  state.output.paymentSuccess = result.success;
  state.output.outputMessages.push(result.message);

  return state;
};
