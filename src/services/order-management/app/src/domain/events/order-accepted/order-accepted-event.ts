import { DomainEvent } from 'node-js-ddd/dist/events/domain-event';
import { IAggregate } from 'node-js-ddd/dist/model/aggregate';

export interface OrderAcceptedEventData {
  orderNumber: string;
  customerId: string;
}

export class OrderAcceptedEvent extends DomainEvent<OrderAcceptedEventData> {
  static typeName = 'order-accepted';

  constructor(aggregate: IAggregate, eventData: OrderAcceptedEventData) {
    super(aggregate, 'order', OrderAcceptedEvent.typeName, eventData);
  }
}
