import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import Header from './components/Header';
import NavigationDrawer from './components/NavigationDrawer';
import TaskList from './components/TaskList';
import TaskFormModal from './components/TaskFormModal';
import FAB from './components/FAB';
import { Theme, setCSSVariables } from './theme';
import { DEFAULT_CATEGORIES, DEFAULT_LISTS, createTask, reorder } from './utils/types';
import { loadState, saveState } from './utils/storage';

// PUBLIC_INTERFACE
function App() {
  /** App state: theme, drawer, category, lists, modal */
  const [themeMode] = useState('light'); // reserved for future theme toggle
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(DEFAULT_CATEGORIES[0].id);
  const [lists, setLists] = useState(DEFAULT_LISTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Apply Ocean Professional CSS variables on mount
  useEffect(() => {
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    document.title = 'Cooking To-Do';
  }, []);

  // Load from storage on mount
  useEffect(() => {
    const loaded = loadState();
    if (loaded && loaded.lists) {
      // If a previously saved category no longer exists (e.g., cleanup removed), fallback to default
      const firstCategory = DEFAULT_CATEGORIES[0].id;
      const nextCategory = loaded.currentCategory && DEFAULT_CATEGORIES.some(c => c.id === loaded.currentCategory)
        ? loaded.currentCategory
        : firstCategory;

      // Ensure lists has an array for the selected category
      const ensuredLists = {
        ...loaded.lists,
        [nextCategory]: Array.isArray(loaded.lists[nextCategory]) ? loaded.lists[nextCategory] : []
      };

      setLists(ensuredLists);
      setCurrentCategory(nextCategory);
    }
  }, []);

  // Persist state
  useEffect(() => {
    saveState({ lists, currentCategory });
  }, [lists, currentCategory]);

  const tasks = useMemo(() => lists[currentCategory] || [], [lists, currentCategory]);

  // PUBLIC_INTERFACE
  const openAddModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  // PUBLIC_INTERFACE
  const onSelectCategory = (id) => {
    setCurrentCategory(id);
  };

  // PUBLIC_INTERFACE
  const addTask = (payload) => {
    const newTask = createTask(payload.title, payload.notes, payload.priority);
    setLists(prev => ({ ...prev, [currentCategory]: [newTask, ...(prev[currentCategory] || [])] }));
    setModalOpen(false);
  };

  // PUBLIC_INTERFACE
  const updateTask = (payload) => {
    setLists(prev => ({
      ...prev,
      [currentCategory]: prev[currentCategory].map(t =>
        t.id === editingTask.id ? { ...t, ...payload } : t
      ),
    }));
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
    setLists(prev => ({
      ...prev,
      [currentCategory]: prev[currentCategory].map(t => t.id === id ? { ...t, done: !t.done } : t),
    }));
  };

  // PUBLIC_INTERFACE
  const deleteTask = (id) => {
    setLists(prev => ({
      ...prev,
      [currentCategory]: prev[currentCategory].filter(t => t.id !== id),
    }));
  };

  // PUBLIC_INTERFACE
  const editTask = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  // PUBLIC_INTERFACE
  const reorderTasks = (startIndex, endIndex) => {
    setLists(prev => ({
      ...prev,
      [currentCategory]: reorder(prev[currentCategory], startIndex, endIndex),
    }));
  };

  return (
    <div className="ocean-app" data-theme={themeMode}>
      {/* Subtle gradient header background */}
      <div className="gradient-bg" />
      <Header />
      <div className="content">
        <NavigationDrawer
          open={drawerOpen}
          current={currentCategory}
          onSelect={onSelectCategory}
          onToggle={setDrawerOpen}
        />
        <main className="main">
          <section className="category-header card">
            <div className="category-title">
              <span className="category-icon" aria-hidden>
                {DEFAULT_CATEGORIES.find(c => c.id === currentCategory)?.icon}
              </span>
              <div>
                <h2>{DEFAULT_CATEGORIES.find(c => c.id === currentCategory)?.name}</h2>
                <p className="muted">{tasks.filter(t => !t.done).length} active • {tasks.length} total</p>
              </div>
            </div>
            <div className="category-actions">
              <button className="btn primary" onClick={openAddModal}>Add Task</button>
            </div>
          </section>

          <section className="lists">
            <div className="list card">
              <h3>Tasks</h3>
              <TaskList
                tasks={tasks}
                onReorder={reorderTasks}
                onToggleDone={toggleDone}
                onDelete={deleteTask}
                onEdit={editTask}
              />
            </div>
          </section>
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
