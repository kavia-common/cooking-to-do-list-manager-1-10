import React from 'react';

// PUBLIC_INTERFACE
export default function TaskItem({ task, index, onToggleDone, onDelete, onEdit, draggableProps }) {
  const priorityColor = {
    low: 'var(--color-muted)',
    medium: 'var(--color-secondary)',
    high: 'var(--color-error)',
  }[task.priority || 'medium'];

  return (
    <div className={`task-item ${task.done ? 'done' : ''}`} {...(draggableProps || {})}>
      <div className="task-left">
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => onToggleDone(task.id)}
          aria-label="Toggle complete"
        />
        <div className="task-content">
          <div className="task-title">
            <span className="drag-handle" aria-hidden>⋮⋮</span>
            <span>{task.title}</span>
            <span className="priority-dot" style={{ backgroundColor: priorityColor }} />
          </div>
          {task.notes ? <div className="task-notes">{task.notes}</div> : null}
        </div>
      </div>
      <div className="task-actions">
        <button className="icon-btn" onClick={() => onEdit(task)} aria-label="Edit">✎</button>
        <button className="icon-btn danger" onClick={() => onDelete(task.id)} aria-label="Delete">🗑️</button>
      </div>
    </div>
  );
}
