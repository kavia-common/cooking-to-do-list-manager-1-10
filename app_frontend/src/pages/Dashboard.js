import React, { useEffect } from 'react';
import { Theme, setCSSVariables } from '../theme';

/**
 * PUBLIC_INTERFACE
 * Dashboard page
 * - Entry overview page with simple placeholder content.
 * - Uses the Ocean Professional theme and matches the app's minimal, light style.
 */
export default function Dashboard() {
  useEffect(() => {
    // Ensure theme variables are applied if landing directly on this route
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    document.title = 'chef master';
  }, []);

  return (
    <div className="card">
      {/* Header */}
      <div className="category-header box-header">
        <div className="category-title">
          <span className="category-icon" aria-hidden>🏠</span>
          <div>
            <h2>Dashboard</h2>
            <p className="muted">Overview of your cooking workflow</p>
          </div>
        </div>
        <div className="hero-actions" aria-hidden />
      </div>

      {/* Hero */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-icon" aria-hidden>🌊</div>
          <div className="hero-text">
            <h3 className="hero-title">Welcome back!</h3>
            <p className="hero-subtitle">
              This is your starting point. Navigate using the left drawer to manage ingredients, recipes, and seating. Use the + button to quickly add items as you work.
            </p>
          </div>
          <div className="hero-actions" aria-hidden />
        </div>
      </div>

      {/* Placeholder content */}
      <div className="lists">
        <div className="list">
          <h3>Getting started</h3>
          <div className="box-list" style={{ paddingTop: 0 }}>
            <div className="empty">
              <p>Dashboard content coming soon.</p>
              <p className="muted" style={{ marginTop: 8, fontSize: 12 }}>
                We will show quick stats and shortcuts here in a future update.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
