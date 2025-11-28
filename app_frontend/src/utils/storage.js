const STORAGE_KEY = 'cooking_todo_lists_v1';
// Note: State shape is { lists: { [key: string]: Task[] } }.
// For recipes, we now use a single unified list at lists.recipes.
// If the structure needs to evolve in future, bump the suffix (e.g., _v2) and
// provide a migration step in the corresponding page or app initialization to keep user data.

// PUBLIC_INTERFACE
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota/unavailable
  }
}
