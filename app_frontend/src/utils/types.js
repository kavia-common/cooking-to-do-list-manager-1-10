export const DEFAULT_CATEGORIES = [
  // Keep internal ids stable, only change the visible label to "Recipes"
  { id: 'prep', name: 'Recipes', icon: '🔪' },
  { id: 'serve', name: 'Serving', icon: '🍽️' }
];

export const DEFAULT_LISTS = {
  prep: [],
  serve: []
};

// PUBLIC_INTERFACE
export function createTask(title, notes = '', priority = 'medium') {
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
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}
