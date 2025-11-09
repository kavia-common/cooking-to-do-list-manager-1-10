//
// Types and helpers for Recipes
//

// PUBLIC_INTERFACE
export function createRecipe({ title, description = '', ingredients = [], steps = [] }) {
  /** Create a new recipe object with generated id and timestamps. */
  return {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title,
    description,
    ingredients,
    steps,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// PUBLIC_INTERFACE
export function updateRecipe(recipe, patch) {
  /** Shallow update with updated timestamp. */
  return { ...recipe, ...patch, updatedAt: Date.now() };
}
