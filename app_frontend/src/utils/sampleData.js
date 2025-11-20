```javascript
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

/**
 * PUBLIC_INTERFACE
 * getRequestedSampleIngredients
 * Returns the exact set of sample ingredients requested in the task:
 * Eggs, Flour, Milk, Butter, Salt, Sugar, Chicken Breast, and Olive Oil.
 * Each is created as a task in the 'ingredients' section.
 */
export function getRequestedSampleIngredients() {
  const names = [
    'Eggs',
    'Flour',
    'Milk',
    'Butter',
    'Salt',
    'Sugar',
    'Chicken Breast',
    'Olive Oil',
  ];

  const notesMap = {
    Eggs: '6 large',
    Flour: 'All-purpose, 2 cups',
    Milk: 'Whole, 1 cup',
    Butter: 'Unsalted, 4 tbsp',
    Salt: 'Pinch to taste',
    Sugar: 'Granulated, 3 tbsp',
    'Chicken Breast': '2 pieces, boneless',
    'Olive Oil': 'Extra virgin, 2 tbsp',
  };

  return names.map((title, idx) => {
    const priority = idx % 3 === 0 ? 'high' : (idx % 3 === 1 ? 'medium' : 'low');
    const task = createTask(title, notesMap[title] || '', priority);
    task.section = 'ingredients';
    return task;
  });
}
``` 
