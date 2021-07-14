import { randomUUID } from "crypto";
import { Aggregate } from "node-js-ddd/dist/model/aggregate";
import { NewMenuItemEvent } from "../events/new-menu-item-event";
import { MenuItem } from "./menu-item";

export interface Menus {
  getMenu(name: string): Promise<Menu>;
  updateMenu(menu: Menu): Promise<void>;
}

export class Menu extends Aggregate {
  private _items: MenuItem[];
  private _name: string;

  constructor(menuName: string, id = "") {
    super(id);
    this._name = menuName;
    this._items = [];
  }

  static Create(menuName: string): Menu {
    return new Menu(menuName, randomUUID());
  }

  get name(): string {
    return this._name;
  }

  get items(): MenuItem[] {
    return this._items;
  }

  addItem(item: MenuItem): void {
    if (this._items.filter((p) => p.name == item.name).length > 0) {
      throw new Error("An item already exists with that name");
    }

    this._items.push(item);

    this.addDomainEvent(
      new NewMenuItemEvent(this, {
        menuItem: item,
      })
    );
  }
}
