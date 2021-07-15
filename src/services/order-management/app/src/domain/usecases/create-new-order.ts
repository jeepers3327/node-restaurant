import { Orders } from "../entities/order-repository";
import { OrderFactory } from "../entities/order";
import { Logger } from "../../common/logger";
import { DomainEvents } from "node-js-ddd/dist/events/domain-event-handling";
import { OrderCreatedEvent } from "../events/order-created/order-created";
import { IAddress } from "../entities/address";
import { ICommand } from "../../common/command";

export class CreateNewOrderCommand implements ICommand {
  orderNumber: string;
  customerId: string;
  items: NewOrderItem[];
  address: IAddress;
  get name(): string {
    return "create-new-order";
  }
}

export interface NewOrderItem {
  description: string;
  quantity: number;
  price: number;
}

export class CreateOrderCommandHandler {
  private _orderRepo: Orders;
  private _logger: Logger;

  constructor(orderRepo: Orders, logger: Logger) {
    this._orderRepo = orderRepo;
    this._logger = logger;
  }

  async execute(request: CreateNewOrderCommand): Promise<string> {
    this._logger.logInformation(
      `Creating new order for ${request.customerId} with ref ${request.orderNumber}`
    );

    const order = OrderFactory.Create(
      request.customerId,
      request.address,
      request.orderNumber
    );

    request.items.forEach((item) => {
      order.details.addOrderItem(item.description, item.price, item.quantity);
    });

    await this._orderRepo.addNew(order);

    this._logger.logInformation(`Created order ${order.orderNumber}`);

    DomainEvents.Raise(
      new OrderCreatedEvent(order, {
        orderNumber: order.orderNumber,
        customerId: order.customerId,
      })
    );

    return order.orderNumber;
  }
}
