import React, { useMemo } from 'react';
import TaskList from './TaskList';
import { DEFAULT_CATEGORIES } from '../utils/types';

/**
 * PUBLIC_INTERFACE
 * CategoryBoard
 * Renders all task categories as individual, visually distinct "boxes"
 * while preserving existing drag-and-drop/reorder behavior.
 *
 * Props:
 * - lists: { [categoryId]: Task[] }
 * - onReorder: (categoryId: string, startIndex: number, endIndex: number) => void
 * - onToggleDone: (categoryId: string, taskId: string) => void
 * - onDelete: (categoryId: string, taskId: string) => void
 * - onEdit: (categoryId: string, task: Task) => void
 *
 * Notes:
 * - Uses the Ocean Professional look via App.css classes (cards, shadows, rounded corners).
 * - Responsive: stacks on small screens, flows in two/three columns on larger screens.
 */
export default function CategoryBoard({
  lists,
  onReorder,
  onToggleDone,
  onDelete,
  onEdit
}) {
  const categories = useMemo(() => DEFAULT_CATEGORIES, []);

  return (
    <section className="category-board">
      {categories.map(cat => {
        const tasks = lists[cat.id] || [];
        const activeCount = tasks.filter(t => !t.done).length;

        // Wrap handlers to provide categoryId context
        const handleReorder = (start, end) => onReorder?.(cat.id, start, end);
        const handleToggle = (taskId) => onToggleDone?.(cat.id, taskId);
        const handleDelete = (taskId) => onDelete?.(cat.id, taskId);
        const handleEdit = (task) => onEdit?.(cat.id, task);

        return (
          <div key={cat.id} className="category-box card">
            <div className="category-header box-header">
              <div className="category-title">
                <span className="category-icon" aria-hidden>
                  {cat.icon}
                </span>
                <div>
                  <h2>{cat.name}</h2>
                  <p className="muted">
                    {activeCount} active • {tasks.length} total
                  </p>
                </div>
              </div>
            </div>

            <div className="list box-list">
              <TaskList
                tasks={tasks}
                onReorder={handleReorder}
                onToggleDone={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}
