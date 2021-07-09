import { Orders } from "../entities/order-repository";
import { WinstonLogger } from "../../infrastructure/logger-winston";
export interface OrderDispatchedUseCase {
  orderNumber: string;
  customerId: string;
}

export class OrderDispatchedHandler {
  private _orderRepo: Orders;
  private _logger: WinstonLogger;

  constructor(orderRepository: Orders, logger: WinstonLogger) {
    this._orderRepo = orderRepository;
    this._logger = logger;
  }

  async handle(request: OrderDispatchedUseCase) : Promise<void> {
    const order = await this._orderRepo.getSpecific(
      request.customerId,
      request.orderNumber
    );

    order.dispatch();

    order.publish();

    this._orderRepo.update(order);
  }
}
