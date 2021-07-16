import { EventBridge } from "aws-sdk";
import { ICommand } from "../common/command";

const eventbridge = new EventBridge();

export class CommandHandler {
  async handle(command: ICommand): Promise<void> {
    const data = {
      Entries: [
        {
          Source: "com.order-management",
          EventBusName: "default",
          DetailType: command.name,
          Time: new Date(),
          Detail: JSON.stringify(command),
        },
      ],
    };

    const result = await eventbridge.putEvents(data).promise();

    console.log("Event publish result");
    console.log(result);
  }
}
