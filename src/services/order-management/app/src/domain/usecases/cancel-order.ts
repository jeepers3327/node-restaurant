import { Logger } from "../../common/logger";
import { Orders } from "../entities/order-repository";

export interface CancelOrderUseCase {
  customerId: string;
  orderNumber: string;
}

export class CancelOrderCommandHandler {
  private _orderRepo: Orders;
  private _logger: Logger;
  constructor(orderRepository: Orders, logger: Logger) {
    this._orderRepo = orderRepository;
    this._logger = logger;
  }

  async execute(request: CancelOrderUseCase) {
    this._logger.logInformation(`Received request to cancel ${request.orderNumber} for ${request.customerId}`);

    const order = await this._orderRepo.getSpecific(request.customerId, request.orderNumber);

    this._logger.logInformation("Found order, cancelling");

    order.cancel();

    await this._orderRepo.update(order);

    await order.publish();
  }
}
