import { Aggregate, IAggregate } from "node-js-ddd/dist/model/aggregate";
import { Amount } from "./amount";
import { IOrderDetails, OrderDetailFactory } from "./order-details";
import { OrderCreatedEvent } from "../events/order-created/order-created";
import { OrderCancelledEvent } from "../events/order-cancelled/order-cancelled";
import { IAddress } from "./address";
import { OrderAcceptedEvent } from "../events/order-accepted/order-accepted-event";

export interface IOrder extends IAggregate {
  readonly orderNumber: string;
  readonly customerId: string;
  readonly orderDate: Date;
  readonly totalAmount: Amount;
  readonly details: IOrderDetails;
  readonly status: string;

  dispatch(): void;
  accept(): void;
  cancel(cancellationReason: string): void;
  asJson(): any;
}

export class OrderFactory {
  static Create(
    customerId: string,
    deliveryAddress: IAddress,
    orderNumber?: string,
    orderDate?: Date
  ): IOrder {
    if (customerId.length === 0) {
      throw Error("Customer id cannot be empty");
    }

    const order = Order.Create(customerId, deliveryAddress);

    if (orderNumber != null && orderNumber != undefined) {
      order._orderNumber = orderNumber;
    }

    if (orderDate != null && orderDate != undefined) {
      order._orderDate = orderDate;
    }

    return order;
  }

  static CreateFromObject(object: any): IOrder {
    const order = new Order(
      object["_customerId"],
      object["_orderNumber"],
      object["_orderDate"],
      object["_details"]["_delivery"]["_address"],
      object["_id"]
    );
    order._details = OrderDetailFactory.CreateFromObject(object["_details"]);
    order._orderState = object["_orderState"];

    return order;
  }
}

class Order extends Aggregate implements IOrder {
  private _customerId: string;

  _details: IOrderDetails;
  _orderDate: Date;
  _orderNumber: string;
  _orderState: string;

  constructor(
    customerId: string,
    orderNumber: string,
    orderDate: Date,
    deliveryAddress: IAddress,
    id = ''
  ) {
    super(id);
    
    this._customerId = customerId;
    this._orderNumber = orderNumber;
    this._orderDate = orderDate;
    this._details = OrderDetailFactory.Create(deliveryAddress);
    this._orderState = "New";
  }

  static Create(customerId: string, deliveryAddress: IAddress): Order {
    const order = new Order(
      customerId,
      Order.generateNewOrderNumber(),
      new Date(),
      deliveryAddress
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

  accept() {
    if (this._orderState == "Cancelled") {
      throw Error("Cannot dispatch a cancelled order");
    }

    if (this._orderState == "Dispatched") {
      throw Error("Order has already been dispatched");
    }

    if (!this._details.isFullyStocked || this.details.paymentReceivedOn === undefined)
    {
      throw Error("Cannot accept an order that has not been paid and stock checked");
    }

    this._orderState = 'Accepted';

    this.addDomainEvent(new OrderAcceptedEvent(this, {
      orderNumber: this.orderNumber,
      customerId: this.customerId
    }));
  }

  cancel(cancellationReason: string) {
    if (this._orderState == "Dispatched") {
      throw Error("Cannot cancel a dispatched order");
    }

    if (this._orderState == "Cancelled") {
      throw Error("Order has already been cancelled");
    }

    this._orderState = "Cancelled";
    this._details.addCancellationReason(cancellationReason);

    this.addDomainEvent(
      new OrderCancelledEvent(this, {
        orderNumber: this.orderNumber,
        customerId: this.customerId,
        reason: cancellationReason
      })
    );
  }

  asJson(): any {
    this.clearDomainEvents();
    return this;
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
