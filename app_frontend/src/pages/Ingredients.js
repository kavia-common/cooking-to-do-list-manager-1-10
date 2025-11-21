import React, { useEffect, useMemo, useState } from 'react';
import { Theme, setCSSVariables } from '../theme';

/**
 * PUBLIC_INTERFACE
 * Ingredients page
 * - Starter layout for viewing and managing ingredients.
 * - Ocean Professional styling using existing CSS tokens.
 * - Includes simple search, category filter, and placeholder actions.
 */
export default function Ingredients() {
  useEffect(() => {
    // Ensure theme variables are applied if landing directly on /ingredients
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    document.title = 'maestro';
  }, []);

  // Mock ingredients dataset (placeholder)
  const initialIngredients = useMemo(
    () => ([
      { id: 'ing_1', name: 'Onion', category: 'Vegetables', quantity: '2 pcs', status: 'Available' },
      { id: 'ing_2', name: 'Garlic', category: 'Vegetables', quantity: '4 cloves', status: 'Low' },
      { id: 'ing_3', name: 'Olive Oil', category: 'Pantry', quantity: '250 ml', status: 'Available' },
      { id: 'ing_4', name: 'Paprika', category: 'Spices', quantity: '50 g', status: 'Available' },
      { id: 'ing_5', name: 'Chicken Breast', category: 'Meat', quantity: '500 g', status: 'Out' },
    ]),
    []
  );

  const [ingredients, setIngredients] = useState(initialIngredients);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('all'); // all | Vegetables | Pantry | Spices | Meat

  const categories = useMemo(() => {
    const base = Array.from(new Set(initialIngredients.map(i => i.category))).sort();
    return ['all', ...base];
  }, [initialIngredients]);

  const filtered = ingredients.filter((i) => {
    const q = query.trim().toLowerCase();
    const matchQuery = !q || i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q) || i.status.toLowerCase().includes(q);
    const matchCat = cat === 'all' || i.category === cat;
    return matchQuery && matchCat;
  });

  const onAdd = () => {
    alert('Add Ingredient (placeholder)');
    // Future: open a modal form to create an ingredient and push to state
  };

  const onEdit = (ing) => {
    alert(`Edit Ingredient (placeholder): ${ing.name}`);
    // Future: open a modal prefilled with ingredient details
  };

  const onRemove = (ing) => {
    if (!window.confirm(`Remove "${ing.name}" from your ingredients?`)) return;
    setIngredients(prev => prev.filter(p => p.id !== ing.id));
  };

  return (
    <div className="card">
      <div className="category-header box-header">
        <div className="category-title">
          <span className="category-icon" aria-hidden>🧅</span>
          <div>
            <h2>Ingredients</h2>
            <p className="muted">Track pantry items and shopping needs</p>
          </div>
        </div>
        <div className="hero-actions">
          <button className="btn" onClick={() => setQuery('')}>Clear</button>
          <button className="btn primary" onClick={onAdd}>Add Ingredient</button>
        </div>
      </div>

      <div className="hero">
        <div className="hero-inner" style={{ rowGap: 10 }}>
          <div className="hero-icon" aria-hidden>🌊</div>
          <div className="hero-text">
            <h3 className="hero-title">Stay stocked and ready</h3>
            <p className="hero-subtitle">
              Use search and filters to find ingredients quickly. Add, edit, or remove items as you prepare for your recipes.
              This is a starter layout and can be expanded with detailed attributes and inventory management.
            </p>
          </div>
          <div className="hero-actions" style={{ minWidth: 260, flex: '0 0 320px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="field" style={{ margin: 0 }}>
              <span>Search ingredients</span>
              <input
                placeholder="Search by name, category, or status"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search ingredients"
              />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <span>Filter by category</span>
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                aria-label="Filter by category"
                style={{
                  borderRadius: 10,
                  border: '1px solid var(--color-border)',
                  padding: '10px 12px',
                  background: 'var(--color-surface)',
                }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All' : c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="lists">
        <div className="list">
          <h3>Pantry</h3>
          <div className="box-list" style={{ paddingTop: 0 }}>
            {filtered.length === 0 ? (
              <div className="empty">
                <p>No ingredients match your search.</p>
                <p className="muted" style={{ marginTop: 8, fontSize: 12 }}>
                  Try clearing filters or add a new ingredient.
                </p>
              </div>
            ) : (
              <div className="task-list">
                {filtered.map((i) => (
                  <div key={i.id} className="task-item" role="row">
                    <div className="task-left" style={{ alignItems: 'center' }}>
                      <div className="task-content">
                        <div className="task-title" style={{ gap: 10 }}>
                          <span style={{ fontWeight: 700 }}>{i.name}</span>
                          <span
                            className="nav-badge"
                            style={{
                              background: 'rgba(17,24,39,0.06)',
                              color: 'var(--color-text)',
                              fontWeight: 600,
                            }}
                            aria-label={`Category: ${i.category}`}
                          >
                            {i.category}
                          </span>
                          <span
                            className="nav-badge"
                            style={{
                              background:
                                i.status === 'Available'
                                  ? 'rgba(37,99,235,0.12)'
                                  : i.status === 'Low'
                                  ? 'rgba(245,158,11,0.12)'
                                  : 'rgba(239,68,68,0.12)',
                              color: 'var(--color-text)',
                              fontWeight: 600,
                            }}
                            aria-label={`Status: ${i.status}`}
                          >
                            {i.status}
                          </span>
                        </div>
                        <div className="task-notes" style={{ marginTop: 2 }}>
                          Qty: {i.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="task-actions">
                      <button className="icon-btn" onClick={() => onEdit(i)} aria-label="Edit ingredient">✎</button>
                      <button className="icon-btn danger" onClick={() => onRemove(i)} aria-label="Remove ingredient">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
