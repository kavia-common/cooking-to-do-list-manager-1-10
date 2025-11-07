export const DEFAULT_CATEGORIES = [
  { id: 'prep', name: 'Preparation', icon: '🔪' },
  { id: 'cook', name: 'Cooking', icon: '🍳' },
  { id: 'serve', name: 'Serving', icon: '🍽️' }
];

export const DEFAULT_LISTS = {
  prep: [],
  cook: [],
  serve: []
};

// PUBLIC_INTERFACE
export function createTask(title, notes = '', priority = 'medium') {
  /** Create a task object for the current category. */
  return {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title,
    notes,
    done: false,
    createdAt: Date.now(),
    priority, // low | medium | high
  };
}

// PUBLIC_INTERFACE
export function reorder(list, startIndex, endIndex) {
  /** Reorder helper: move item from startIndex to endIndex in a shallow-copied array. */
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}
