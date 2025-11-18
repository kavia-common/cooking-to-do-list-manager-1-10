import React, { useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * ReservationsManager
 * Sidebar/section to manage multiple "reservations" (lists of categorized tasks).
 *
 * Props:
 * - reservations: Array<{id: string, name: string}>
 * - selectedId: string
 * - onSelect: (id: string) => void
 * - onCreate: (name: string) => void
 * - onRename: (id: string, name: string) => void
 * - onDelete: (id: string) => void
 */
export default function ReservationsManager({
  reservations,
  selectedId,
  onSelect,
  onCreate,
  onRename,
  onDelete
}) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const canCreate = useMemo(() => newName.trim().length > 0, [newName]);
  const canRename = useMemo(() => editName.trim().length > 0, [editName]);

  const submitCreate = (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    onCreate?.(name);
    setNewName('');
    setCreating(false);
  };

  const submitRename = (e) => {
    e.preventDefault();
    const name = editName.trim();
    if (!name || !editingId) return;
    onRename?.(editingId, name);
    setEditingId(null);
    setEditName('');
  };

  return (
    <aside className="nav-drawer" aria-label="Reservations">
      <div className="nav-header">
        <span className="nav-title">Reservations</span>
        {/* No close button inside primary layout; drawer uses same style class */}
      </div>

      <ul className="nav-list" style={{ marginTop: 8 }}>
        {reservations.map(r => {
          const isActive = r.id === selectedId;
          const itemClass = ['nav-item', isActive ? 'active' : ''].filter(Boolean).join(' ');
          const isEditing = editingId === r.id;

          return (
            <li key={r.id}>
              {!isEditing ? (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <button
                    className={itemClass}
                    onClick={() => onSelect?.(r.id)}
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
                    onClick={() => onDelete?.(r.id)}
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
  );
}
