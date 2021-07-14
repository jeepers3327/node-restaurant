import { DomainEvent } from "node-js-ddd/dist/events/domain-event";
import { IAggregate } from "node-js-ddd/dist/model/aggregate";
import { MenuItem } from "../entities/menu-item";

export interface NewMenuItemEventData {
  menuItem: MenuItem;
}

export class NewMenuItemEvent extends DomainEvent<NewMenuItemEventData> {
  static typeName = "new-menu-item";

  constructor(aggregate: IAggregate, eventData: NewMenuItemEventData) {
    super(aggregate, "stock-management", NewMenuItemEvent.typeName, eventData);
  }
}
