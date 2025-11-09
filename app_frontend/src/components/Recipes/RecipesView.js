import React, { useEffect, useMemo, useState } from 'react';
import { loadRecipes, saveRecipes } from '../../utils/recipesStorage';
import { createRecipe, updateRecipe } from './RecipeTypes';
import RecipeList from './RecipeList';
import RecipeFormModal from './RecipeFormModal';

/**
 * PUBLIC_INTERFACE
 * RecipesView renders the Recipes management UI with list and modal CRUD.
 * Provides:
 * - list of recipes
 * - add, edit, delete recipes
 * - simple search
 */
export default function RecipesView() {
  const [recipes, setRecipes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState('');

  // load on mount
  useEffect(() => {
    setRecipes(loadRecipes());
  }, []);

  // persist on change
  useEffect(() => {
    saveRecipes(recipes);
  }, [recipes]);

  // PUBLIC_INTERFACE
  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  // PUBLIC_INTERFACE
  const onSubmit = (data) => {
    if (editing) {
      setRecipes(prev =>
        prev.map(r => (r.id === editing.id ? updateRecipe(r, data) : r))
      );
    } else {
      const newR = createRecipe(data);
      setRecipes(prev => [newR, ...prev]);
    }
    setEditing(null);
    setModalOpen(false);
  };

  // PUBLIC_INTERFACE
  const onEdit = (recipe) => {
    setEditing(recipe);
    setModalOpen(true);
  };

  // PUBLIC_INTERFACE
  const onDelete = (id) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return recipes;
    return recipes.filter(r => {
      const hay = [
        r.title || '',
        r.description || '',
        ...(r.ingredients || []),
        ...(r.steps || [])
      ].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [recipes, query]);

  return (
    <div className="recipes-view">
      <section className="category-header card">
        <div className="category-title">
          <span className="category-icon" aria-hidden>📖</span>
          <div>
            <h2>Recipes</h2>
            <p className="muted">{filtered.length} {filtered.length === 1 ? 'recipe' : 'recipes'}</p>
          </div>
        </div>
        <div className="category-actions" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes..."
            aria-label="Search recipes"
            style={{
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              padding: '8px 10px',
              borderRadius: 10,
              outline: 'none'
            }}
          />
          <button className="btn primary" onClick={openAdd}>Add Recipe</button>
        </div>
      </section>

      <section className="lists">
        <div className="list card">
          <h3>All Recipes</h3>
          <RecipeList recipes={filtered} onEdit={onEdit} onDelete={onDelete} />
          {filtered.length === 0 && (
            <div className="empty">
              <p>No recipes yet. Click “Add Recipe” to create your first one.</p>
            </div>
          )}
        </div>
      </section>

      <RecipeFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={onSubmit}
        initial={editing ? {
          title: editing.title,
          description: editing.description,
          ingredients: editing.ingredients,
          steps: editing.steps,
        } : null}
      />
    </div>
  );
}
