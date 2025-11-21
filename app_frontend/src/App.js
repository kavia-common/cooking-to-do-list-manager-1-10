import React, { useEffect } from 'react';
import './App.css';
import './index.css';
import { Theme, setCSSVariables } from './theme';

// PUBLIC_INTERFACE
function App() {
  /**
   * Minimal home screen:
   * - Keep theme application and document title
   * - Render a clean, distraction-free surface
   * - No header, no sidebar, no lists, no FAB, no modals
   */
  useEffect(() => {
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    document.title = 'ChefMaster';
  }, []);

  return (
    <div className="ocean-app" data-theme="light" style={{ minHeight: '100%' }}>
      <div className="gradient-bg" />
      <main
        className="main"
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '24px 16px',
          display: 'grid',
          placeItems: 'center',
          minHeight: '80vh',
        }}
      >
        <section
          className="card"
          aria-label="Minimal home"
          style={{
            padding: 28,
            width: '100%',
            maxWidth: 560,
            textAlign: 'center',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 16,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              display: 'inline-grid',
              placeItems: 'center',
              marginBottom: 12,
              background:
                'linear-gradient(135deg, rgba(37,99,235,0.10), rgba(245,158,11,0.10))',
              boxShadow: '0 10px 24px var(--shadow-color)',
              fontSize: 28,
            }}
            aria-hidden
          >
            🌊
          </div>
          <h1 style={{ margin: '8px 0 6px', fontSize: 22 }}>Welcome</h1>
          <p className="muted" style={{ margin: 0, fontSize: 13 }}>
            A clean start. No distractions on the home screen.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
