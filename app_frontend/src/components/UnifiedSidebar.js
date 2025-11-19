import React, { useMemo, useState } from 'react';
import { DEFAULT_CATEGORIES } from '../utils/types';

/**
 * PUBLIC_INTERFACE
 * UnifiedSidebar
 * A single sidebar that combines:
 * - Navigation (categories)
 * - Reservations management (list, select, create, rename, delete)
 *
 * Props:
 * - open: boolean (for mobile toggle open/close)
 * - current: current section id (category id)
 * - onSelectSection: (id: string) => void
 *
 * - reservations: Array<{id: string, name: string}>
 * - selectedReservationId: string
 * - onSelectReservation: (id: string) => void
 * - onCreateReservation: (name: string) => void
 * - onRenameReservation: (id: string, name: string) => void
 * - onDeleteReservation: (id: string) => void
 *
 * - onToggle: (open: boolean) => void
 */
export default function UnifiedSidebar({
  open,
  current,
  onSelectSection,

  reservations,
  selectedReservationId,
  onSelectReservation,
  onCreateReservation,
  onRenameReservation,
  onDeleteReservation,

  onToggle
}) {
  const drawerClass = ['nav-drawer', open ? 'open' : ''].filter(Boolean).join(' ');
  const items = useMemo(
    () => [
      ...DEFAULT_CATEGORIES.map(c => ({ id: c.id, label: c.name, icon: c.icon })),
    ],
    []
  );

  // Local UI state for reservation CRUD
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const canCreate = newName.trim().length > 0;
  const canRename = editName.trim().length > 0;

  const handleToggleClick = () => {
    onToggle?.(!open);
  };
  const handleClose = () => onToggle?.(false);

  const handleSelectSection = (id) => {
    onSelectSection?.(id);
    handleClose();
  };

  const submitCreate = (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    onCreateReservation?.(name);
    setNewName('');
    setCreating(false);
  };

  const submitRename = (e) => {
    e.preventDefault();
    const name = editName.trim();
    if (!name || !editingId) return;
    onRenameReservation?.(editingId, name);
    setEditingId(null);
    setEditName('');
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="nav-toggle"
        aria-label="Toggle sidebar"
        onClick={handleToggleClick}
        type="button"
      >
        ☰
      </button>

      <aside className={drawerClass} aria-label="Sidebar">
        {/* Navigate Section */}
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
                  onClick={() => handleSelectSection(item.id)}
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

        {/* Divider */}
        <div style={{ height: 10 }} />

        {/* Reservations Section */}
        <div className="nav-header">
          <span className="nav-title">Reservations</span>
        </div>
        <ul className="nav-list" style={{ marginTop: 8 }}>
          {reservations.map(r => {
            const isActive = r.id === selectedReservationId;
            const itemClass = ['nav-item', isActive ? 'active' : ''].filter(Boolean).join(' ');
            const isEditing = editingId === r.id;

            return (
              <li key={r.id}>
                {!isEditing ? (
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <button
                      className={itemClass}
                      onClick={() => onSelectReservation?.(r.id)}
                      aria-current={isActive ? 'page' : undefined}
                      type="button"
                      style={{ flex: 1 }}
                    >
                      <span className="nav-icon" aria-hidden>🗂️</span>
                      <span className="nav-label" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {r.name}
                      </span>
                    </button>
                    <button
                      className="icon-btn"
                      aria-label={`Rename ${r.name}`}
                      title="Rename"
                      onClick={() => { setEditingId(r.id); setEditName(r.name); }}
                      type="button"
                    >
                      ✎
                    </button>
                    <button
                      className="icon-btn danger"
                      aria-label={`Delete ${r.name}`}
                      title="Delete"
                      onClick={() => onDeleteReservation?.(r.id)}
                      type="button"
                    >
                      🗑️
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submitRename} className="field" style={{ padding: 6 }}>
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      placeholder="Reservation name"
                      aria-label="Reservation name"
                    />
                    <div className="modal-actions" style={{ paddingTop: 6, justifyContent: 'flex-end' }}>
                      <button type="button" className="btn ghost" onClick={() => { setEditingId(null); setEditName(''); }}>
                        Cancel
                      </button>
                      <button type="submit" className="btn primary" disabled={!canRename}>
                        Save
                      </button>
                    </div>
                  </form>
                )}
              </li>
            );
          })}
        </ul>

        {!creating ? (
          <div style={{ padding: 8 }}>
            <button className="btn" style={{ width: '100%' }} onClick={() => setCreating(true)} type="button">
              + New Reservation
            </button>
          </div>
        ) : (
          <form onSubmit={submitCreate} className="field" style={{ padding: 8 }}>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g., Weeknight Dinners"
              aria-label="New reservation name"
            />
            <div className="modal-actions" style={{ paddingTop: 6, justifyContent: 'flex-end' }}>
              <button type="button" className="btn ghost" onClick={() => { setCreating(false); setNewName(''); }}>
                Cancel
              </button>
              <button type="submit" className="btn primary" disabled={!canCreate}>
                Create
              </button>
            </div>
          </form>
        )}
      </aside>

      {open ? <div className="backdrop" onClick={handleClose} /> : null}
    </>
  );
}
