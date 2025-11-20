import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import Header from './components/Header';
import TaskList from './components/TaskList';
import TaskFormModal from './components/TaskFormModal';
import FAB from './components/FAB';
import { Theme, setCSSVariables } from './theme';
import { createTask, reorder } from './utils/types';
import { loadState, saveState } from './utils/storage';

// PUBLIC_INTERFACE
function App() {
  /**
   * App state:
   * - themeMode
   * - single list of tasks
   * - task modal + edit
   */
  const [themeMode] = useState('light');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [tasksState, setTasksState] = useState([]);

  // Apply theme on mount
  useEffect(() => {
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    document.title = 'ChefMaster';
  }, []);

  // Initialize from legacy storage (single list)
  useEffect(() => {
    const legacy = loadState();
    if (legacy && legacy.lists) {
      const combined = [
        ...(Array.isArray(legacy.lists.prep) ? legacy.lists.prep : []),
        ...(Array.isArray(legacy.lists.cook) ? legacy.lists.cook : []),
        ...(Array.isArray(legacy.lists.serve) ? legacy.lists.serve : []),
        ...(Array.isArray(legacy.lists.list) ? legacy.lists.list : []),
      ];
      setTasksState(combined);
    }
  }, []);

  // Persist single list
  useEffect(() => {
    saveState({ lists: { list: tasksState } });
  }, [tasksState]);

  const tasks = useMemo(() => tasksState, [tasksState]);

  // PUBLIC_INTERFACE
  const openAddModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  // PUBLIC_INTERFACE
  const addTask = (payload) => {
    const newTask = createTask(payload.title, payload.notes, payload.priority);
    setTasksState(prev => [newTask, ...prev]);
    setModalOpen(false);
  };

  // PUBLIC_INTERFACE
  const updateTask = (payload) => {
    setTasksState(prev =>
      prev.map(t => (t.id === editingTask.id ? { ...t, ...payload } : t))
    );
    setEditingTask(null);
    setModalOpen(false);
  };

  // PUBLIC_INTERFACE
  const onSubmitTask = (data) => {
    if (editingTask) {
      updateTask(data);
    } else {
      addTask(data);
    }
  };

  // PUBLIC_INTERFACE
  const toggleDone = (id) => {
    setTasksState(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  // PUBLIC_INTERFACE
  const deleteTask = (id) => {
    setTasksState(prev => prev.filter(t => t.id !== id));
  };

  // PUBLIC_INTERFACE
  const editTask = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  // PUBLIC_INTERFACE
  const reorderTasks = (startIndex, endIndex) => {
    setTasksState(prev => reorder(prev, startIndex, endIndex));
  };

  return (
    <div className="ocean-app" data-theme={themeMode}>
      {/* Subtle gradient header background */}
      <div className="gradient-bg" />
      <Header />

      <div className="content">
        <main className="main">
          <>
            {/* Header for current list context and quick add */}
            <section className="category-header card">
              <div className="category-title">
                <span className="category-icon" aria-hidden>📋</span>
                <div>
                  <h2>My List</h2>
                  <p className="muted">
                    {tasks.filter(t => !t.done).length} active • {tasks.length} total
                  </p>
                </div>
              </div>
              <div className="category-actions">
                <button className="btn primary" onClick={openAddModal}>Add Item</button>
              </div>
            </section>

            {/* Single list view with DnD support */}
            <section className="card box-list">
              <TaskList
                tasks={tasks}
                onReorder={reorderTasks}
                onToggleDone={toggleDone}
                onDelete={deleteTask}
                onEdit={editTask}
              />
            </section>
          </>
        </main>
      </div>

      <FAB onClick={openAddModal} />
      <TaskFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSubmit={onSubmitTask}
        initial={editingTask ? {
          title: editingTask.title,
          notes: editingTask.notes,
          priority: editingTask.priority
        } : null}
      />
    </div>
  );
}

export default App;
