import React, { useEffect, useMemo, useState } from 'react';
import { Theme, setCSSVariables } from '../theme';
import { loadState } from '../utils/storage';
import { ensureSampleDataSeeded } from '../utils/sampleData';

/**
 * PUBLIC_INTERFACE
 * Recipes page
 * - Displays seeded sample tasks grouped under Prep, Cooking, and Serving so demo users
 *   can immediately see content.
 * - Ocean Professional styling using existing CSS tokens.
 */
export default function Recipes() {
  useEffect(() => {
    // Ensure theme variables are applied if landing directly on /recipes
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    document.title = 'chef master';
  }, []);

  // Ensure sample data exists; then read from storage
  const initialState = useMemo(() => ensureSampleDataSeeded(), []);
  const [query, setQuery] = useState('');
  const [view, setView] = useState('all'); // all | favorites | drafts
  const lists = initialState?.lists || { prep: [], cooking: [], serving: [] };

  // Simple filter by title/notes for demo
  const filterMatch = (t) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (t.title?.toLowerCase().includes(q) || t.notes?.toLowerCase().includes(q));
  };

  const groups = [
    { key: 'prep', label: 'Prep', icon: '🧑‍🍳' },
    { key: 'cooking', label: 'Cooking', icon: '🔥' },
    { key: 'serving', label: 'Serving', icon: '🍽️' },
  ];

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
              We’ve loaded a few sample recipe tasks to help you get started. Use search and filters
              to quickly find what you need. You can manage and complete these items from here or the Dashboard.
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
                disabled
                title="Coming soon"
              >
                Favorites
              </button>
              <button
                className={`btn ${view === 'drafts' ? 'primary' : ''}`}
                onClick={() => setView('drafts')}
                aria-pressed={view === 'drafts'}
                disabled
                title="Coming soon"
              >
                Drafts
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Show seeded sample lists grouped by category */}
      <div className="category-board">
        {groups.map((g) => {
          const items = (lists[g.key] || []).filter(filterMatch);
          return (
            <section key={g.key} className="category-box card">
              <div className="category-header">
                <div className="category-title">
                  <span className="category-icon" aria-hidden>{g.icon}</span>
                  <div>
                    <h2>{g.label}</h2>
                    <p className="muted">Sample tasks for {g.label.toLowerCase()}</p>
                  </div>
                </div>
              </div>
              <div className="box-list" style={{ paddingTop: 0 }}>
                {items.length === 0 ? (
                  <div className="empty">
                    <p>No items match your search.</p>
                  </div>
                ) : (
                  <div className="task-list">
                    {items.map((t) => (
                      <div key={t.id} className="task-item">
                        <div className="task-left" style={{ alignItems: 'center' }}>
                          <div className="task-content">
                            <div className="task-title" style={{ gap: 8 }}>
                              <span style={{ fontWeight: 600 }}>{t.title}</span>
                            </div>
                            {t.notes ? <div className="task-notes">{t.notes}</div> : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
