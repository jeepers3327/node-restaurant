import { DomainEvent } from 'node-js-ddd/dist/events/domain-event';
import { IAggregate } from 'node-js-ddd/dist/model/aggregate';

export interface OrderDispatchedEventData {
  orderNumber: string;
  customerId: string;
}

export class OrderDispatchedEvent extends DomainEvent<OrderDispatchedEventData> {
  static typeName = 'order-dispatched';

  constructor(aggregate: IAggregate, eventData: OrderDispatchedEventData) {
    super(aggregate, 'order', OrderDispatchedEvent.typeName, eventData);
  }
}
