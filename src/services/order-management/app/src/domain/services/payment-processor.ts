import { IOrder } from "../entities/order";

export interface PaymentProcessor {
  process(order: IOrder) : Promise<string>;
}
