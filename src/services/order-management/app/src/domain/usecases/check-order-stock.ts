import { Orders } from "../entities/order-repository";
import { OrderFactory } from "../entities/order";
import { Logger } from "../../common/logger";
import {
  DomainEvents,
  IHandler,
} from "node-js-ddd/dist/events/domain-event-handling";
import { OrderCreatedEvent } from "../events/order-created/order-created";
import { IAddress } from "../entities/address";
import { StockChecker } from "../services/stock-check-service";

export interface CheckOrderStockUseCase {
  orderId: string;
  customerId: string;
}

export interface CheckOrderStockResponse {
  results: string[];
  fullyStocked: boolean;
}

export class CheckOrderStockCommandHandler {
  private _orderRepo: Orders;
  private _logger: Logger;
  private _stockChecker: StockChecker;

  constructor(orderRepo: Orders, stockChecker: StockChecker, logger: Logger) {
    this._orderRepo = orderRepo;
    this._logger = logger;
    this._stockChecker = stockChecker;
  }

  async execute(
    request: CheckOrderStockUseCase
  ): Promise<CheckOrderStockResponse> {
    this._logger.logInformation(`Checking stock for ${request.orderId}`);

    const order = await this._orderRepo.getSpecific(
      request.customerId,
      request.orderId
    );

    await order.details.checkStock(this._stockChecker);

    this._logger.logInformation(`Stock check complete: ${order.details.isFullyStocked}`);

    await this._orderRepo.update(order);

    return {
      results: order.details.orderItems.map(item => {return item.stockCheckResult}),
      fullyStocked: order.details.isFullyStocked,
    };
  }
}
