import { Event } from "./events";

export class OrderStartedEvent implements Event {
  get name(): string {
      return 'order-started'
  }
  
  orderId: string;
  emailAddress: string;

  constructor(init?: Partial<OrderStartedEvent>) {
    Object.assign(this, init);
  }
}
