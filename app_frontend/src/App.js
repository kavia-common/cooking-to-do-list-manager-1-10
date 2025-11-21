import React, { useEffect } from 'react';
import './App.css';
import './index.css';
import { Theme, setCSSVariables } from './theme';

// PUBLIC_INTERFACE
function App() {
  /**
   * Minimal home screen with a top navigation bar:
   * - Apply theme, set document title
   * - Render a clean, empty surface beneath a minimalist top nav
   * - Nav uses Ocean Professional colors, responsive and accessible
   */
  useEffect(() => {
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    document.title = 'ChefMaster';
  }, []);

  return (
    <div className="ocean-app" data-theme="light" style={{ minHeight: '100%' }}>
      <div className="gradient-bg" />

      {/* Top Navigation */}
      <header
        className="app-header"
        aria-label="Top navigation"
        style={{ position: 'sticky', top: 0 }}
      >
        <nav
          className="brand"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            maxWidth: 1100,
            margin: '0 auto',
            padding: '14px 16px',
          }}
          aria-label="Primary"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <span
              className="brand-logo"
              aria-hidden
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                display: 'inline-grid',
                placeItems: 'center',
                background:
                  'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(245,158,11,0.15))',
                boxShadow: '0 8px 20px var(--shadow-color)',
                color: 'var(--color-text)',
              }}
            >
              🍲
            </span>
            <h1
              style={{
                margin: 0,
                fontSize: 20,
                letterSpacing: 0.3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textTransform: 'lowercase',
              }}
              aria-label="chefmaster"
            >
              chefmaster
            </h1>
          </div>

          {/* Placeholder right area for future actions (kept minimal and empty now) */}
          <div aria-hidden style={{ width: 24, height: 24 }} />
        </nav>
      </header>

      {/* Empty, clean content area */}
      <main
        className="main"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '24px 16px',
          minHeight: '60vh',
        }}
      />
    </div>
  );
}

export default App;
