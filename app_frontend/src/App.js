import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import Header from './components/Header';
import NavigationDrawer from './components/NavigationDrawer';
import FAB from './components/FAB';
import TaskFormModal from './components/TaskFormModal';
import TaskList from './components/TaskList';
import { DEFAULT_CATEGORIES, DEFAULT_LISTS, createTask, reorder } from './utils/types';
import { loadState, saveState } from './utils/storage';
import { setCSSVariables } from './theme';

// PUBLIC_INTERFACE
function App() {
  const persisted = loadState();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [category, setCategory] = useState(persisted?.category || DEFAULT_CATEGORIES[0].id);
  const [lists, setLists] = useState(persisted?.lists || DEFAULT_LISTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Setup theme CSS variables
  useEffect(() => { setCSSVariables(); }, []);

  // persist
  useEffect(() => {
    saveState({ category, lists });
  }, [category, lists]);

  const currentLabel = useMemo(() => DEFAULT_CATEGORIES.find(c => c.id === category)?.name || '', [category]);

  const openAddModal = () => { setEditingTask(null); setModalOpen(true); };
  const openEditModal = (task) => { setEditingTask(task); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const handleSubmitTask = (payload) => {
    setLists(prev => {
      const arr = Array.from(prev[category] || []);
      if (editingTask) {
        const idx = arr.findIndex(t => t.id === editingTask.id);
        if (idx >= 0) {
          arr[idx] = { ...arr[idx], ...payload };
        }
      } else {
        arr.push(createTask(payload.title, payload.notes, payload.priority));
      }
      return { ...prev, [category]: arr };
    });
    setModalOpen(false);
  };

  const toggleDone = (id) => {
    setLists(prev => {
      const arr = (prev[category] || []).map(t => t.id === id ? { ...t, done: !t.done } : t);
      return { ...prev, [category]: arr };
    });
  };

  const deleteTask = (id) => {
    setLists(prev => {
      const arr = (prev[category] || []).filter(t => t.id !== id);
      return { ...prev, [category]: arr };
    });
  };

  const reorderTasks = (startIdx, endIdx) => {
    setLists(prev => {
      const arr = reorder(prev[category] || [], startIdx, endIdx);
      return { ...prev, [category]: arr };
    });
  };

  const clearCompleted = () => {
    setLists(prev => {
      const arr = (prev[category] || []).filter(t => !t.done);
      return { ...prev, [category]: arr };
    });
  };

  const stats = useMemo(() => {
    const arr = lists[category] || [];
    const done = arr.filter(t => t.done).length;
    return { total: arr.length, done };
  }, [lists, category]);

  return (
    <div className="app-shell">
      <Header />
      <NavigationDrawer
        open={drawerOpen}
        current={category}
        onSelect={setCategory}
        onToggle={(v)=> setDrawerOpen(typeof v === 'boolean' ? v : !drawerOpen)}
      />
      <main className="main">
        <div className="section-header">
          <div>
            <div className="section-title">{currentLabel}</div>
            <div className="section-sub">
              {stats.done}/{stats.total} completed
            </div>
          </div>
          <div>
            <button className="btn" onClick={clearCompleted} disabled={stats.done === 0}>
              Clear completed
            </button>
          </div>
        </div>
        <div className="card">
          <div className="category-card">
            <div className="muted small">Drag items to reorder. Click checkbox to complete.</div>
            <div>
              <button className="btn primary" onClick={openAddModal}>Add Task</button>
            </div>
          </div>
          <TaskList
            tasks={lists[category] || []}
            onReorder={reorderTasks}
            onToggleDone={toggleDone}
            onDelete={deleteTask}
            onEdit={openEditModal}
          />
        </div>
      </main>
      <FAB onClick={openAddModal} />
      <TaskFormModal
        open={modalOpen}
        initial={editingTask}
        onClose={closeModal}
        onSubmit={handleSubmitTask}
      />
    </div>
  );
}

export default App;
