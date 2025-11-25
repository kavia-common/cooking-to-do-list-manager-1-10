import React, { useEffect, useMemo, useState } from 'react';
import TaskList from '../components/TaskList';
import TaskFormModal from '../components/TaskFormModal';
import { Theme, setCSSVariables } from '../theme';
import { createTask, reorder } from '../utils/types';

/**
 * PUBLIC_INTERFACE
 * Tables page
 * - Dedicated page for displaying and managing table-related tasks.
 * - Follows the same categorized task structure styling and interactions.
 * - Users can view, add, edit, delete, complete, and reorder serving tasks locally.
 */
export default function Serving() {
  useEffect(() => {
    // Ensure theme variables are applied if landing directly on this route
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    document.title = 'chef master';
  }, []);

  // Initial tasks for Serving (placeholder/demo data)
  const initialServing = useMemo(
    () => ([
      { ...createTask('Set the table', 'Plates, cutlery, napkins', 'low'), id: 'srv1' },
      { ...createTask('Warm plates', 'Low oven or plate warmer', 'medium'), id: 'srv2' },
      { ...createTask('Garnish dishes', 'Fresh herbs on top', 'medium'), id: 'srv3' },
    ]),
    []
  );

  const [tasks, setTasks] = useState(initialServing);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const openAdd = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const onAddOrUpdate = ({ title, notes, priority }) => {
    if (editItem) {
      setTasks(prev => prev.map(t => t.id === editItem.id ? { ...t, title, notes, priority } : t));
    } else {
      const task = createTask(title, notes, priority);
      setTasks(prev => [{ ...task }, ...prev]);
    }
    setModalOpen(false);
    setEditItem(null);
  };

  const onToggleDone = (id) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const onDelete = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const onEdit = (task) => {
    setEditItem(task);
    setModalOpen(true);
  };

  const onReorder = (startIndex, endIndex) => {
    setTasks(prev => reorder(prev, startIndex, endIndex));
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="category-header box-header">
        <div className="category-title">
          <span className="category-icon" aria-hidden>🍽️</span>
          <div>
            <h2>Tables</h2>
            <p className="muted">Presentation, plating, and table service tasks</p>
          </div>
        </div>
        <div className="hero-actions">
          <button className="btn primary" onClick={openAdd}>Add Task</button>
        </div>
      </div>

      {/* Hero */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-icon" aria-hidden>🌊</div>
          <div className="hero-text">
            <h3 className="hero-title">Serve with style and ease</h3>
            <p className="hero-subtitle">
              Manage tasks for plating, garnishing, timing, and table setup. Add items, mark them
              complete, edit details, and drag to reorder—all consistent with the Ocean Professional theme.
            </p>
          </div>
          <div className="hero-actions" aria-hidden />
        </div>
      </div>

      {/* Task list */}
      <div className="lists">
        <div className="list">
          <h3>Tables Tasks</h3>
          <div className="box-list" style={{ paddingTop: 0 }}>
            <TaskList
              tasks={tasks}
              onReorder={onReorder}
              onToggleDone={onToggleDone}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </div>
        </div>
      </div>

      {/* Modal for add/edit */}
      <TaskFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditItem(null);
        }}
        onSubmit={onAddOrUpdate}
        initial={editItem || undefined}
      />
    </div>
  );
}
