import React from 'react';

// PUBLIC_INTERFACE
export default function Header() {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-logo" aria-hidden>🍲</span>
        <div className="brand-text">
          <h1>Cooking To-Do</h1>
          <p className="subtitle">Plan, prep, cook, and enjoy</p>
        </div>
      </div>
    </header>
  );
}
