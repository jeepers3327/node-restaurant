export class Ingredient {
  name: string;
}

export class StockedIngredient {
  ingredient: Ingredient;
  freeStock: number;
  reservedStock: number;

  static createFrom(
    ingredient: Ingredient,
    initialStockLevel: number
  ): StockedIngredient {
    if (initialStockLevel < 0) {
      throw new Error(
        "Cannot create a stocked ingredient with a stock level less than 0."
      );
    }

    return {
      ingredient: ingredient,
      freeStock: initialStockLevel,
      reservedStock: 0,
    };
  }
}
