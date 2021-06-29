import { DomainEvents } from "node-js-ddd/dist/events/domain-event-handling";
import { OrderCreatedEventPublisher } from "./order-created-event-publisher";
import { OrderCreatedStartAcceptanceWorkflow } from "./order-created-start-acceptance-workflow";
import { OrderCancelledEventPublisher } from './order-cancelled-event-publisher';


export class InfrastructureSetup {
    static addHandlers() {
        DomainEvents.registerHandler(new OrderCreatedEventPublisher());
        DomainEvents.registerHandler(new OrderCreatedStartAcceptanceWorkflow());
        DomainEvents.registerHandler(new OrderCancelledEventPublisher());
    }
    
    static addAzureHandlers() {
    }
}