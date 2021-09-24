import { Event } from "./events";

export class StockCheckRequestedEvent implements Event {
    get name(): string {
        return 'stock-check-requested'
    }
    
    orderId: string;
    itemCode: string;
    quantity: number;

    constructor(init?: Partial<StockCheckRequestedEvent>) {
      Object.assign(this, init);
    }
}