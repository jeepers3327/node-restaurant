import { EventBridge } from "aws-sdk";
import { IHandler } from "node-js-ddd/dist/events/domain-event-handling";
import { OrderCreatedEvent } from "../../domain/events/order-created/order-created";

// a client can be shared by different commands.
const eventbridge = new EventBridge();
export class OrderCreatedEventPublisher implements IHandler<OrderCreatedEvent> {
  typeToHandle = "order-created";
  async handle(evt: OrderCreatedEvent): Promise<void> {
    const data = {
      Entries: [
        {
          Source: "com.order-management",
          EventBusName: "default",
          DetailType: "order-created",
          Time: new Date(),
          Detail: JSON.stringify(evt),
        },
      ],
    };

    const result = await eventbridge.putEvents(data).promise();

    console.log("Event publish result");
    console.log(result);
  }
}
