const TABLES_STORAGE_KEY = 'cooking_tables_state_v1';

/**
 * PUBLIC_INTERFACE
 * Load tables state from localStorage.
 * Structure:
 * {
 *   tables: [{ id, name }],
 *   selectedTableId: string,
 *   tableLists: { [tableId]: { prep: Task[], cook: Task[], serve: Task[] } }
 * }
 */
export function loadTablesState() {
  try {
    const raw = localStorage.getItem(TABLES_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * PUBLIC_INTERFACE
 * Persist tables state to localStorage.
 */
export function saveTablesState(state) {
  try {
    localStorage.setItem(TABLES_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}
