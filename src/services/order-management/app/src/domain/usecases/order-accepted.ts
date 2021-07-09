import { Logger } from "../../common/logger";
import { Orders } from "../entities/order-repository";
import { CancelOrderCommandHandler } from "./cancel-order";

export interface OrderAcceptedUseCase {
    orderId: string;
    customerId: string;
    paymentComplete: boolean;
    inStock: boolean;
    messages: string[];
}

export class OrderAcceptedCommandHandler {
    private _orderRepo: Orders;
    private _logger: Logger;
    private _cancelOrderHandler: CancelOrderCommandHandler;
  
    constructor(orderRepo: Orders, logger: Logger) {
      this._orderRepo = orderRepo;
      this._logger = logger;
      this._cancelOrderHandler = new CancelOrderCommandHandler(orderRepo, logger);
    }
  
    async execute(
      request: OrderAcceptedUseCase
    ): Promise<void> {
        this._logger.logInformation('Processing order acceptance');

        const order = await this._orderRepo.getSpecific(request.customerId, request.orderId);  

        if (!request.paymentComplete || !request.inStock)
        {
            this._logger.logWarning('Either payment is incomplete or not in stock, cancelling order');

            await this._cancelOrderHandler.execute({
                orderNumber: request.orderId,
                customerId: request.customerId,
                reason: 'Payment is incomplete or order is not in stock.'
            });
        }
        else
        {
            this._logger.logInformation('Accepting order');

            order.accept();
        }

        console.log('Publishing events');

        order.publish();

        console.log('Done');
    }

}