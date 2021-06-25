import { EventBridge } from "aws-sdk";
import { IHandler } from "node-js-ddd/dist/events/domain-event-handling";
import { OrderCancelledEvent } from "../../domain/events/order-cancelled/order-cancelled";

// a client can be shared by different commands.
const eventbridge = new EventBridge();
export class OrderCancelledEventPublisher implements IHandler<OrderCancelledEvent> {
  typeToHandle = "order-cancelled";
  async handle(evt: OrderCancelledEvent): Promise<void> {
    const data = {
      Entries: [
        {
          Source: "com.order-management",
          EventBusName: "default",
          DetailType: "order-cancelled",
          Time: new Date(),
          Details: JSON.stringify(evt),
        },
      ],
    };
    
    const result = await eventbridge.putEvents(data).promise();

    console.log('Event publish result');
    console.log(result);
  }
}
