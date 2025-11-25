//
// Sample data helpers: provide demo recipe tasks categorized into prep, cooking, and serving.
// These tasks appear for first-time users by seeding localStorage if empty.
//

import { createTask } from './types';
import { loadState, saveState } from './storage';

// PUBLIC_INTERFACE
export function getSampleRecipeTasks() {
  /**
   * Returns a categorized set of sample tasks representing popular recipes,
   * distributed across 'prep', 'cooking', and 'serving' categories.
   * Each category contains tasks (todos) the user can interact with immediately.
   */
  const categories = ['prep', 'cooking', 'serving'];

  // We create at least 5 recipe-themed tasks overall, spread across categories.
  // Notes provide quick context for the user.
  const sample = {
    prep: [
      // Explicit simple prep examples visible by default
      createTask('Chop onions', 'Small dice for even cooking', 'medium'),
      createTask('Marinate chicken', 'Use yogurt/spice blend; 2–4 hours is ideal', 'high'),
      createTask('Preheat oven', 'Set to 400°F / 200°C and allow to stabilize', 'low'),
      // Existing themed prep items for variety
      createTask('Chop vegetables for Ratatouille', 'Eggplant, zucchini, bell peppers, onions, tomatoes', 'medium'),
      createTask('Marinate chicken for Tikka', 'Yogurt + spices; refrigerate 2–4 hours', 'high'),
    ],
    cooking: [
      createTask('Simmer Bolognese sauce', 'Low heat, 45–60 minutes; stir occasionally', 'medium'),
      createTask('Boil pasta al dente', 'Salted water; reserve some pasta water', 'low'),
    ],
    serving: [
      createTask('Plate Caesar salad', 'Toss with dressing; top with croutons and parmesan', 'low'),
      // Extra serving task provides an additional visible starter item
      createTask('Garnish ramen with scallions and egg', 'Add nori, sesame seeds, chili oil to taste', 'low'),
    ],
  };

  // Ensure structure for any missing category keys
  categories.forEach((c) => {
    if (!sample[c]) sample[c] = [];
  });

  return sample;
}

// PUBLIC_INTERFACE
export function ensureSampleDataSeeded() {
  /**
   * Seeds localStorage with demo recipe tasks if no prior state exists.
   * Uses STORAGE_KEY structure from storage.js: { lists: { [category]: Task[] } }
   */
  const existing = loadState();
  if (existing && existing.lists && Object.keys(existing.lists).length > 0) {
    return existing; // Already has data; do not override user content
  }

  const sample = getSampleRecipeTasks();
  const state = { lists: sample };
  saveState(state);
  return state;
}
