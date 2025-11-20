import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import Header from './components/Header';
import TaskList from './components/TaskList';
import TaskFormModal from './components/TaskFormModal';
import FAB from './components/FAB';
import Sidebar from './components/Sidebar';
import { Theme, setCSSVariables } from './theme';
import { createTask, reorder } from './utils/types';
import { loadState, saveState } from './utils/storage';

// Define recipe sections for navigation
const RECIPE_SECTIONS = [
  { key: 'all', label: 'All Items', icon: '📋' },
  { key: 'ingredients', label: 'Ingredients', icon: '🧺' },
  { key: 'prep', label: 'Prep', icon: '🔪' },
  { key: 'cooking', label: 'Cooking', icon: '🍳' },
  { key: 'serving', label: 'Serving', icon: '🍽️' },
];

// PUBLIC_INTERFACE
function App() {
  /**
   * App state:
   * - themeMode
   * - tasks list
   * - selected recipe section
   * - task modal + edit
   */
  const [themeMode] = useState('light');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [tasksState, setTasksState] = useState([]);
  const [section, setSection] = useState('all');

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

  // PUBLIC_INTERFACE
  const openAddModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  // PUBLIC_INTERFACE
  const addTask = (payload) => {
    // Persist the selected section inside the task for filtering
    const newTask = createTask(payload.title, payload.notes, payload.priority);
    newTask.section = section === 'all' ? 'ingredients' : section; // default into a real bucket if 'all'
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

  // Derive filtered tasks for current section
  const tasks = useMemo(() => {
    if (section === 'all') return tasksState;
    return tasksState.filter(t => (t.section || 'ingredients') === section);
  }, [tasksState, section]);

  // Compute counts for sidebar badges
  const categoriesWithCounts = useMemo(() => {
    return RECIPE_SECTIONS.map(s => {
      const count = s.key === 'all'
        ? tasksState.length
        : tasksState.filter(t => (t.section || 'ingredients') === s.key).length;
      return { ...s, count };
    });
  }, [tasksState]);

  // PUBLIC_INTERFACE
  const navigateToSection = (key) => {
    setSection(key);
  };

  const activeCount = tasks.filter(t => !t.done).length;

  const activeLabel = RECIPE_SECTIONS.find(s => s.key === section)?.label || 'Recipes';

  return (
    <div className="ocean-app" data-theme={themeMode}>
      {/* Subtle gradient header background */}
      <div className="gradient-bg" />
      <Header />

      <div className="content">
        <Sidebar
          categories={categoriesWithCounts}
          current={section}
          onSelect={navigateToSection}
        />

        <main className="main">
          <>
            {/* Header for current list context and quick add */}
            <section className="category-header card box-header">
              <div className="category-title">
                <span className="category-icon" aria-hidden>📋</span>
                <div>
                  <h2>{activeLabel}</h2>
                  <p className="muted">
                    {activeCount} active • {tasks.length} total
                  </p>
                </div>
              </div>
              <div className="category-actions">
                <button className="btn primary" onClick={openAddModal}>Add Item</button>
              </div>
            </section>

            {/* Filtered list view with DnD support */}
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
