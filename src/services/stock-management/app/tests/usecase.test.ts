import "mocha";
import { assert, expect } from "chai";
import { AddMenuItemHandler } from "../src/domain/usecases/add-menu-item";
import { InMemoryMenus } from "./mocks/in-memory-menu-items";

let menuRepo = new InMemoryMenus();

describe("Use case tests", () => {
  beforeEach(() => {
    // Reset the repo to an empty instance
    menuRepo = new InMemoryMenus();
  });

  it("Should not be able a menu item with no name", async () => {
    const handler = new AddMenuItemHandler(menuRepo);

    const response = await handler.execute({
      menuName: "Pizzas",
      name: "",
      price: 100,
      ingredients: ["Base", "Sauce", "Cheese"],
    });

    expect(response.success).to.equal(false);
    expect(response.message).to.equal("Cannot create a menu item with no name");
  });

  it("Should not be able to create a menu item for a menu that doesn't exist", async () => {
    const handler = new AddMenuItemHandler(menuRepo);

    const response = await handler.execute({
      menuName: "Sides",
      name: "Chips",
      price: 2.99,
      ingredients: ["Chips"],
    });

    expect(response.success).to.equal(false);
    expect(response.message).to.equal("Menu not found");
  });

  it("Should not be able a menu item with zero value", async () => {
    const handler = new AddMenuItemHandler(menuRepo);

    const response = await handler.execute({
      menuName: "Pizzas",
      name: "Mozarella pizza",
      price: 0,
      ingredients: ["Base", "Sauce", "Cheese"],
    });

    expect(response.success).to.equal(false);
    expect(response.message).to.equal("A menu item must have a value");
  });

  it("Should not be able a menu item with no ingredients", async () => {
    const handler = new AddMenuItemHandler(menuRepo);

    const response = await handler.execute({
      menuName: "Pizzas",
      name: "Mozarella pizza",
      price: 5.99,
      ingredients: [],
    });

    expect(response.success).to.equal(false);
    expect(response.message).to.equal(
      "A menu item must have at least one ingredient"
    );
  });

  it("Should be able to create a  menu item", async () => {
    const handler = new AddMenuItemHandler(menuRepo);

    const response = await handler.execute({
      menuName: "Pizzas",
      name: "Mozarella pizza",
      price: 5.99,
      ingredients: ["Base", "Tomato Sauce", "Cheese"],
    });

    expect(response.success).to.equal(true);
    expect(response.message).to.equal("OK");
  });
});
