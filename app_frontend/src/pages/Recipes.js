import React, { useEffect, useState } from 'react';
import { Theme, setCSSVariables } from '../theme';

/**
 * PUBLIC_INTERFACE
 * Recipes page
 * - Provides a foundation for displaying or managing recipes.
 * - Ocean Professional styling using existing CSS tokens.
 * - Includes a placeholder grid and call-to-action for future recipe content.
 */
export default function Recipes() {
  useEffect(() => {
    // Ensure theme variables are applied if landing directly on /recipes
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    document.title = 'maestro';
  }, []);

  const [query, setQuery] = useState('');
  const [view, setView] = useState('all'); // all | favorites | drafts

  return (
    <div className="card">
      <div className="category-header box-header">
        <div className="category-title">
          <span className="category-icon" aria-hidden>📖</span>
          <div>
            <h2>Recipes</h2>
            <p className="muted">Collect, organize, and manage your recipes</p>
          </div>
        </div>
        <div className="hero-actions">
          <button className="btn" onClick={() => setQuery('')}>Clear</button>
          <button className="btn primary" onClick={() => alert('Add Recipe (placeholder)')}>Add Recipe</button>
        </div>
      </div>

      <div className="hero">
        <div className="hero-inner" style={{ rowGap: 10 }}>
          <div className="hero-icon" aria-hidden>🌊</div>
          <div className="hero-text">
            <h3 className="hero-title">Your personal cookbook</h3>
            <p className="hero-subtitle">
              Create and curate recipes for your kitchen flow. Use search and filters to quickly
              find what you need. This page is a foundation for future recipe management.
            </p>
          </div>
          <div className="hero-actions" style={{ minWidth: 260, flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="field" style={{ margin: 0 }}>
              <span>Search recipes</span>
              <input
                placeholder="Search by title, tags, or ingredients"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search recipes"
              />
            </div>
            <div className="hero-actions" style={{ gap: 8 }}>
              <button
                className={`btn ${view === 'all' ? 'primary' : ''}`}
                onClick={() => setView('all')}
                aria-pressed={view === 'all'}
              >
                All
              </button>
              <button
                className={`btn ${view === 'favorites' ? 'primary' : ''}`}
                onClick={() => setView('favorites')}
                aria-pressed={view === 'favorites'}
              >
                Favorites
              </button>
              <button
                className={`btn ${view === 'drafts' ? 'primary' : ''}`}
                onClick={() => setView('drafts')}
                aria-pressed={view === 'drafts'}
              >
                Drafts
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder recipes area - future grid/list */}
      <div className="lists">
        <div className="list">
          <h3>Recipe Library</h3>
          <div className="box-list" style={{ paddingTop: 0 }}>
            <div className="empty">
              <p>No recipes yet.</p>
              <p className="muted" style={{ marginTop: 8, fontSize: 12 }}>
                This is a placeholder area. In a future update, this section will display a grid/list of recipes
                with thumbnails, tags, and quick actions. Use the "Add Recipe" button to start creating recipes
                when functionality is available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
