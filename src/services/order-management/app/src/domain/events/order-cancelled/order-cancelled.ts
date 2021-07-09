import { DomainEvent } from 'node-js-ddd/dist/events/domain-event';
import { IAggregate } from 'node-js-ddd/dist/model/aggregate';

export interface OrderCancelledEventData {
  orderNumber: string;
  customerId: string;
  reason: string;
}

export class OrderCancelledEvent extends DomainEvent<OrderCancelledEventData> {
  static typeName = 'order-cancelled';

  constructor(aggregate: IAggregate, eventData: OrderCancelledEventData) {
    super(aggregate, 'order', OrderCancelledEvent.typeName, eventData);
  }
}
