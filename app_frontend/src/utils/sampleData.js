//
// Default/sample recipe data for initial app load
//

// PUBLIC_INTERFACE
export const SAMPLE_RECIPES = [
  {
    id: 'r1',
    name: 'Lemon Herb Chicken',
    desc: 'Juicy chicken breasts marinated with fresh lemon, garlic, and herbs.',
    imgLabel: 'Chicken',
    categories: [
      { category: 'Ingredients', tasks: ['2 chicken breasts', '1 lemon (juiced and zested)', '2 cloves garlic (minced)', '1 tbsp olive oil', 'Salt', 'Black pepper', 'Fresh herbs (parsley or thyme)'] },
      { category: 'Prep', tasks: ['Pound chicken to even thickness.', 'Whisk lemon juice, zest, garlic, oil, salt, and pepper.', 'Marinate chicken 20–30 minutes.'] },
      { category: 'Cooking', tasks: ['Heat pan over medium.', 'Cook chicken 5–6 minutes per side until done.', 'Let rest 5 minutes.'] },
      { category: 'Serving', tasks: ['Slice and top with herbs.', 'Serve with vegetables or rice.'] }
    ]
  },
  {
    id: 'r5',
    name: 'Spaghetti Aglio e Olio',
    desc: 'Classic garlic and olive oil pasta with a gentle heat and fresh parsley.',
    imgLabel: 'Aglio e Olio',
    categories: [
      {
        category: 'Ingredients',
        tasks: [
          '200g spaghetti',
          '4 cloves garlic (sliced)',
          '1/4 cup olive oil',
          '1/2 tsp red pepper flakes',
          'Salt',
          'Fresh parsley (chopped)',
          'Grated parmesan cheese (optional)'
        ]
      },
      {
        category: 'Prep',
        tasks: [
          'Slice the garlic thinly.',
          'Chop fresh parsley.'
        ]
      },
      {
        category: 'Cooking',
        tasks: [
          'Boil spaghetti in salted water until al dente.',
          'While pasta cooks, heat olive oil in a pan.',
          'Add garlic and sauté until lightly golden.',
          'Stir in red pepper flakes (don’t burn garlic).',
          'Drain pasta, reserving a little pasta water.',
          'Add cooked pasta and a splash of pasta water to the pan. Toss well.'
        ]
      },
      {
        category: 'Serving',
        tasks: [
          'Serve topped with parsley.',
          'Add parmesan cheese if desired.'
        ]
      }
    ]
  }
];
