export interface Orders {
  getOrder(orderId: string): Promise<Order>;
}

export class Order {
  constructor(orderId?: string) {
    this.orderId = orderId ?? this.generateNewOrderNumber();
    this.items = [];
  }

  orderId: string;
  items: OrderItem[];

  addOrderItem(itemCode: string, quantity: number): OrderItem {
    let existing = false;

    this.items = this.items.map(item => {
      if (item.itemCode === itemCode) {
        existing = true;
        return new OrderItemImpl(itemCode, quantity + item.quantity, item.stockStatus);
      }
      else {
        return item
      }
    });

    if (existing === false) {
      const newItem = new OrderItemImpl(itemCode, quantity, StockStatus.UNKNOWN);
      this.items.push(newItem);
      return newItem;
    }

    return this.items.filter(p => p.itemCode === itemCode)[0];
  }

  private generateNewOrderNumber(): string {
    const result = [];
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < 5; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      );
    }

    const date = new Date();

    return `${date.getFullYear()}${date.getMonth()}${date.getDay()}${result
      .join("")
      .toUpperCase()}`;
  }
}

export enum StockStatus {
  UNKNOWN,
  INSTOCK,
  OUTOFSTOCK
}

export interface OrderItem {
  itemCode: string;
  quantity: number;
  stockStatus: StockStatus;
}

class OrderItemImpl implements OrderItem {
  private _itemCode: string;
  private _quantity: number;
  private _stockStatus: StockStatus

  constructor(itemCode: string, quantity: number, stockStatus?: StockStatus) {
    this._itemCode = itemCode;
    this._stockStatus = stockStatus ?? StockStatus.UNKNOWN;
    this._quantity = quantity;
  }

  get itemCode(): string {
    return this._itemCode;
  }

  get quantity(): number {
    return this._quantity;
  }

  get stockStatus(): StockStatus {
    return this._stockStatus;
  }
}
