import { Event } from "./events"

export class OrderStartedEvent implements Event {
    get name(): string {
        return 'order-completed'
    }
    
    orderId: string
}