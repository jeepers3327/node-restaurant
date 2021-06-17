import { IValueObject } from "node-js-ddd/dist/model/value-object";
export class Amount implements IValueObject {
  equals(item: this): boolean {
    return this._amount == item._amount && this._currency == item._currency;
  }
  private readonly _amount: number;
  private readonly _currency: string;

  constructor(amount: number, currency: string) {
    this._amount = amount;
    this._currency = currency;
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }
}
