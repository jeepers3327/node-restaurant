import { IHandler } from "node-js-ddd/dist/events/domain-event-handling";
import { IOrder } from "../../src/domain/entities/order";
import { IOrderItem } from "../../src/domain/entities/order-item";
import { OrderCreatedEvent } from "../../src/domain/events/order-created/order-created";
import { PaymentProcessor } from "../../src/domain/services/payment-processor";
import { StockChecker } from "../../src/domain/services/stock-check-service";

export class MockPaymentProcessor implements PaymentProcessor {
    private shouldReturnPaymentComplete: boolean;
  
    constructor(shouldReturnPaymentComplete: boolean) {
      this.shouldReturnPaymentComplete = shouldReturnPaymentComplete;
    }
  
    process(order: IOrder): Promise<string> {
      return new Promise((resolve) => {
        if (this.shouldReturnPaymentComplete) {
          return resolve("OK");
        } else {
          return resolve(`Payment failed`);
        }
      });
    }
  }
  
  export class MockStockChecker implements StockChecker {
    private shouldReturnInStock: boolean;
  
    constructor(returnInStock: boolean) {
      this.shouldReturnInStock = returnInStock;
    }
    checkStock(item: IOrderItem): Promise<string> {
      return new Promise((resolve) => {
        if (this.shouldReturnInStock) {
          return resolve("OK");
        } else {
          return resolve(`${item.description} not in stock`);
        }
      });
    }registerCallbackHandler
  }
  
  export class MockHandler implements IHandler<OrderCreatedEvent> {
    typeToHandle = "order-created";
    handle(evt: OrderCreatedEvent): void {
        console.log(evt.eventType)
    }
  }