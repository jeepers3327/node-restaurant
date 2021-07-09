import { Orders } from "../entities/order-repository";
import { Logger } from "../../common/logger";
import { PaymentProcessor } from "../services/payment-processor";

export interface ProcessPaymentUseCase {
  orderId: string;
  customerId: string;
}

export interface ProcessPaymentResponse {
  message: string;
  success: boolean;
}

export class ProcessPaymentCommandHandler {
  private _orderRepo: Orders;
  private _logger: Logger;
  private _paymentProcessor: PaymentProcessor;

  constructor(
    orderRepo: Orders,
    paymentProcessor: PaymentProcessor,
    logger: Logger
  ) {
    this._orderRepo = orderRepo;
    this._logger = logger;
    this._paymentProcessor = paymentProcessor;
  }

  async execute(
    request: ProcessPaymentUseCase
  ): Promise<ProcessPaymentResponse> {
    this._logger.logInformation(
      `Processing payment for for ${request.orderId}`
    );

    const order = await this._orderRepo.getSpecific(
      request.customerId,
      request.orderId
    );

    if (!order.details.isValid()) {
      return {
        message: "Cannot process a payment for an invalid order.",
        success: false,
      };
    }

    if (!order.details.isFullyStocked) {
      return {
        message: "Cannot process a payment that has not been stock checked.",
        success: false,
      };
    }

    const paymentResult = await this._paymentProcessor.process(order);

    this._logger.logInformation(
      `Payment processing complete: ${paymentResult}`
    );

    if (paymentResult === 'OK') {
      order.details.paymentReceivedOn(new Date());
    }

    await this._orderRepo.update(order);

    return {
      message: paymentResult,
      success: paymentResult == "OK" ? true : false,
    };
  }
}
