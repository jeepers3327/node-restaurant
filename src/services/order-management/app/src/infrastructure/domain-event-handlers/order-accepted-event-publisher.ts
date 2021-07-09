import { EventBridge } from "aws-sdk";
import { IHandler } from "node-js-ddd/dist/events/domain-event-handling";
import { OrderAcceptedEvent } from "../../domain/events/order-accepted/order-accepted-event";

// a client can be shared by different commands.
const eventbridge = new EventBridge();
export class OrderCancelledEventPublisher implements IHandler<OrderAcceptedEvent> {
  typeToHandle = OrderAcceptedEvent.typeName;
  async handle(evt: OrderAcceptedEvent): Promise<void> {
    const data = {
      Entries: [
        {
          Source: "com.order-management",
          EventBusName: "default",
          DetailType: OrderAcceptedEvent.typeName,
          Time: new Date(),
          Detail: JSON.stringify(evt),
        },
      ],
    };
    
    const result = await eventbridge.putEvents(data).promise();

    console.log('Event publish result');
    console.log(result);
  }
}
