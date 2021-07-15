import { ICommand } from "../../common/command";
import { Logger } from "../../common/logger";
import { Orders } from "../entities/order-repository";

export class CancelOrderCommand implements ICommand {
  get name(): string {
    return "cancel-order";
  }
  customerId: string;
  orderNumber: string;
  reason: string;
}

export class CancelOrderCommandHandler {
  private _orderRepo: Orders;
  private _logger: Logger;
  constructor(orderRepository: Orders, logger: Logger) {
    this._orderRepo = orderRepository;
    this._logger = logger;
  }

  async execute(request: CancelOrderCommand): Promise<void> {
    this._logger.logInformation(
      `Received request to cancel ${request.orderNumber} for ${request.customerId}`
    );

    const order = await this._orderRepo.getSpecific(
      request.customerId,
      request.orderNumber
    );

    this._logger.logInformation("Found order, cancelling");

    order.cancel(request.reason);

    await this._orderRepo.update(order);

    await order.publish();
  }
}
