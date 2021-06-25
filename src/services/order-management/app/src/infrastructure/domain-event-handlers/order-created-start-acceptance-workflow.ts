import { EventBridge } from "aws-sdk";
import { IHandler } from "node-js-ddd/dist/events/domain-event-handling";
import { OrderCreatedEvent } from "../../domain/events/order-created/order-created";

// a client can be shared by different commands.
const eventbridge = new EventBridge();
export class OrderCreatedStartAcceptanceWorkflow implements IHandler<OrderCreatedEvent> {
  typeToHandle = "order-created";
  async handle(evt: OrderCreatedEvent): Promise<void> {
      console.log('Trigger step function');
    // TODO: Add trigger of step function
  }
}
