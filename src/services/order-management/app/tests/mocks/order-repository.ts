import { readdir } from "fs";
import { IOrder } from "../../src/domain/entities/order";
import { Orders } from "../../src/domain/entities/order-repository";
export class OrderRepositoryInMemoryImpl implements Orders {
  orders: IOrder[] = [];

  addNew(order: IOrder): Promise<void> {
    this.orders.push(order);

    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  getSpecific(orderNumber: string): Promise<IOrder> {
    const order = this.orders.filter((p) => p.orderNumber == orderNumber);

    if (order.length === 0) {
      throw Error("Order not found");
    }

    return new Promise<IOrder>((resolve, reject) => {
      resolve(order[0]);
    });
  }

  update(order: IOrder): Promise<void> {
    const existingOrder = this.getSpecific(order.orderNumber);

    const index = this.orders.indexOf(order);

    this.orders.splice(index, 1);

    this.orders.push(order);

    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}
