import React, { useEffect, useState } from 'react';
import { Theme, setCSSVariables } from '../theme';

/**
 * PUBLIC_INTERFACE
 * MealPrep page
 * - Dedicated page for meal preparation planning.
 * - Ocean Professional styling using existing CSS tokens.
 * - Includes placeholder content and simple controls for future expansion.
 */
export default function MealPrep() {
  useEffect(() => {
    // Ensure theme variables are applied if landing directly on /meal-prep
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    document.title = 'maestro';
  }, []);

  const [view, setView] = useState('overview'); // overview | week | shopping

  return (
    <div className="card">
      {/* Header */}
      <div className="category-header box-header">
        <div className="category-title">
          <span className="category-icon" aria-hidden>🧰</span>
          <div>
            <h2>Meal Prep</h2>
            <p className="muted">Plan and organize your weekly prep</p>
          </div>
        </div>
        <div className="hero-actions">
          <button
            className={`btn ${view === 'overview' ? 'primary' : ''}`}
            onClick={() => setView('overview')}
            aria-pressed={view === 'overview'}
          >
            Overview
          </button>
          <button
            className={`btn ${view === 'week' ? 'primary' : ''}`}
            onClick={() => setView('week')}
            aria-pressed={view === 'week'}
          >
            Week
          </button>
          <button
            className={`btn ${view === 'shopping' ? 'primary' : ''}`}
            onClick={() => setView('shopping')}
            aria-pressed={view === 'shopping'}
          >
            Shopping
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-icon" aria-hidden>🌊</div>
          <div className="hero-text">
            <h3 className="hero-title">Meal Prep coming soon</h3>
            <p className="hero-subtitle">
              This page will help you plan and batch your cooking. Expect sections for weekly plans,
              batch cooking tasks, and an auto-generated shopping list—all styled with the Ocean
              Professional theme.
            </p>
          </div>
          <div className="hero-actions" aria-hidden />
        </div>
      </div>

      {/* Placeholder content blocks prepared for future expansion */}
      <div className="category-board">
        <section className="category-box card" aria-label="Prep Overview">
          <div className="category-header">
            <div className="category-title">
              <span className="category-icon" aria-hidden>📋</span>
              <div>
                <h2 style={{ fontSize: 16 }}>Prep Overview</h2>
                <p className="muted">High-level plan and notes</p>
              </div>
            </div>
            <div className="hero-actions" aria-hidden />
          </div>
          <div className="box-list" style={{ paddingTop: 0 }}>
            <div className="empty">
              <p>Meal Prep coming soon</p>
              <p className="muted" style={{ marginTop: 8, fontSize: 12 }}>
                This section will summarize your upcoming prep sessions and tasks.
              </p>
            </div>
          </div>
        </section>

        <section className="category-box card" aria-label="Weekly Plan">
          <div className="category-header">
            <div className="category-title">
              <span className="category-icon" aria-hidden>🗓️</span>
              <div>
                <h2 style={{ fontSize: 16 }}>Weekly Plan</h2>
                <p className="muted">Meals and batches by day</p>
              </div>
            </div>
            <div className="hero-actions" aria-hidden />
          </div>
          <div className="box-list" style={{ paddingTop: 0 }}>
            <div className="empty">
              <p>No weekly plan yet.</p>
              <p className="muted" style={{ marginTop: 8, fontSize: 12 }}>
                A calendar-style plan will appear here with batch slots and recipe links.
              </p>
            </div>
          </div>
        </section>

        <section className="category-box card" aria-label="Shopping List">
          <div className="category-header">
            <div className="category-title">
              <span className="category-icon" aria-hidden>🛒</span>
              <div>
                <h2 style={{ fontSize: 16 }}>Shopping List</h2>
                <p className="muted">Auto-generated from your plan</p>
              </div>
            </div>
            <div className="hero-actions" aria-hidden />
          </div>
          <div className="box-list" style={{ paddingTop: 0 }}>
            <div className="empty">
              <p>No items yet.</p>
              <p className="muted" style={{ marginTop: 8, fontSize: 12 }}>
                As you add meals and tasks, this list will compile needed ingredients.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
