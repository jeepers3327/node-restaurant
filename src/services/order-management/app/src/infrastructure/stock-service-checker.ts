import { IOrderItem } from "../domain/entities/order-item";
import { StockChecker } from "../domain/services/stock-check-service";

export class StockServiceChecker implements StockChecker{
    // TODO: Add stock checker HTTP implementation once written.
    checkStock(item: IOrderItem): Promise<string> {
        return new Promise((res) => {
            return res('OK');
        })
    }
}