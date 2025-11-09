const RECIPES_STORAGE_KEY = 'cooking_recipes_v1';

// PUBLIC_INTERFACE
export function loadRecipes() {
  /** Load recipe array from localStorage. Returns [] when empty or on error. */
  try {
    const raw = localStorage.getItem(RECIPES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export function saveRecipes(recipes) {
  /** Persist recipe array to localStorage. */
  try {
    localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(recipes));
  } catch {
    // ignore storage errors
  }
}
