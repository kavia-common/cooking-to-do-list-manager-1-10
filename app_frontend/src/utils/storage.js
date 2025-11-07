const STORAGE_KEY = 'cooking_todo_lists_v1';

/**
 * PUBLIC_INTERFACE
 * Load persisted state and sanitize legacy categories (e.g., removed ones) from lists.
 */
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    // Strip legacy 'serve' list if present to avoid dangling categories in future saves
    if (parsed && parsed.lists && Object.prototype.hasOwnProperty.call(parsed.lists, 'serve')) {
      const { serve, ...restLists } = parsed.lists;
      return { ...parsed, lists: restLists };
    }
    return parsed;
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
