import { Aggregate, IAggregate } from "node-js-ddd/dist/model/aggregate";
import { Amount } from "./amount";
import { IOrderDetails, OrderDetailFactory } from './order-details';
import { OrderCreatedEvent } from "../events/order-created/order-created";
import { OrderCancelledEvent } from "../events/order-cancelled/order-cancelled";

export interface IOrder extends IAggregate {
  readonly orderNumber: string;
  readonly customerId: string;
  readonly orderDate: Date;
  readonly totalAmount: Amount;
  readonly details: IOrderDetails; 
  readonly status: string;

  dispatch(): void;
  cancel(): void;
  asJson(): string;
}

export class OrderFactory {
  static Create(
    customerId: string,
    orderNumber?: string,
    orderDate?: Date
  ): IOrder {
    if (customerId.length === 0) {
      throw Error("Customer id cannot be empty");
    }

    const order = Order.Create(customerId);

    if (orderNumber != null && orderNumber != undefined) {
      order._orderNumber = orderNumber;
    }

    if (orderDate != null && orderDate != undefined) {
      order._orderDate = orderDate;
    }

    return order;
  }

  static CreateFromObject(object: any): IOrder
  {
    const order = Order.Create(object['_customerId']);

    order._orderNumber = object['_orderNumber'];
    order._orderState = object['_orderState'];
    order._details = OrderDetailFactory.CreateFromObject(object['_details']);

    return order;
  }
}

class Order extends Aggregate implements IOrder {
  private _customerId: string;

  _details: IOrderDetails;
  _orderDate: Date;
  _orderNumber: string;
  _orderState: string;

  constructor(customerId: string, orderNumber: string, orderDate: Date) {
    super(orderNumber);

    this._customerId = customerId;
    this._orderNumber = orderNumber;
    this._orderDate = orderDate;
    this._details = OrderDetailFactory.Create();
    this._orderState = "New";
  }

  static Create(customerId: string): Order {
    const order = new Order(
      customerId,
      Order.generateNewOrderNumber(),
      new Date()
    );

    order.addDomainEvent(
      new OrderCreatedEvent(order, {
        orderNumber: order.orderNumber,
        customerId: customerId,
      })
    );

    return order;
  }

  get orderNumber(): string {
    return this._orderNumber;
  }

  get customerId(): string {
    return this._customerId;
  }

  get orderDate(): Date {
    return this._orderDate;
  }

  get status(): string {
    return this._orderState;
  }

  get totalAmount(): Amount {
    const total = this._details.orderAmount.amount;

    return new Amount(total, "GBP");
  }

  get details(): IOrderDetails {
    return this._details;
  }

  dispatch() {
    if (this._orderState == "Cancelled") {
      throw Error("Cannot dispatch a cancelled order");
    }

    if (this._orderState == "Dispatched") {
      throw Error("Order has already been dispatched");
    }

    const dispatchDate = new Date();

    this._orderState = "Dispatched";
    this._details.dispatchedOn(dispatchDate);
  }

  cancel() {
    if (this._orderState == "Dispatched") {
      throw Error("Cannot cancel a dispatched order");
    }

    if (this._orderState == "Cancelled") {
      throw Error("Order has already been cancelled");
    }

    this._orderState = "Cancelled";

    this.addDomainEvent(
      new OrderCancelledEvent(this, {
        orderNumber: this.orderNumber,
        customerId: this.customerId,
      })
    );
  }

  asJson(): string {
    this.clearDomainEvents();
    return JSON.stringify(this);
  }

  private static generateNewOrderNumber() {
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
