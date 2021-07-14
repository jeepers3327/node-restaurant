import { Menu, Menus } from "../../src/domain/entities/menu";

export class InMemoryMenus implements Menus {
  inMemoryItems: Menu[];

  constructor() {
    const menu = Menu.Create("Pizzas");

    this.inMemoryItems = [];
    this.inMemoryItems.push(menu);
  }

  getMenu(name: string): Promise<Menu> {
    const menu = this.inMemoryItems.filter((p) => p.name === name);

    return new Promise((res, err) => {
      if (menu.length === 0) {
        return err("Menu not found");
      }

      return res(menu[0]);
    });
  }

  updateMenu(menu: Menu): Promise<void> {
    console.log("Updating");

    return new Promise((res) => {
      return res();
    });
  }
}
