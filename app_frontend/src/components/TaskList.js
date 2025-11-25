import React, { useRef, useState } from 'react';
import TaskItem from './TaskItem';

// PUBLIC_INTERFACE
export default function TaskList({ tasks, onReorder, onToggleDone, onDelete, onEdit }) {
  const [dragIndex, setDragIndex] = useState(null);
  const containerRef = useRef(null);

  const onDragStart = (index) => setDragIndex(index);
  const onDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    onReorder(dragIndex, index);
    setDragIndex(index);
  };
  const onDragEnd = () => setDragIndex(null);

  return (
    <div className="task-list" ref={containerRef}>
      {tasks.length === 0 && (
        <div className="empty">
          <p>Nothing here yet. Use the + button to add your first item.</p>
        </div>
      )}
      {tasks.map((t, idx) => (
        <div
          key={t.id}
          draggable
          onDragStart={() => onDragStart(idx)}
          onDragOver={(e) => onDragOver(e, idx)}
          onDragEnd={onDragEnd}
        >
          <TaskItem
            task={t}
            index={idx}
            onToggleDone={onToggleDone}
            onDelete={onDelete}
            onEdit={onEdit}
            draggableProps={{}}
          />
        </div>
      ))}
    </div>
  );
}
