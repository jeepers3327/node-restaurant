import { IValueObject } from "node-js-ddd/dist/model/value-object";
import { IAddress } from "./address";
import { Amount } from './amount';

export interface IOrderDelivery extends IValueObject {
  readonly description: string;
  readonly deliveryCharge: Amount;
  readonly address: IAddress;
}

export class DeliveryChargeFactory {
  static CalculateDeliveryCharge(deliverTo: IAddress, orderValue: number): IOrderDelivery {
    if (orderValue >= 50) {
      return new FreeDelivery(deliverTo);
    }
    else {
      return new StandardDelivery(deliverTo);
    }
  }
}

abstract class OrderDelivery implements IOrderDelivery {
  equals(item: this): boolean {
    return this.description == item.description;
  }

  private readonly _description: string;
  private readonly _deliveryCharge: Amount;
  private readonly _address: IAddress;

  constructor(address: IAddress, description: string, deliveryCharge: number) {
    this._description = description;
    this._deliveryCharge = new Amount(deliveryCharge, "GBP");
    this._address = address;
  }

  get description(): string {
    return this._description;
  }

  get deliveryCharge(): Amount {
    return this._deliveryCharge;
  }

  get address(): IAddress {
    return this._address;
  }
}

class FreeDelivery extends OrderDelivery {
  constructor(deliveryAddress) {
    super(deliveryAddress, 'Free Delivery', 0);
  }
}

class StandardDelivery extends OrderDelivery {
  constructor(deliveryAddress) {
    super(deliveryAddress, 'Standard Delivery', 2.99);
  }
}