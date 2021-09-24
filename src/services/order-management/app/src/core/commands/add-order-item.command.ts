import { Events } from "../events/events";
import { Orders } from "../models/order.model";
import { StockCheckRequestedEvent } from "../events/stock-check-requested.event";
import { CommandResult } from "./command-results.model";

export interface AddOrderItemCommand {
  orderId: string;
  itemCode: string;
  quantity: number;
}

export class AddOrderItemCommandHandler {
  constructor(private events: Events, private orders: Orders) {}

  async handle(command: AddOrderItemCommand): Promise<CommandResult> {
    const order = await this.orders.getOrder(command.orderId);

    if (order == null || order == undefined) {
      return {
        friendlyMessage: "Order not found",
        success: false,
        data: "",
        rowsAffected: 0,
      };
    }
    
    const item = order.addOrderItem(command.itemCode, command.quantity);

    await this.events.publish(
      new StockCheckRequestedEvent({
        itemCode: item.itemCode,
        orderId: order.orderId,
        quantity: item.quantity,
      })
    );

    return {
      friendlyMessage: "OK",
      success: true,
      data: "",
      rowsAffected: 1,
    };
  }
}
