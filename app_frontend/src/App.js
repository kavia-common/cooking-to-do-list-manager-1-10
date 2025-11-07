import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import { Theme, setCSSVariables } from './theme';
import { SAMPLE_RECIPES } from './utils/sampleData';

// Simple placeholder image component
function PlaceholderImage({ label }) {
  return (
    <div className="placeholder-image" aria-hidden>
      <div className="dot tl" />
      <div className="dot tr" />
      <div className="dot bl" />
      <div className="dot br" />
      <span>{label}</span>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Main Recipes gallery using the Ocean Professional theme.
   * Uses SAMPLE_RECIPES for initial content, including categorized steps.
   */
  const [recipes, setRecipes] = useState(SAMPLE_RECIPES);
  const [editing, setEditing] = useState(null); // recipe object being edited
  const [tempName, setTempName] = useState('');
  const [tempDesc, setTempDesc] = useState('');
  const [showAddRecipe, setShowAddRecipe] = useState(false); // placeholder modal toggle

  // Apply Ocean Professional variables and set page title
  useEffect(() => {
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    // Set browser tab title to new branding
    document.title = 'Chef Assistant';
  }, []);

  const onEditRecipe = (recipe) => {
    setEditing(recipe);
    setTempName(recipe.name);
    setTempDesc(recipe.desc);
  };

  const onDeleteRecipe = (id) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
  };

  const onSaveEdit = (e) => {
    e?.preventDefault?.();
    if (!editing) return;
    setRecipes(prev =>
      prev.map(r =>
        r.id === editing.id ? { ...r, name: tempName.trim() || r.name, desc: tempDesc.trim() } : r
      )
    );
    setEditing(null);
  };

  const onCancelEdit = () => {
    setEditing(null);
  };

  return (
    <div className="ocean-app">
      <div className="gradient-bg" />
      <header className="app-header" aria-label="App header">
        <div className="brand">
          <span className="brand-logo" aria-hidden>🍽️</span>
          <div className="brand-text">
            <h1 aria-label="Chef Assistant title">Chef Assistant</h1>
            <p className="subtitle">Simple ideas in an Ocean Professional style</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button
              type="button"
              className="btn primary"
              aria-label="Add Recipe"
              title="Add Recipe"
              onClick={() => setShowAddRecipe(true)}
            >
              ➕ Add Recipe
            </button>
          </div>
        </div>
      </header>

      <main className="home-main">
        <section className="hero card">
          <div className="hero-text">
            <h2 className="hero-title">Discover easy, tasty dishes</h2>
            <p className="hero-subtitle">A clean, minimal gallery with blue & amber accents.</p>
          </div>
        </section>

        <section className="recipe-grid">
          {recipes.map(r => (
            <article className="recipe-card card" key={r.id}>
              <PlaceholderImage label={r.imgLabel} />
              <div className="recipe-body">
                <h3 className="recipe-title">{r.name}</h3>
                <p className="recipe-desc">{r.desc}</p>
              </div>
              <div className="recipe-actions">
                <button
                  className="btn ghost"
                  type="button"
                  aria-label={`Edit ${r.name}`}
                  onClick={() => onEditRecipe(r)}
                  title="Edit"
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn danger"
                  type="button"
                  aria-label={`Delete ${r.name}`}
                  onClick={() => onDeleteRecipe(r.id)}
                  title="Delete"
                >
                  🗑️ Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      {/* Lightweight edit modal for recipes (accessible) */}
      {editing && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Edit recipe">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Recipe</h3>
              <button className="icon-btn" onClick={onCancelEdit} aria-label="Close">✕</button>
            </div>
            <form className="modal-body" onSubmit={onSaveEdit}>
              <label className="field">
                <span>Name</span>
                <input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Recipe name"
                  aria-label="Recipe name"
                  required
                />
              </label>
              <label className="field">
                <span>Description</span>
                <textarea
                  value={tempDesc}
                  onChange={(e) => setTempDesc(e.target.value)}
                  placeholder="Short description"
                  rows={3}
                  aria-label="Recipe description"
                />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn ghost" onClick={onCancelEdit}>Cancel</button>
                <button type="submit" className="btn primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddRecipe && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Add recipe (placeholder)">
          <div className="modal">
            <div className="modal-header">
              <h3>Add Recipe</h3>
              <button className="icon-btn" onClick={() => setShowAddRecipe(false)} aria-label="Close">✕</button>
            </div>
            <div className="modal-body">
              <p style={{ margin: 0, color: 'var(--color-muted)' }}>
                This feature is under development. Soon you’ll be able to add new recipes here.
              </p>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setShowAddRecipe(false);
                    alert('Add Recipe: Coming soon!'); // extra explicit notification
                  }}
                >
                  OK
                </button>
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => setShowAddRecipe(false)}
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
