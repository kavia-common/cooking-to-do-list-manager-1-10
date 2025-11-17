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
import { loadTablesState, saveTablesState } from './utils/tablesStorage';
import { loadState, saveState } from './utils/storage';
import TablesManager from './components/Tables/TablesManager';
import RecipesView from './components/Recipes/RecipesView';

// Helpers
const createTable = (name) => ({
  id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  name
});

// PUBLIC_INTERFACE
function App() {
  /**
   * App state:
   * - themeMode
   * - drawer (categories/recipes)
   * - currentSection: category id | 'recipes'
   * - tables: [{id, name}]
   * - selectedTableId: string
   * - tableLists: {[tableId]: {prep:[], cook:[], serve:[]}}
   * - task modal + edit
   */
  const [themeMode] = useState('light');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(DEFAULT_CATEGORIES[0].id);

  const [tables, setTables] = useState([{ id: 'default', name: 'My Table' }]);
  const [selectedTableId, setSelectedTableId] = useState('default');
  const [tableLists, setTableLists] = useState({ default: DEFAULT_LISTS });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Apply theme on mount
  useEffect(() => {
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    document.title = 'Cooking To-Do';
  }, []);

  // Migrate legacy single-list storage into default table if present
  useEffect(() => {
    const tablesState = loadTablesState();
    if (tablesState && tablesState.tables && tablesState.selectedTableId && tablesState.tableLists) {
      setTables(tablesState.tables);
      setSelectedTableId(tablesState.selectedTableId);
      setTableLists(tablesState.tableLists);
    } else {
      // legacy support
      const legacy = loadState();
      if (legacy && legacy.lists) {
        setTableLists({ default: legacy.lists });
      }
    }
    // also restore last category if legacy stored
    const legacy = loadState();
    if (legacy?.currentCategory) {
      setCurrentSection(legacy.currentCategory);
    }
  }, []);

  // Persist tables state
  useEffect(() => {
    saveTablesState({ tables, selectedTableId, tableLists });
    // keep backward compatibility for currentCategory to avoid breaking previous storage-based tests
    const currentCategory =
      currentSection === 'recipes' ? (DEFAULT_CATEGORIES[0]?.id || 'prep') : currentSection;
    const lists = tableLists[selectedTableId] || DEFAULT_LISTS;
    saveState({ lists, currentCategory });
  }, [tables, selectedTableId, tableLists, currentSection]);

  const isRecipes = currentSection === 'recipes';
  const currentCategory = isRecipes ? (DEFAULT_CATEGORIES[0]?.id || 'prep') : currentSection;

  const lists = useMemo(() => tableLists[selectedTableId] || DEFAULT_LISTS, [tableLists, selectedTableId]);
  const tasks = useMemo(() => lists[currentCategory] || [], [lists, currentCategory]);

  // PUBLIC_INTERFACE
  const openAddModal = () => {
    if (isRecipes) return;
    setEditingTask(null);
    setModalOpen(true);
  };

  // PUBLIC_INTERFACE
  const onSelectSection = (id) => {
    setCurrentSection(id);
  };

  // PUBLIC_INTERFACE
  const addTask = (payload) => {
    const newTask = createTask(payload.title, payload.notes, payload.priority);
    setTableLists(prev => {
      const curr = prev[selectedTableId] || DEFAULT_LISTS;
      return {
        ...prev,
        [selectedTableId]: {
          ...curr,
          [currentCategory]: [newTask, ...(curr[currentCategory] || [])]
        }
      };
    });
    setModalOpen(false);
  };

  // PUBLIC_INTERFACE
  const updateTask = (payload) => {
    setTableLists(prev => {
      const curr = prev[selectedTableId] || DEFAULT_LISTS;
      return {
        ...prev,
        [selectedTableId]: {
          ...curr,
          [currentCategory]: curr[currentCategory].map(t =>
            t.id === editingTask.id ? { ...t, ...payload } : t
          )
        }
      };
    });
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
    setTableLists(prev => {
      const curr = prev[selectedTableId] || DEFAULT_LISTS;
      return {
        ...prev,
        [selectedTableId]: {
          ...curr,
          [currentCategory]: curr[currentCategory].map(t =>
            t.id === id ? { ...t, done: !t.done } : t
          )
        }
      };
    });
  };

  // PUBLIC_INTERFACE
  const deleteTask = (id) => {
    setTableLists(prev => {
      const curr = prev[selectedTableId] || DEFAULT_LISTS;
      return {
        ...prev,
        [selectedTableId]: {
          ...curr,
          [currentCategory]: curr[currentCategory].filter(t => t.id !== id)
        }
      };
    });
  };

  // PUBLIC_INTERFACE
  const editTask = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  // PUBLIC_INTERFACE
  const reorderTasks = (startIndex, endIndex) => {
    setTableLists(prev => {
      const curr = prev[selectedTableId] || DEFAULT_LISTS;
      return {
        ...prev,
        [selectedTableId]: {
          ...curr,
          [currentCategory]: reorder(curr[currentCategory], startIndex, endIndex)
        }
      };
    });
  };

  // Tables CRUD
  // PUBLIC_INTERFACE
  const handleCreateTable = (name) => {
    const t = createTable(name);
    setTables(prev => [t, ...prev]);
    setTableLists(prev => ({ ...prev, [t.id]: { ...DEFAULT_LISTS } }));
    setSelectedTableId(t.id);
  };

  // PUBLIC_INTERFACE
  const handleRenameTable = (id, name) => {
    setTables(prev => prev.map(t => (t.id === id ? { ...t, name } : t)));
  };

  // PUBLIC_INTERFACE
  const handleDeleteTable = (id) => {
    // Prevent deleting last table
    setTables(prev => {
      if (prev.length <= 1) return prev;
      const nextTables = prev.filter(t => t.id !== id);
      // adjust selection if deleting current
      if (id === selectedTableId) {
        const fallback = nextTables[0]?.id;
        if (fallback) setSelectedTableId(fallback);
      }
      // also remove lists bucket
      setTableLists(prevLists => {
        const n = { ...prevLists };
        delete n[id];
        return n;
      });
      return nextTables;
    });
  };

  // PUBLIC_INTERFACE
  const handleSelectTable = (id) => {
    setSelectedTableId(id);
  };

  return (
    <div className="ocean-app" data-theme={themeMode}>
      {/* Subtle gradient header background */}
      <div className="gradient-bg" />
      <Header />

      {/* Quick tables bar (mobile-friendly) */}
      <div className="tables-strip">
        <div className="tables-toolbar">
          {tables.map(t => (
            <button
              key={t.id}
              className={['tables-chip', t.id === selectedTableId ? 'active' : ''].join(' ')}
              onClick={() => handleSelectTable(t.id)}
              type="button"
              title={`Switch to ${t.name}`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="content">
        {/* Tables manager sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <TablesManager
            tables={tables}
            selectedId={selectedTableId}
            onSelect={handleSelectTable}
            onCreate={handleCreateTable}
            onRename={handleRenameTable}
            onDelete={handleDeleteTable}
          />
          <NavigationDrawer
            open={drawerOpen}
            current={currentSection}
            onSelect={onSelectSection}
            onToggle={setDrawerOpen}
          />
        </div>

        <main className="main">
          {isRecipes ? (
            <RecipesView />
          ) : (
            <>
              <section className="category-header card">
                <div className="category-title">
                  <span className="category-icon" aria-hidden>
                    {DEFAULT_CATEGORIES.find(c => c.id === currentCategory)?.icon}
                  </span>
                  <div>
                    <h2>{DEFAULT_CATEGORIES.find(c => c.id === currentCategory)?.name}</h2>
                    <p className="muted">
                      {tasks.filter(t => !t.done).length} active • {tasks.length} total
                    </p>
                    <p className="muted" style={{ marginTop: 6 }}>
                      Table: <strong>{(tables.find(t => t.id === selectedTableId) || {}).name}</strong>
                    </p>
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
            </>
          )}
        </main>
      </div>

      {!isRecipes && <FAB onClick={openAddModal} />}
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
