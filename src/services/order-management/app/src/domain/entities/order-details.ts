import { Amount } from "./amount";
import { IOrderDelivery, DeliveryChargeFactory } from "./order-delivery";
import { IOrderItem, OrderItemFactory } from './order-item';
import { IValueObject } from "node-js-ddd/dist/model/value-object";

export interface IOrderDetails extends IValueObject {
  readonly orderItems: IOrderItem[];
  readonly orderAmount: Amount;
  readonly dispatchDate?: Date;
  readonly delivery: IOrderDelivery;

  addOrderItem(
    description: string,
    value: number,
    quantity: number
  ): IOrderItem;
  removeOrderItem(itemToRemove: string, quantityToRemove: number): void;
  dispatchedOn(date: Date): void;
}

export class OrderDetailFactory {
  static Create(): IOrderDetails {
    return new OrderDetails();
  }

  static CreateFromObject(object: any): IOrderDetails
  {
    const details = new OrderDetails();

    for (let index = 0; index < object['_orderItems'].length; index++) {
      details.addOrderItem(object['_orderItems'][index]['_description'], object['_orderItems'][index]['_value']['_amount'], object['_orderItems'][index]['_quantity']);      
    }

    details._dispatchDate = object['_dispatchDate'];

    return details;
  }
}

class OrderDetails implements IOrderDetails {
  _orderItems: IOrderItem[];
  private _delivery: IOrderDelivery;
  _dispatchDate?: Date;

  constructor() {
    this._orderItems = [];
    this._delivery = DeliveryChargeFactory.CalculateDeliveryCharge(-1);
  }

  static Create(): OrderDetails {
    const details = new OrderDetails();

    return details;
  }

  get orderItems(): IOrderItem[] {
    return this._orderItems;
  }

  get dispatchDate(): Date | undefined {
    return this._dispatchDate;
  }

  get orderAmount(): Amount {
    let total = 0;

    this._orderItems.forEach((item) => {
      total += item.value.amount * item.quantity;
    });

    return new Amount(total + this._delivery.deliveryCharge.amount, "GBP");
  }

  get delivery(): IOrderDelivery {
    return this._delivery;
  }

  addOrderItem(
    description: string,
    value: number,
    quantity: number
  ): IOrderItem {
    this._orderItems.forEach((currentItem) => {
      if (currentItem.description == description) {
        quantity = quantity + currentItem.quantity;
      }
    });

    this.removeOrderItem(description, quantity);

    const newItem = OrderItemFactory.Create(description, value, quantity);

    this._orderItems.push(newItem);

    this.recalculateDelivery();

    return newItem;
  }

  removeOrderItem(itemToRemove: string, quantityToRemove: number): void {
    let indexToRemove = -1;

    this._orderItems.forEach((currentItem) => {
      if (currentItem.description == itemToRemove) {
        if (currentItem.quantity - quantityToRemove < 1) {
          indexToRemove = this._orderItems.indexOf(currentItem);
        } else {
          currentItem.removeOne();
        }

        return currentItem;
      }
    });

    if (indexToRemove > -1) {
      this._orderItems.splice(indexToRemove, 1);
    }

    this.recalculateDelivery();
  }

  dispatchedOn(date: Date) {
    this._dispatchDate = date;
  }

  private recalculateDelivery() {
    this._delivery = DeliveryChargeFactory.CalculateDeliveryCharge(
      this.orderAmount.amount
    );
  }

  equals(item: this): boolean {
    return item != undefined;
  }
}
