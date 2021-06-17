import { IOrder } from "./order";

export interface Orders {
  addNew(order: IOrder): Promise<void>;
  getSpecific(customerId: string, orderNumber: string): Promise<IOrder>;
  update(order: IOrder): Promise<void>;
}
