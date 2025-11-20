//
// Sample data utilities for demo/testing without backend connectivity
//

import { createTask } from './types';

/**
 * PUBLIC_INTERFACE
 * getInitialIngredients
 * Returns an array of pre-populated ingredient tasks for demo purposes.
 * Each task is created via createTask and assigned to the 'ingredients' section.
 */
export function getInitialIngredients() {
  const names = [
    'Tomatoes',
    'Olive oil',
    'Chicken breasts',
    'Garlic',
    'Basil',
    'Salt',
    'Pepper',
    'Parmesan cheese',
    'Lemon',
  ];

  // Create tasks with a reasonable default priority and brief notes
  const notesMap = {
    'Tomatoes': '2-3 medium ripe',
    'Olive oil': 'Extra virgin',
    'Chicken breasts': '2 pieces, skinless',
    'Garlic': '3 cloves, minced',
    'Basil': 'Fresh leaves, handful',
    'Salt': 'To taste',
    'Pepper': 'Freshly ground',
    'Parmesan cheese': 'Grated, 1/2 cup',
    'Lemon': '1, zested and juiced'
  };

  return names.map((title, idx) => {
    const priority = idx % 3 === 0 ? 'high' : (idx % 3 === 1 ? 'medium' : 'low');
    const task = createTask(title, notesMap[title] || '', priority);
    // ensure these appear in the Ingredients category
    task.section = 'ingredients';
    return task;
  });
}
