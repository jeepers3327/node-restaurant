import { Address } from '../models/address.model';
import { Event } from './events';

export class OrderSubmittedEvent implements Event {
    get name(): string {
        return 'order-submitted'
    }
    
    orderId: string;
    deliveryAddress: Address;
}