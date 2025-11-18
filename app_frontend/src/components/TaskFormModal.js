import React, { useEffect, useRef, useState } from 'react';

// PUBLIC_INTERFACE
export default function TaskFormModal({ open, onClose, onSubmit, initial }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [notes, setNotes] = useState(initial?.notes || '');
  const [priority, setPriority] = useState(initial?.priority || 'medium');
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title || '');
      setNotes(initial?.notes || '');
      setPriority(initial?.priority || 'medium');
      setTimeout(() => firstInputRef.current?.focus(), 0);
    }
  }, [open, initial]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), notes: notes.trim(), priority });
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <h3>{initial ? 'Edit Task' : 'Add Recipe'}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <form onSubmit={submit} className="modal-body">
          <label className="field">
            <span>Title</span>
            <input
              ref={firstInputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Chop vegetables"
              required
            />
          </label>
          <label className="field">
            <span>Notes</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional details"
              rows={3}
            />
          </label>
          <label className="field">
            <span>Priority</span>
            <div className="priority-group">
              <label><input type="radio" name="prio" value="low" checked={priority==='low'} onChange={()=>setPriority('low')} /> Low</label>
              <label><input type="radio" name="prio" value="medium" checked={priority==='medium'} onChange={()=>setPriority('medium')} /> Medium</label>
              <label><input type="radio" name="prio" value="high" checked={priority==='high'} onChange={()=>setPriority('high')} /> High</label>
            </div>
          </label>
          <div className="modal-actions">
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">{initial ? 'Save' : 'Add Recipe'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
