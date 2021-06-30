import { Amount } from "./amount";
import { IOrderDelivery, DeliveryChargeFactory } from "./order-delivery";
import { IOrderItem, OrderItemFactory } from "./order-item";
import { IValueObject } from "node-js-ddd/dist/model/value-object";
import { IAddress } from "./address";
import { StockChecker } from "../services/stock-check-service";

export interface IOrderDetails extends IValueObject {
  readonly orderItems: IOrderItem[];
  readonly orderAmount: Amount;
  readonly dispatchDate?: Date;
  readonly delivery: IOrderDelivery;
  readonly isFullyStocked: boolean;
  readonly stockCheckDate?: Date;

  addOrderItem(
    description: string,
    value: number,
    quantity: number
  ): IOrderItem;
  removeOrderItem(itemToRemove: string, quantityToRemove: number): void;
  dispatchedOn(date: Date): void;
  isValid(): boolean;
  checkStock(stockChecker: StockChecker);
}

export class OrderDetailFactory {
  static Create(deliveryAddress: IAddress): IOrderDetails {
    return new OrderDetails(deliveryAddress);
  }

  static CreateFromObject(object: any): IOrderDetails {
    const details = new OrderDetails(object["_delivery"]["_address"]);

    for (let index = 0; index < object["_orderItems"].length; index++) {
      details.addOrderItem(
        object["_orderItems"][index]["_description"],
        object["_orderItems"][index]["_value"]["_amount"],
        object["_orderItems"][index]["_quantity"]
      );
    }

    details._dispatchDate = object["_dispatchDate"];

    return details;
  }
}

class OrderDetails implements IOrderDetails {
  _orderItems: IOrderItem[] = [];
  private _delivery: IOrderDelivery;
  _dispatchDate?: Date;
  _deliveryAddress: IAddress;
  _isFullyStocked: boolean;
  _stockCheckedOn?: Date;

  constructor(deliveryAddress: IAddress) {
    this._orderItems = [];
    this._deliveryAddress = deliveryAddress;
    this._delivery = DeliveryChargeFactory.CalculateDeliveryCharge(
      deliveryAddress,
      -1
    );
  }
  isValid(): boolean {
    if (
      this._deliveryAddress === undefined ||
      this._deliveryAddress === null ||
      this._orderItems.length == 0
    ) {
      return false;
    } else {
      return true;
    }
  }

  static Create(deliveryAddress: IAddress): OrderDetails {
    const details = new OrderDetails(deliveryAddress);

    return details;
  }

  get stockCheckedOn(): Date {
    return this._stockCheckedOn;
  }

  get isFullyStocked(): boolean {
    return this._isFullyStocked;
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

      return null;
    });

    if (indexToRemove > -1) {
      this._orderItems.splice(indexToRemove, 1);
    }

    this.recalculateDelivery();
  }

  dispatchedOn(date: Date) {
    this._dispatchDate = date;
  }

  async checkStock(stockChecker: StockChecker) {
    this._isFullyStocked = true;

    if (!this.isValid()) {
      throw new Error("Cannot check stock for an invalid order.");
    }

    await this.orderItems.forEach(async (orderItem) => {
      const stockCheckResult = await stockChecker.checkStock(orderItem);

      if (stockCheckResult != "OK") {
        this._isFullyStocked = false;
      }

      orderItem.stockCheckResult = stockCheckResult;
    });
  }

  private recalculateDelivery() {
    this._delivery = DeliveryChargeFactory.CalculateDeliveryCharge(
      this._deliveryAddress,
      this.orderAmount.amount
    );
  }

  equals(item: this): boolean {
    return item != undefined;
  }
}
