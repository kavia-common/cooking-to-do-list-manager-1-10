import React from 'react';

// PUBLIC_INTERFACE
export default function Header() {
  return (
    <header className="app-header" aria-label="App header">
      <div className="brand">
        <span className="brand-logo" aria-hidden>🍲</span>
        <div className="brand-text">
          <h1>bonito</h1>
          <p className="subtitle">Plan, prep, and cook</p>
        </div>
      </div>
    </header>
  );
}
