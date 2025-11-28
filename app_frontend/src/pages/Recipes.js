import React, { useEffect, useMemo, useState } from 'react';
import { Theme, setCSSVariables } from '../theme';
import TaskList from '../components/TaskList';
import TaskFormModal from '../components/TaskFormModal';
import { loadState, saveState } from '../utils/storage';
import { ensureSampleDataSeeded } from '../utils/sampleData';
import { createTask, reorder as reorderList } from '../utils/types';

/**
 * PUBLIC_INTERFACE
 * Recipes page
 * - Represents recipes as a single unified list.
 * - Full CRUD: add, edit, delete, toggle complete, and reorder via drag.
 * - Persists to localStorage using the shared app state structure.
 */
export default function Recipes() {
  useEffect(() => {
    // Ensure theme variables are applied if landing directly on /recipes
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    document.title = 'chef master';
  }, []);

  // Seed sample data if none; then load current state
  const initial = useMemo(() => ensureSampleDataSeeded(), []);
  const [state, setState] = useState(() => initial || loadState() || { lists: { recipes: [] } });

  // Modal management
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Search
  const [query, setQuery] = useState('');

  // Derive unified recipes list from state
  // We will migrate old multi-list data (prep/cooking/serving) into 'recipes' key if needed.
  const lists = state?.lists || {};
  const hasUnified = Array.isArray(lists.recipes);
  const migratedRecipes = useMemo(() => {
    if (hasUnified) return lists.recipes;
    const merged = [
      ...(lists.prep || []),
      ...(lists.cooking || []),
      ...(lists.serving || []),
    ];
    return merged;
  }, [lists, hasUnified]);

  // One-time migration to single list key if necessary
  useEffect(() => {
    if (!hasUnified) {
      setState(prev => {
        const merged = [
          ...(prev?.lists?.prep || []),
          ...(prev?.lists?.cooking || []),
          ...(prev?.lists?.serving || []),
        ];
        const next = { lists: { ...prev.lists, recipes: merged } };
        saveState(next);
        return next;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasUnified]);

  // Persist on any state change
  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  const openAdd = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const onSubmitModal = (data) => {
    setState(prev => {
      const current = prev?.lists?.recipes || [];
      if (editItem) {
        const updated = current.map(t => (t.id === editItem.id ? { ...t, ...data } : t));
        return { lists: { ...prev.lists, recipes: updated } };
      }
      const newTask = createTask(data.title, data.notes, data.priority || 'medium');
      return { lists: { ...prev.lists, recipes: [newTask, ...current] } };
    });
    setModalOpen(false);
    setEditItem(null);
  };

  const toggle = (id) => {
    setState(prev => {
      const arr = prev?.lists?.recipes || [];
      const next = arr.map(t => (t.id === id ? { ...t, done: !t.done } : t));
      return { lists: { ...prev.lists, recipes: next } };
    });
  };
  const remove = (id) => {
    setState(prev => {
      const arr = prev?.lists?.recipes || [];
      const next = arr.filter(t => t.id !== id);
      return { lists: { ...prev.lists, recipes: next } };
    });
  };
  const edit = (task) => {
    setEditItem(task);
    setModalOpen(true);
  };
  const reorder = (from, to) => {
    setState(prev => {
      const arr = prev?.lists?.recipes || [];
      const next = reorderList(arr, from, to);
      return { lists: { ...prev.lists, recipes: next } };
    });
  };

  const filtered = migratedRecipes.filter((t) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (t.title?.toLowerCase().includes(q) || t.notes?.toLowerCase().includes(q));
  });

  return (
    <div className="card">
      {/* Header */}
      <div className="category-header box-header">
        <div className="category-title">
          <span className="category-icon" aria-hidden>📖</span>
          <div>
            <h2>Recipes</h2>
            <p className="muted">A single list to manage all your recipes</p>
          </div>
        </div>
        <div className="hero-actions">
          <button className="btn" onClick={() => setQuery('')}>Clear</button>
          <button className="btn primary" onClick={openAdd}>Add Recipe</button>
        </div>
      </div>

      {/* Hero / Controls */}
      <div className="hero">
        <div className="hero-inner" style={{ rowGap: 10 }}>
          <div className="hero-icon" aria-hidden>🌊</div>
          <div className="hero-text">
            <h3 className="hero-title">Your personal cookbook</h3>
            <p className="hero-subtitle">
              Manage all recipes in one place. Add notes, mark as complete when perfected, and reorder to prioritize.
            </p>
          </div>
          <div className="hero-actions" style={{ minWidth: 260, flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="field" style={{ margin: 0 }}>
              <span>Search recipes</span>
              <input
                placeholder="Search by title or notes"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search recipes"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Single unified list */}
      <div className="lists">
        <div className="list">
          <h3>All Recipes</h3>
          <div className="box-list" style={{ paddingTop: 0 }}>
            <TaskList
              tasks={filtered}
              onReorder={reorder}
              onToggleDone={toggle}
              onDelete={remove}
              onEdit={edit}
            />
          </div>
        </div>
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
