import React, { useEffect, useMemo, useState } from 'react';
import { Theme, setCSSVariables } from '../theme';

// PUBLIC_INTERFACE
export default function Ingredients() {
  /**
   * Ingredients management page
   * - Minimal, modern UI consistent with the rest of the app.
   * - Local state management for a list of ingredients with add/edit/delete.
   * - Search filter and simple category tags (e.g., Produce, Dairy, Pantry).
   */
  useEffect(() => {
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    document.title = 'chef master';
  }, []);

  // Demo initial ingredients
  const initialIngredients = useMemo(
    () => ([
      { id: 'ing_1', name: 'Tomatoes', quantity: '3 pcs', category: 'Produce', notes: '' },
      { id: 'ing_2', name: 'Olive oil', quantity: '250 ml', category: 'Pantry', notes: 'Extra virgin' },
      { id: 'ing_3', name: 'Parmesan', quantity: '100 g', category: 'Dairy', notes: '' },
      { id: 'ing_4', name: 'Garlic', quantity: '4 cloves', category: 'Produce', notes: '' },
      { id: 'ing_5', name: 'Spaghetti', quantity: '500 g', category: 'Pantry', notes: '' },
    ]),
    []
  );

  const [ingredients, setIngredients] = useState(initialIngredients);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Form state for add/edit
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', quantity: '', category: 'Produce', notes: '' });

  const categories = ['Produce', 'Dairy', 'Pantry', 'Meat', 'Seafood', 'Bakery', 'Other'];

  const filtered = ingredients.filter((ing) => {
    const q = query.trim().toLowerCase();
    const matchQuery = !q || ing.name.toLowerCase().includes(q) || ing.notes.toLowerCase().includes(q) || ing.category.toLowerCase().includes(q) || ing.quantity.toLowerCase().includes(q);
    const matchCategory = categoryFilter === 'all' || ing.category === categoryFilter;
    return matchQuery && matchCategory;
  });

  const openAdd = () => {
    setEditItem(null);
    setFormData({ name: '', quantity: '', category: 'Produce', notes: '' });
    setFormOpen(true);
  };

  const openEdit = (ing) => {
    setEditItem(ing);
    setFormData({ name: ing.name, quantity: ing.quantity, category: ing.category, notes: ing.notes || '' });
    setFormOpen(true);
  };

  const onDelete = (ing) => {
    if (!window.confirm(`Remove ingredient "${ing.name}"?`)) return;
    setIngredients(prev => prev.filter(i => i.id !== ing.id));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const name = formData.name.trim();
    if (!name) return;

    if (editItem) {
      setIngredients(prev => prev.map(i => (i.id === editItem.id ? { ...i, ...formData, name } : i)));
    } else {
      const newItem = {
        id: `ing_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        ...formData,
        name,
      };
      setIngredients(prev => [newItem, ...prev]);
    }
    setFormOpen(false);
    setEditItem(null);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditItem(null);
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="category-header box-header">
        <div className="category-title">
          <span className="category-icon" aria-hidden>🧅</span>
          <div>
            <h2>Ingredients</h2>
            <p className="muted">View and manage ingredients for your cooking tasks</p>
          </div>
        </div>
        <div className="hero-actions">
          <button className="btn" onClick={() => { setQuery(''); setCategoryFilter('all'); }}>Clear</button>
          <button className="btn primary" onClick={openAdd}>Add Ingredient</button>
        </div>
      </div>

      {/* Hero / Controls */}
      <div className="hero">
        <div className="hero-inner" style={{ rowGap: 10 }}>
          <div className="hero-icon" aria-hidden>🌊</div>
          <div className="hero-text">
            <h3 className="hero-title">Keep your pantry organized</h3>
            <p className="hero-subtitle">
              Add ingredients with quantities, organize by category, and quickly search when planning your recipes.
            </p>
          </div>
          <div className="hero-actions" style={{ minWidth: 260, flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="field" style={{ margin: 0 }}>
              <span>Search ingredients</span>
              <input
                placeholder="Search by name, quantity, notes, or category"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search ingredients"
              />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <span>Filter by category</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter by category"
                style={{
                  borderRadius: 10,
                  border: '1px solid var(--color-border)',
                  padding: '10px 12px',
                  background: 'var(--color-surface)',
                }}
              >
                <option value="all">All</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="lists">
        <div className="list">
          <h3>All Ingredients</h3>
          <div className="box-list" style={{ paddingTop: 0 }}>
            {filtered.length === 0 ? (
              <div className="empty">
                <p>No ingredients found.</p>
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
                            aria-label={`Quantity: ${i.quantity || 'n/a'}`}
                            style={{ background: 'rgba(17,24,39,0.06)', color: 'var(--color-text)', fontWeight: 600 }}
                          >
                            {i.quantity || 'n/a'}
                          </span>
                          <span
                            className="nav-badge"
                            aria-label={`Category: ${i.category}`}
                            style={{ background: 'rgba(37,99,235,0.12)', color: 'var(--color-text)', fontWeight: 600 }}
                          >
                            {i.category}
                          </span>
                        </div>
                        {i.notes ? <div className="task-notes" style={{ marginTop: 2 }}>{i.notes}</div> : null}
                      </div>
                    </div>
                    <div className="task-actions">
                      <button className="icon-btn" onClick={() => openEdit(i)} aria-label="Edit ingredient">✎</button>
                      <button className="icon-btn danger" onClick={() => onDelete(i)} aria-label="Remove ingredient">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simple modal form inline using existing modal styles */}
      {formOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">
              <h3>{editItem ? 'Edit Ingredient' : 'Add Ingredient'}</h3>
              <button className="icon-btn" onClick={closeForm} aria-label="Close">✕</button>
            </div>
            <form onSubmit={onSubmit} className="modal-body">
              <label className="field">
                <span>Name</span>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Tomatoes"
                  required
                />
              </label>
              <label className="field">
                <span>Quantity</span>
                <input
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g., 3 pcs, 250 ml"
                />
              </label>
              <label className="field">
                <span>Category</span>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  aria-label="Ingredient category"
                  style={{
                    borderRadius: 10,
                    border: '1px solid var(--color-border)',
                    padding: '10px 12px',
                    background: 'var(--color-surface)',
                  }}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="field">
                <span>Notes</span>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Optional notes"
                />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn ghost" onClick={closeForm}>Cancel</button>
                <button type="submit" className="btn primary">{editItem ? 'Save' : 'Add Ingredient'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
