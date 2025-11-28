import React, { useEffect, useMemo, useState } from 'react';
import { Theme, setCSSVariables } from '../theme';
import TaskList from '../components/TaskList';
import TaskFormModal from '../components/TaskFormModal';
import { loadState, saveState } from '../utils/storage';
import { reorder as reorderList } from '../utils/types';
import { ensureSampleDataSeeded } from '../utils/sampleData';

/**
 * PUBLIC_INTERFACE
 * Dashboard page
 * - Entry overview page with categorized cooking tasks (prep, cooking, serving).
 * - Seeds demo recipe tasks on first load for new or demo users.
 *   Note: The Recipes page now uses a single unified list (lists.recipes) and will
 *   migrate any categorized items on first load of that page. This dashboard remains
 *   categorized to preserve its overview layout.
 */
export default function Dashboard() {
  const [state, setState] = useState(() => ensureSampleDataSeeded());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState('prep');
  const [editItem, setEditItem] = useState(null);

  const categories = useMemo(() => ([
    { key: 'prep', label: 'Prep', icon: '🧑‍🍳' },
    { key: 'cooking', label: 'Cooking', icon: '🔥' },
    { key: 'serving', label: 'Serving', icon: '🍽️' },
  ]), []);

  useEffect(() => {
    // Ensure theme variables are applied if landing directly on this route
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    document.title = 'chef master';
  }, []);

  // Persistence: save whenever lists change
  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  const lists = state?.lists || { prep: [], cooking: [], serving: [] };

  const openAddModal = (category) => {
    setEditItem(null);
    setModalCategory(category);
    setModalOpen(true);
  };

  const onSubmitModal = (data) => {
    setState(prev => {
      const current = prev?.lists?.[modalCategory] || [];
      if (editItem) {
        const updated = current.map(t => (t.id === editItem.id ? { ...t, ...data } : t));
        return { lists: { ...prev.lists, [modalCategory]: updated } };
      }
      const newTask = { ...data, id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, done: false, createdAt: Date.now() };
      return { lists: { ...prev.lists, [modalCategory]: [newTask, ...current] } };
    });
    setModalOpen(false);
    setEditItem(null);
  };

  const handlersFor = (category) => {
    const toggle = (id) => {
      setState(prev => {
        const arr = prev.lists[category] || [];
        const next = arr.map(t => (t.id === id ? { ...t, done: !t.done } : t));
        return { lists: { ...prev.lists, [category]: next } };
      });
    };
    const remove = (id) => {
      setState(prev => {
        const arr = prev.lists[category] || [];
        const next = arr.filter(t => t.id !== id);
        return { lists: { ...prev.lists, [category]: next } };
      });
    };
    const edit = (task) => {
      setEditItem(task);
      setModalCategory(category);
      setModalOpen(true);
    };
    const reorder = (from, to) => {
      setState(prev => {
        const arr = prev.lists[category] || [];
        const next = reorderList(arr, from, to);
        return { lists: { ...prev.lists, [category]: next } };
      });
    };
    return { toggle, remove, edit, reorder };
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="category-header box-header">
        <div className="category-title">
          <span className="category-icon" aria-hidden>🏠</span>
          <div>
            <h2>Dashboard</h2>
            <p className="muted">Overview of your cooking workflow</p>
          </div>
        </div>
        <div className="hero-actions" aria-hidden />
      </div>

      {/* Hero */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-icon" aria-hidden>🌊</div>
          <div className="hero-text">
            <h3 className="hero-title">Welcome back!</h3>
            <p className="hero-subtitle">
              Start with these sample recipe tasks. Add, complete, and reorder items as you cook.
            </p>
          </div>
          <div className="hero-actions" aria-hidden />
        </div>
      </div>

      {/* Category board with three boxes */}
      <div className="category-board">
        {categories.map(cat => {
          const { toggle, remove, edit, reorder } = handlersFor(cat.key);
          const items = lists[cat.key] || [];
          return (
            <section key={cat.key} className="category-box card">
              <div className="category-header">
                <div className="category-title">
                  <span className="category-icon" aria-hidden>{cat.icon}</span>
                  <div>
                    <h2>{cat.label}</h2>
                    <p className="muted">Manage your {cat.label.toLowerCase()} tasks</p>
                  </div>
                </div>
                <div className="hero-actions">
                  <button className="btn primary" onClick={() => openAddModal(cat.key)}>Add Task</button>
                </div>
              </div>
              <div className="box-list" style={{ paddingTop: 0 }}>
                <TaskList
                  tasks={items}
                  onReorder={reorder}
                  onToggleDone={toggle}
                  onDelete={remove}
                  onEdit={edit}
                />
              </div>
            </section>
          );
        })}
      </div>

      <TaskFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditItem(null); }}
        onSubmit={onSubmitModal}
        initial={editItem ? { title: editItem.title, notes: editItem.notes, priority: editItem.priority || 'medium' } : undefined}
      />
    </div>
  );
}
