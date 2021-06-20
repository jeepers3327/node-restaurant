import { DomainEvent } from 'node-js-ddd/dist/events/domain-event';
import { IAggregate } from 'node-js-ddd/dist/model/aggregate';

export interface OrderCreatedEventData {
  orderNumber: string;
  customerId: string;
}

export class OrderCreatedEvent extends DomainEvent<OrderCreatedEventData> {
  static typeName = 'order-created';

  constructor(aggregate: IAggregate, eventData: OrderCreatedEventData) {
    super(aggregate, 'order', OrderCreatedEvent.typeName, eventData);
  }
}
