import React from 'react';
import { DEFAULT_CATEGORIES } from '../utils/types';

/**
 * PUBLIC_INTERFACE
 * Navigation drawer for category selection with mobile toggle.
 * Props:
 * - open: boolean drawer state
 * - current: current section id (category id or 'recipes')
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

  const items = [
    ...DEFAULT_CATEGORIES.map(c => ({ id: c.id, label: c.name, icon: c.icon })),
    { id: 'recipes', label: 'Recipes', icon: '📖' },
  ];

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

      <aside className={drawerClass} aria-label="Categories and Sections">
        <div className="nav-header">
          <span className="nav-title">Navigate</span>
          <button className="nav-close" onClick={handleClose} aria-label="Close" type="button">
            ✕
          </button>
        </div>
        <ul className="nav-list">
          {items.map((item) => {
            const isActive = current === item.id;
            const itemClass = ['nav-item', isActive ? 'active' : ''].filter(Boolean).join(' ');
            return (
              <li key={item.id}>
                <button
                  className={itemClass}
                  onClick={() => handleSelect(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  type="button"
                >
                  <span className="nav-icon" aria-hidden>
                    {item.icon}
                  </span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {open ? <div className="backdrop" onClick={handleClose} /> : null}
    </>
  );
}
