import { CommandResult } from "./command-results.model";
import { Events } from '../events/events';
import { OrderStartedEvent } from "../events/order-started.event";
import { EmailAddress } from "../models/email-address.model";
import { Order } from '../models/order.model';

export interface StartOrderCommand {
  emailAddress: string;
}

export class StartOrderCommandHandler {
  constructor(private events: Events) {}

  handle(command: StartOrderCommand): CommandResult {
    let emailAddress: EmailAddress;

    try {
      emailAddress = new EmailAddress(command.emailAddress);
    } catch (err) {
      return {
        data: "",
        success: false,
        friendlyMessage: "A valid email address must be provided.",
        rowsAffected: 0,
      };
    }

    const order = new Order();

    this.events.publish(
      new OrderStartedEvent({
        emailAddress: emailAddress.emailAddress,
        orderId: order.orderId,
      })
    );

    return {
      data: order.orderId,
      success: true,
      friendlyMessage: "OK",
      rowsAffected: 1,
    };
  }
}
