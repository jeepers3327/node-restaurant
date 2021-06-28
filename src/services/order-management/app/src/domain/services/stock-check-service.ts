import { IOrderItem } from "../entities/order-item";

export interface StockChecker {
  checkStock(item: IOrderItem) : Promise<string>;
}
