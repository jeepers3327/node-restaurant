import { Orders } from "../entities/order-repository";
import { OrderFactory } from "../entities/order";
import { Logger } from '../../common/logger';

export interface CreateNewOrderUseCase {
  customerId: string;
}

export class CreateOrderCommandHandler {
  private _orderRepo: Orders;
  private _logger: Logger;

  constructor(orderRepo: Orders,
    logger: Logger) {
    this._orderRepo = orderRepo;
    this._logger = logger;
  }
  
  async execute(request: CreateNewOrderUseCase): Promise<string> {
    this._logger.logInformation(`Creating new order for ${request.customerId}`);

    const order = OrderFactory.Create(request.customerId);

    await this._orderRepo.addNew(order);

    this._logger.logInformation(`Created order ${order.orderNumber}`);

    order.publish();

    return order.orderNumber;
  }
}
