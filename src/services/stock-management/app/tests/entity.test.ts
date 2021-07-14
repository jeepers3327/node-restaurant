import "mocha";
import { assert, expect } from "chai";
import { MenuItem } from "../src/domain/entities/menu-item";
import { StockedIngredient } from "../src/domain/entities/ingredient";
import { Menu } from "../src/domain/entities/menu";

describe("Entity tests", () => {
  it("Should be able to create a new menu", () => {
    const menu = Menu.Create("Pizzas");

    expect(menu.name).to.equal("Pizzas");
    expect(menu.items.length).to.equal(0);
    expect(menu.id.length).to.greaterThan(0);
  });

  it("Should be able to create a new menu item", () => {
    const item = new MenuItem();
    item.name = "Pizza";
    item.price = 6.5;
    item.ingredients = [
      {
        name: "Cheese",
      },
      {
        name: "Tomato sauce",
      },
      {
        name: "Base",
      },
    ];

    expect(item.name).to.equal("Pizza");
    expect(item.price).to.equal(6.5);
    expect(item.ingredients.length).to.equal(3);
  });

  it("Should be able to create a new stocked ingredient", () => {
    const stockedIngredient = StockedIngredient.createFrom(
      {
        name: "Pizza",
      },
      10
    );

    expect(stockedIngredient.freeStock).to.equal(10);
    expect(stockedIngredient.reservedStock).to.equal(0);
    expect(stockedIngredient.ingredient.name).to.equal("Pizza");
  });

  it("Should not be able to create a stocked ingredient with an initial stock less than 0", () => {
    assert.throws(
      () =>
        StockedIngredient.createFrom(
          {
            name: "Pizza",
          },
          -1
        ),
      Error,
      "Cannot create a stocked ingredient with a stock level less than 0."
    );
  });
});
