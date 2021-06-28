import { IValueObject } from "node-js-ddd/dist/model/value-object";
import { Amount } from "./amount";

export interface IOrderItem extends IValueObject {
  readonly description: string;
  readonly value: Amount;
  readonly quantity: number;
  stockCheckResult: string;
  orderAnother(): void;
  removeOne(): void;
}

export class OrderItemFactory {
  static Create(
    description: string,
    value: number,
    quantity: number
  ): IOrderItem {
    return new OrderItem(description, value, quantity);
  }
}

class OrderItem implements IOrderItem {
  equals(item: this): boolean {
    return item.description == this.description;
  }
  private readonly _description: string;
  private readonly _value: Amount;
  private _quantity: number;
  stockCheckResult: string;

  constructor(description: string, value: number, initialQuantity: number) {
    this._description = description;
    this._value = new Amount(value, "GBP");
    this._quantity = initialQuantity;
  }

  get description(): string {
    return this._description;
  }

  get value(): Amount {
    return this._value;
  }

  get quantity(): number {
    return this._quantity;
  }

  orderAnother(): void {
    this._quantity++;
  }

  removeOne(): void {
    if (this._quantity == 0) {
      return;
    }

    this._quantity--;
  }
}
