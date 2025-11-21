import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import { Theme, setCSSVariables } from './theme';
import Sidebar from './components/Sidebar';
import FAB from './components/FAB';
import Providers from './pages/Providers';

/**
 * PUBLIC_INTERFACE
 * App shell that integrates:
 * - Top header
 * - Left side navigation drawer with cooking categories
 * - Main content area
 * - Floating Action Button
 * The UI adheres to the Ocean Professional theme and is responsive.
 */
function App({ initialSection }) {
  useEffect(() => {
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    document.title = 'ChefMaster';
  }, []);

  // Side navigation categories for cooking
  const navCategories = useMemo(
    () => [
      { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
      { key: 'ingredients', label: 'Ingredients', icon: '🧅', count: 3 },
      { key: 'meal-prep', label: 'Meal Prep', icon: '🧰', count: 2 },
      { key: 'cooking-tasks', label: 'Cooking Tasks', icon: '🍳', count: 4 },
      { key: 'recipes', label: 'Recipes', icon: '📖' },
      { key: 'providers', label: 'Providers', icon: '🤝' }, // New navigation entry
      { key: 'serving', label: 'Serving', icon: '🍽️' },
      { key: 'settings', label: 'Settings', icon: '⚙️' },
    ],
    []
  );

  const [current, setCurrent] = useState(initialSection || 'dashboard');

  // Render the active section content; Providers gets its own page component
  const renderSection = () => {
    if (current === 'providers') {
      return <Providers />;
    }

    const active = navCategories.find((c) => c.key === current);
    return (
      <div className="card">
        <div className="category-header box-header">
          <div className="category-title">
            <span className="category-icon" aria-hidden>
              {active?.icon || '🍲'}
            </span>
            <div>
              <h2>{active?.label || 'ChefMaster'}</h2>
              <p className="muted">Ocean Professional • clean and minimal</p>
            </div>
          </div>
          <div className="hero-actions" aria-hidden />
        </div>

        <div className="hero">
          <div className="hero-inner">
            <div className="hero-icon" aria-hidden>⭐</div>
            <div className="hero-text">
              <h3 className="hero-title">
                {active?.label === 'Dashboard'
                  ? 'Welcome back!'
                  : `You are viewing: ${active?.label}`}
              </h3>
              <p className="hero-subtitle">
                Use the + button to add items. The left drawer helps you jump across cooking
                sections like ingredients, meal prep, and more.
              </p>
            </div>
            <div className="hero-actions">
              <button className="btn">Quick tour</button>
              <button className="btn primary">New item</button>
            </div>
          </div>
        </div>

        <div className="lists">
          <div className="list">
            <h3>Getting started</h3>
            <div className="empty">
              <p>No items in this section yet.</p>
              <p className="muted" style={{ marginTop: 8, fontSize: 12 }}>
                This placeholder preserves current functionality while adding the navigation
                structure requested.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const onFabClick = () => {
    // Placeholder: in a future task, this can open TaskFormModal wired to current section
    if (current === 'providers') {
      alert('Add Provider (placeholder)');
    } else {
      alert('Add item (placeholder)');
    }
  };

  return (
    <div className="ocean-app" data-theme="light" style={{ minHeight: '100%' }}>
      <div className="gradient-bg" />

      {/* Header */}
      <header className="app-header" aria-label="Top navigation">
        <nav className="brand" aria-label="Primary">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <span className="brand-logo" aria-hidden>🍲</span>
            <div className="brand-text">
              <h1>ChefMaster</h1>
              <p className="subtitle">Plan, prep, and cook</p>
            </div>
          </div>
          {/* Right area intentionally minimal to fit the design */}
          <div aria-hidden style={{ width: 24, height: 24 }} />
        </nav>
      </header>

      {/* Shell layout with sidebar and main */}
      <section className="content" aria-label="App shell">
        <Sidebar
          categories={navCategories}
          current={current}
          onSelect={(key) => {
            if (key === 'settings') {
              window.location.href = '/settings';
              return;
            }
            if (key === 'providers') {
              // Stay in-app by default; can also deep-link via /providers
              setCurrent('providers');
              return;
            }
            setCurrent(key);
          }}
        />
        <main className="main" aria-live="polite">
          {renderSection()}
        </main>
      </section>

      {/* Floating action */}
      <FAB onClick={onFabClick} />
    </div>
  );
}

export default App;
