import { IValueObject } from "node-js-ddd/dist/model/value-object";
import { Amount } from './amount';

export interface IOrderDelivery extends IValueObject {
  readonly description: string;
  readonly deliveryCharge: Amount;
}

export class DeliveryChargeFactory {
  static CalculateDeliveryCharge(orderValue: number): IOrderDelivery {
    if (orderValue >= 50) {
      return new FreeDelivery();
    }
    else {
      return new StandardDelivery();
    }
  }
}

abstract class OrderDelivery implements IOrderDelivery {
  equals(item: this): boolean {
    return this.description == item.description;
  }

  private readonly _description: string;
  private readonly _deliveryCharge: Amount;

  constructor(description: string, deliveryCharge: number) {
    this._description = description;
    this._deliveryCharge = new Amount(deliveryCharge, "GBP");
  }

  get description(): string {
    return this._description;
  }

  get deliveryCharge(): Amount {
    return this._deliveryCharge;
  }
}

class FreeDelivery extends OrderDelivery {
  constructor() {
    super('Free Delivery', 0);
  }
}

class StandardDelivery extends OrderDelivery {
  constructor() {
    super('Standard Delivery', 2.99);
  }
}