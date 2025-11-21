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

/**
 * Define recipe sections for navigation (removed "All Items" and removed "serving")
 * Added new "Providers" section so users can access provider-related recipe options.
 */
const RECIPE_SECTIONS = [
  { key: 'ingredients', label: 'Ingredients', icon: '🧺' },
  { key: 'prep', label: 'Prep', icon: '🔪' },
  { key: 'cooking', label: 'Cooking', icon: '🍳' },
  { key: 'providers', label: 'Providers', icon: '🏷️' },
];

// Map for header icon per section
const SECTION_ICON = {
  ingredients: '🧺',
  prep: '🔪',
  cooking: '🍳',
  providers: '🏷️',
};

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
  // Set default section to a specific category (no "all")
  const [section, setSection] = useState('ingredients');

  // Apply theme on mount
  useEffect(() => {
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    document.title = 'ChefMaster';
  }, []);

  // Initialize from storage (single list). If none found, start with sample ingredients.
  useEffect(() => {
    const legacy = loadState();
    if (legacy && legacy.lists) {
      const combined = [
        ...(Array.isArray(legacy.lists.prep) ? legacy.lists.prep : []),
        ...(Array.isArray(legacy.lists.cook) ? legacy.lists.cook : []),
        // intentionally omitting legacy.lists.serve since "serving" is no longer supported
        ...(Array.isArray(legacy.lists.list) ? legacy.lists.list : []),
      ];
      // Strip any lingering 'serving' tasks from legacy data
      const sanitized = combined.filter(t => t.section !== 'serving');
      setTasksState(sanitized);
    } else {
      // No prior data: seed with clearly labeled sample ingredients in the Ingredients section
      const now = Date.now();
      const sample = [
        { id: `${now}_ing1`, title: 'Sample: Tomatoes (2)', notes: 'For salad • Ingredients', done: false, createdAt: now, priority: 'medium', section: 'ingredients' },
        { id: `${now}_ing2`, title: 'Sample: Olive oil', notes: 'Extra virgin • Ingredients', done: false, createdAt: now + 1, priority: 'low', section: 'ingredients' },
        { id: `${now}_ing3`, title: 'Sample: Garlic (3 cloves)', notes: 'Minced • Ingredients', done: false, createdAt: now + 2, priority: 'high', section: 'ingredients' },
      ];
      setTasksState(sample);
      // persist immediately so refresh keeps state
      saveState({ lists: { list: sample } });
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
    // Always use a real category (and never 'serving' which no longer exists)
    newTask.section = section || 'ingredients';
    setTasksState(prev => [newTask, ...prev]);
    setModalOpen(false);
  };

  // PUBLIC_INTERFACE
  const updateTask = (payload) => {
    // Ensure section cannot be changed to 'serving' via editing payloads
    const sanitizedPayload = { ...payload };
    if (sanitizedPayload.section === 'serving') {
      delete sanitizedPayload.section;
    }
    setTasksState(prev =>
      prev.map(t => (t.id === editingTask.id ? { ...t, ...sanitizedPayload } : t))
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
    // prevent editing tasks that might still have a 'serving' section from old data
    if (task.section === 'serving') return;
    setEditingTask(task);
    setModalOpen(true);
  };

  // PUBLIC_INTERFACE
  const reorderTasks = (startIndex, endIndex) => {
    setTasksState(prev => reorder(prev, startIndex, endIndex));
  };

  // Derive filtered tasks for current section (no "all" and exclude 'serving')
  const tasks = useMemo(() => {
    return tasksState
      .filter(t => t.section !== 'serving')
      .filter(t => (t.section || 'ingredients') === section);
  }, [tasksState, section]);

  // Compute counts for sidebar badges (exclude 'serving')
  const categoriesWithCounts = useMemo(() => {
    return RECIPE_SECTIONS.map(s => {
      const count = tasksState
        .filter(t => t.section !== 'serving')
        .filter(t => (t.section || 'ingredients') === s.key).length;
      return { ...s, count };
    });
  }, [tasksState]);

  // PUBLIC_INTERFACE
  const navigateToSection = (key) => {
    setSection(key);
  };

  const activeCount = tasks.filter(t => !t.done).length;

  const activeMeta = RECIPE_SECTIONS.find(s => s.key === section);
  const activeLabel = activeMeta?.label || 'Recipes';
  const activeIcon = SECTION_ICON[section] || '📋';

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
                <span className="category-icon" aria-hidden>{activeIcon}</span>
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
