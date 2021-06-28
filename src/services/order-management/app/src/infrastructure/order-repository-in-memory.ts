import { readdir } from "fs";
import { IOrder } from "../domain/entities/order";
import { Orders } from "../domain/entities/order-repository";
export class OrderRepositoryInMemoryImpl implements Orders {
  orders: IOrder[] = [];

  addNew(order: IOrder): Promise<void> {
    return new Promise((resolve, reject) => {
      this.orders.push(order);

      resolve();
    });
  }

  async delete(orderNumber: string): Promise<void> {
    const existingOrder = await this.getSpecific(orderNumber);

    const index = this.orders.indexOf(existingOrder);

    this.orders.splice(index, 1);

    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  getSpecific(orderNumber: string): Promise<IOrder> {
    const order = this.orders.filter((p) => p.orderNumber.localeCompare(orderNumber));

    if (order.length === 0) {
      throw Error("Order not found");
    }

    return new Promise<IOrder>((resolve, reject) => {
      resolve(order[0]);
    });
  }

  getForCustomer(customerId: string): Promise<IOrder[]> {
    throw new Error("Method not implemented.");
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
