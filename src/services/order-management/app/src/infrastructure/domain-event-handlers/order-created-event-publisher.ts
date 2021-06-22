import { IHandler } from "node-js-ddd/dist/events/domain-event-handling";
import { OrderCreatedEvent } from "../../domain/events/order-created/order-created";

export class OrderCreatedEventPublisher implements IHandler<OrderCreatedEvent>{
    typeToHandle = 'order-created';
    handle(evt: OrderCreatedEvent): void {
        console.log(`Event handling running for ${evt}`);

        //TODO: Add event bridge event publishing
    }
}