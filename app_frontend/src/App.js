import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import { Theme, setCSSVariables } from './theme';
import Sidebar from './components/Sidebar';
import FAB from './components/FAB';
import Recipes from './pages/Recipes';
import Ingredients from './pages/Ingredients';
import CookingTasks from './pages/CookingTasks';

import Serving from './pages/Serving';
import Dashboard from './pages/Dashboard';

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
    // Update browser tab title
    document.title = 'chef master';
  }, []);

  // Side navigation categories for cooking (tables now refers to seat assignments)
  const navCategories = useMemo(
    () => [
      { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
      { key: 'ingredients', label: 'Ingredients', icon: '🧅', count: 5 },

      { key: 'cooking-tasks', label: 'Cooking', icon: '🍳', count: 4 },
      { key: 'recipes', label: 'Recipes', icon: '📖' },
      { key: 'tables', label: 'Seat Assignments', icon: '🍽️' },
      { key: 'settings', label: 'Settings', icon: '⚙️' },
    ],
    []
  );

  const [current, setCurrent] = useState(initialSection || 'dashboard');

  // Render the active section content; Recipes, Ingredients, MealPrep, and CookingTasks get their own components
  const renderSection = () => {
    if (current === 'recipes') {
      return <Recipes />;
    }
    if (current === 'ingredients') {
      return <Ingredients />;
    }

    if (current === 'cooking-tasks') {
      return <CookingTasks />;
    }
    if (current === 'tables') {
      return <Serving />;
    }
    if (current === 'dashboard') {
      return <Dashboard />;
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
              <h2>{active?.label || 'chef master'}</h2>
              <p className="muted">Ocean Professional • clean and minimal (Seat management where applicable)</p>
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
    if (current === 'recipes') {
      alert('Add Recipe (placeholder)');
    } else if (current === 'ingredients') {
      alert('Add Ingredient (placeholder)');
    } else if (current === 'cooking-tasks') {
      alert('Add Cooking Task (use the Add Task button in the page)');
    } else if (current === 'tables') {
      alert('Seat Assignments do not support tasks.');
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
              <h1>chef master</h1>
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
            if (key === 'recipes') {
              setCurrent('recipes');
              return;
            }
            if (key === 'ingredients') {
              setCurrent('ingredients');
              return;
            }
            if (key === 'cooking-tasks') {
              setCurrent('cooking-tasks');
              return;
            }

            if (key === 'tables') {
              // Seat Assignments section
              setCurrent('tables');
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
