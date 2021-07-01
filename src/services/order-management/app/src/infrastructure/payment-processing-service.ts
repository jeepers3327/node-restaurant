import { IOrder } from '../domain/entities/order';
import { PaymentProcessor } from '../domain/services/payment-processor';
export class PaymentProcessingService implements PaymentProcessor{
    process(order: IOrder): Promise<string> {
        return new Promise((res) => {
            return res('OK');
        })
    }

}