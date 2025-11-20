import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Sidebar component that renders a left-side navigation drawer of recipe sections.
 * Allows selecting a category and toggling collapse on smaller screens.
 */
export default function Sidebar({ categories, current, onSelect }) {
  return (
    <aside className="sidebar card" aria-label="Recipe sections">
      <div className="sidebar-header">
        <span className="sidebar-icon" aria-hidden>👨‍🍳</span>
        <div className="sidebar-title">
          <h3>Recipe Sections</h3>
          <p className="muted">Navigate your lists</p>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Recipe sections navigation">
        {categories.map((cat) => {
          const active = current === cat.key;
          return (
            <button
              key={cat.key}
              className={`nav-item ${active ? 'active' : ''}`}
              onClick={() => onSelect(cat.key)}
              aria-current={active ? 'page' : undefined}
            >
              <span className="nav-emoji" aria-hidden>{cat.icon}</span>
              <span className="nav-text">
                <span className="nav-label">{cat.label}</span>
                {typeof cat.count === 'number' ? (
                  <span className="nav-badge" aria-label={`${cat.count} items`}>{cat.count}</span>
                ) : null}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
