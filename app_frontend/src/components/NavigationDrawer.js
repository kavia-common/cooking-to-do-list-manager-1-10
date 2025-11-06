import React from 'react';
import { DEFAULT_CATEGORIES } from '../utils/types';

/**
 * PUBLIC_INTERFACE
 * Navigation drawer for category selection with mobile toggle.
 * Ingredients category has been removed from available categories.
 * Props:
 * - open: boolean drawer state
 * - current: current category id
 * - onSelect: (id: string) => void
 * - onToggle: (open?: boolean) => void
 */
export default function NavigationDrawer({ open, current, onSelect, onToggle }) {
  const drawerClass = ['nav-drawer', open ? 'open' : ''].filter(Boolean).join(' ');

  const handleToggleClick = () => {
    if (typeof onToggle === 'function') {
      onToggle(!open);
    }
  };

  const handleClose = () => {
    if (typeof onToggle === 'function') {
      onToggle(false);
    }
  };

  const handleSelect = (id) => {
    if (typeof onSelect === 'function') {
      onSelect(id);
    }
    handleClose();
  };

  return (
    <>
      <button
        className="nav-toggle"
        aria-label="Toggle navigation"
        onClick={handleToggleClick}
        type="button"
      >
        ☰
      </button>

      <aside className={drawerClass} aria-label="Categories">
        <div className="nav-header">
          <span className="nav-title">Categories</span>
          <button className="nav-close" onClick={handleClose} aria-label="Close" type="button">
            ✕
          </button>
        </div>
        <ul className="nav-list">
          {DEFAULT_CATEGORIES.map((cat) => {
            const isActive = current === cat.id;
            const itemClass = ['nav-item', isActive ? 'active' : ''].filter(Boolean).join(' ');
            return (
              <li key={cat.id}>
                <button
                  className={itemClass}
                  onClick={() => handleSelect(cat.id)}
                  aria-current={isActive ? 'page' : undefined}
                  type="button"
                >
                  <span className="nav-icon" aria-hidden>
                    {cat.icon}
                  </span>
                  <span className="nav-label">{cat.name}</span>
                </button>
              </li>
            );
          })}
          <li>
            <a className="nav-item" href="#recipes" onClick={handleClose}>
              <span className="nav-icon" aria-hidden>📖</span>
              <span className="nav-label">Recipes</span>
            </a>
          </li>
        </ul>
      </aside>

      {open ? <div className="backdrop" onClick={handleClose} /> : null}
    </>
  );
}
