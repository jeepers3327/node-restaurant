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

    if (!order.details.isValid()) {
      throw new Error("Cannot check stock for an invalid order.");
    }

    let stockCheckMessages = [];
    let isFullyStocked = true;

    await order.details.orderItems.forEach(async (orderItem) => {
      this._logger.logInformation(
        `Checking stock for ${orderItem.description} with a quantity of ${orderItem.quantity}`
      );

      const stockCheckResult = await this._stockChecker.checkStock(orderItem);

      this._logger.logInformation(`Result is ${stockCheckResult}`);

      if (stockCheckResult != 'OK') {
        isFullyStocked = false;
      }

      stockCheckMessages.push(stockCheckMessages);
    });

    this._logger.logInformation(`Stock check complete: ${isFullyStocked}`);

    return {
      results: stockCheckMessages,
      fullyStocked: isFullyStocked,
    };
  }
}
