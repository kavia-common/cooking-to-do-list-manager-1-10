import React, { useEffect, useMemo, useState } from 'react';
import TaskList from '../components/TaskList';
import TaskFormModal from '../components/TaskFormModal';
import { Theme, setCSSVariables } from '../theme';
import { createTask, reorder } from '../utils/types';

/**
 * PUBLIC_INTERFACE
 * CookingTasks page
 * - Dedicated page for displaying and managing cooking-related tasks.
 * - Tasks are categorized (Prep, Cooking, Serving) and support add/edit/delete/complete/reorder locally.
 * - Styled according to the Ocean Professional theme and responsive for desktop and mobile.
 */
export default function CookingTasks() {
  useEffect(() => {
    // Ensure theme variables are applied if landing directly on this route
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    document.title = 'maestro';
  }, []);

  // Initial categorized tasks (placeholder/demo data)
  const initialData = useMemo(
    () => ({
      prep: [
        { ...createTask('Wash vegetables', 'Rinse thoroughly under cold water', 'medium'), id: 't1' },
        { ...createTask('Chop onions', 'Dice into small pieces', 'high'), id: 't2' },
      ],
      cooking: [
        { ...createTask('Preheat oven', 'Set to 200°C / 392°F', 'low'), id: 't3' },
      ],
      serving: [
        { ...createTask('Set the table', 'Plates, cutlery, napkins', 'low'), id: 't4' },
      ],
    }),
    []
  );

  const [lists, setLists] = useState(initialData);
  const [activeCategory, setActiveCategory] = useState('prep'); // prep | cooking | serving
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const categoriesMeta = [
    { key: 'prep', label: 'Prep', icon: '🧰', hint: 'Prepare ingredients and station' },
    { key: 'cooking', label: 'Cooking', icon: '🍳', hint: 'Active stove/oven tasks' },
    { key: 'serving', label: 'Serving', icon: '🍽️', hint: 'Presentation and plating' },
  ];

  const openAdd = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const onAddOrUpdate = ({ title, notes, priority }) => {
    if (editItem) {
      // Update existing task in the corresponding list
      setLists((prev) => {
        const next = { ...prev };
        next[activeCategory] = prev[activeCategory].map((t) =>
          t.id === editItem.id ? { ...t, title, notes, priority } : t
        );
        return next;
      });
    } else {
      // Add new task to the active category
      const task = createTask(title, notes, priority);
      setLists((prev) => {
        const next = { ...prev };
        next[activeCategory] = [{ ...task }, ...prev[activeCategory]];
        return next;
      });
    }
    setModalOpen(false);
    setEditItem(null);
  };

  const onToggleDone = (id) => {
    setLists((prev) => {
      const next = { ...prev };
      next[activeCategory] = prev[activeCategory].map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      );
      return next;
    });
  };

  const onDelete = (id) => {
    setLists((prev) => {
      const next = { ...prev };
      next[activeCategory] = prev[activeCategory].filter((t) => t.id !== id);
      return next;
    });
  };

  const onEdit = (task) => {
    setEditItem(task);
    setModalOpen(true);
  };

  const onReorder = (startIndex, endIndex) => {
    setLists((prev) => {
      const next = { ...prev };
      next[activeCategory] = reorder(prev[activeCategory], startIndex, endIndex);
      return next;
    });
  };

  const currentList = lists[activeCategory] || [];

  return (
    <div className="card">
      {/* Header */}
      <div className="category-header box-header">
        <div className="category-title">
          <span className="category-icon" aria-hidden>🍳</span>
          <div>
            <h2>Cooking</h2>
            <p className="muted">Organize your prep, cooking, and serving tasks</p>
          </div>
        </div>
        <div className="hero-actions">
          <button className="btn" onClick={() => setActiveCategory('prep')} aria-pressed={activeCategory === 'prep'}>
            Prep
          </button>
          <button className="btn" onClick={() => setActiveCategory('cooking')} aria-pressed={activeCategory === 'cooking'}>
            Cooking
          </button>
          <button className="btn" onClick={() => setActiveCategory('serving')} aria-pressed={activeCategory === 'serving'}>
            Serving
          </button>
          <button className="btn primary" onClick={openAdd}>Add Task</button>
        </div>
      </div>

      {/* Hero */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-icon" aria-hidden>🌊</div>
          <div className="hero-text">
            <h3 className="hero-title">Work the kitchen like a pro</h3>
            <p className="hero-subtitle">
              View and manage your cooking tasks by category. Create, complete, edit, and reorder
              tasks to keep your flow efficient. This page follows the Ocean Professional theme and
              adapts beautifully on mobile.
            </p>
          </div>
          <div className="hero-actions" aria-hidden />
        </div>
      </div>

      {/* Category board */}
      <div className="category-board">
        {categoriesMeta.map((cat) => {
          const list = lists[cat.key] || [];
          return (
            <section key={cat.key} className="category-box card" aria-label={`${cat.label} tasks`}>
              <div className="category-header">
                <div className="category-title">
                  <span className="category-icon" aria-hidden>{cat.icon}</span>
                  <div>
                    <h2 style={{ fontSize: 16 }}>{cat.label}</h2>
                    <p className="muted">{cat.hint}</p>
                  </div>
                </div>
                <div className="hero-actions">
                  <button
                    className={`btn ${activeCategory === cat.key ? 'primary' : ''}`}
                    onClick={() => setActiveCategory(cat.key)}
                    aria-pressed={activeCategory === cat.key}
                  >
                    Focus
                  </button>
                </div>
              </div>

              <div className="box-list" style={{ paddingTop: 0 }}>
                <TaskList
                  tasks={list}
                  onReorder={(from, to) => {
                    if (cat.key === activeCategory) {
                      onReorder(from, to);
                    } else {
                      // Reorder within non-focused list
                      setLists((prev) => {
                        const next = { ...prev };
                        next[cat.key] = reorder(prev[cat.key], from, to);
                        return next;
                      });
                    }
                  }}
                  onToggleDone={(id) => {
                    if (cat.key === activeCategory) return onToggleDone(id);
                    setLists((prev) => {
                      const next = { ...prev };
                      next[cat.key] = prev[cat.key].map((t) =>
                        t.id === id ? ({ ...t, done: !t.done }) : t
                      );
                      return next;
                    });
                  }}
                  onDelete={(id) => {
                    if (cat.key === activeCategory) return onDelete(id);
                    setLists((prev) => {
                      const next = { ...prev };
                      next[cat.key] = prev[cat.key].filter((t) => t.id !== id);
                      return next;
                    });
                  }}
                  onEdit={(task) => {
                    setActiveCategory(cat.key);
                    onEdit(task);
                  }}
                />
              </div>
            </section>
          );
        })}
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
