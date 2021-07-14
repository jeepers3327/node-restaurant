import { Menus } from "../entities/menu";
import { MenuItem } from "../entities/menu-item";

export interface AddMenuItemRequest {
  menuName: string;
  name: string;
  price: number;
  ingredients: string[];
}

export interface AddMenuItemResponse {
  item: MenuItem;
  message: string;
  success: boolean;
}

export class AddMenuItemHandler {
  constructor(private menus: Menus) {}

  async execute(request: AddMenuItemRequest): Promise<AddMenuItemResponse> {
    if (request.name.length === 0) {
      return {
        item: null,
        message: "Cannot create a menu item with no name",
        success: false,
      };
    }

    if (request.price <= 0) {
      return {
        item: null,
        message: "A menu item must have a value",
        success: false,
      };
    }

    if (request.ingredients.length === 0) {
      return {
        item: null,
        message: "A menu item must have at least one ingredient",
        success: false,
      };
    }

    const item = new MenuItem();
    item.name = request.name;
    item.price = request.price;
    item.ingredients = request.ingredients.map((ingredient) => {
      return {
        name: ingredient,
      };
    });

    try {
      const menu = await this.menus.getMenu(request.menuName);

      menu.addItem(item);

      this.menus.updateMenu(menu);

      await menu.publish();

      return {
        item: item,
        message: "OK",
        success: true,
      };
    } catch (err) {
      return {
        item: null,
        message: err,
        success: false,
      };
    }
  }
}
