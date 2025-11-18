import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import Header from './components/Header';
import NavigationDrawer from './components/NavigationDrawer';
import TaskList from './components/TaskList';
import TaskFormModal from './components/TaskFormModal';
import FAB from './components/FAB';
import CategoryBoard from './components/CategoryBoard';
import { Theme, setCSSVariables } from './theme';
import { DEFAULT_CATEGORIES, DEFAULT_LISTS, createTask, reorder } from './utils/types';
import { loadReservationsState, saveReservationsState } from './utils/tablesStorage';
import { loadState, saveState } from './utils/storage';
import ReservationsManager from './components/Tables/TablesManager';
import RecipesView from './components/Recipes/RecipesView';

/** Helpers */
const createReservation = (name) => ({
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
   * - reservations: [{id, name}]
   * - selectedReservationId: string
   * - reservationLists: {[reservationId]: {prep:[], cook:[], serve:[]}}
   * - task modal + edit
   */
  const [themeMode] = useState('light');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(DEFAULT_CATEGORIES[0].id);

  const [reservations, setReservations] = useState([{ id: 'default', name: 'My Reservation' }]);
  const [selectedReservationId, setSelectedReservationId] = useState('default');
  const [reservationLists, setReservationLists] = useState({ default: DEFAULT_LISTS });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Apply theme on mount
  useEffect(() => {
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    document.title = 'Cooking To-Do';
  }, []);

  // Migrate legacy storage and initialize reservations
  useEffect(() => {
    const reservationsState = loadReservationsState();
    if (
      reservationsState &&
      reservationsState.reservations &&
      reservationsState.selectedReservationId &&
      reservationsState.reservationLists
    ) {
      setReservations(reservationsState.reservations);
      setSelectedReservationId(reservationsState.selectedReservationId);
      setReservationLists(reservationsState.reservationLists);
    } else {
      // legacy single-list support
      const legacy = loadState();
      if (legacy && legacy.lists) {
        setReservationLists({ default: legacy.lists });
      }
    }
    // also restore last category if legacy stored
    const legacy = loadState();
    if (legacy?.currentCategory) {
      setCurrentSection(legacy.currentCategory);
    }
  }, []);

  // Persist reservations state
  useEffect(() => {
    saveReservationsState({ reservations, selectedReservationId, reservationLists });
    // keep backward compatibility for currentCategory to avoid breaking previous storage-based tests
    const currentCategory =
      currentSection === 'recipes' ? (DEFAULT_CATEGORIES[0]?.id || 'prep') : currentSection;
    const lists = reservationLists[selectedReservationId] || DEFAULT_LISTS;
    saveState({ lists, currentCategory });
  }, [reservations, selectedReservationId, reservationLists, currentSection]);

  const isRecipes = currentSection === 'recipes';
  const currentCategory = isRecipes ? (DEFAULT_CATEGORIES[0]?.id || 'prep') : currentSection;

  const lists = useMemo(
    () => reservationLists[selectedReservationId] || DEFAULT_LISTS,
    [reservationLists, selectedReservationId]
  );
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
    setReservationLists(prev => {
      const curr = prev[selectedReservationId] || DEFAULT_LISTS;
      return {
        ...prev,
        [selectedReservationId]: {
          ...curr,
          [currentCategory]: [newTask, ...(curr[currentCategory] || [])]
        }
      };
    });
    setModalOpen(false);
  };

  // PUBLIC_INTERFACE
  const updateTask = (payload) => {
    setReservationLists(prev => {
      const curr = prev[selectedReservationId] || DEFAULT_LISTS;
      return {
        ...prev,
        [selectedReservationId]: {
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
    setReservationLists(prev => {
      const curr = prev[selectedReservationId] || DEFAULT_LISTS;
      return {
        ...prev,
        [selectedReservationId]: {
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
    setReservationLists(prev => {
      const curr = prev[selectedReservationId] || DEFAULT_LISTS;
      return {
        ...prev,
        [selectedReservationId]: {
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
    setReservationLists(prev => {
      const curr = prev[selectedReservationId] || DEFAULT_LISTS;
      return {
        ...prev,
        [selectedReservationId]: {
          ...curr,
          [currentCategory]: reorder(curr[currentCategory], startIndex, endIndex)
        }
      };
    });
  };

  // Reservations CRUD
  // PUBLIC_INTERFACE
  const handleCreateReservation = (name) => {
    const r = createReservation(name);
    setReservations(prev => [r, ...prev]);
    setReservationLists(prev => ({ ...prev, [r.id]: { ...DEFAULT_LISTS } }));
    setSelectedReservationId(r.id);
  };

  // PUBLIC_INTERFACE
  const handleRenameReservation = (id, name) => {
    setReservations(prev => prev.map(r => (r.id === id ? { ...r, name } : r)));
  };

  // PUBLIC_INTERFACE
  const handleDeleteReservation = (id) => {
    // Prevent deleting last reservation
    setReservations(prev => {
      if (prev.length <= 1) return prev;
      const nextReservations = prev.filter(r => r.id !== id);
      // adjust selection if deleting current
      if (id === selectedReservationId) {
        const fallback = nextReservations[0]?.id;
        if (fallback) setSelectedReservationId(fallback);
      }
      // also remove lists bucket
      setReservationLists(prevLists => {
        const n = { ...prevLists };
        delete n[id];
        return n;
      });
      return nextReservations;
    });
  };

  // PUBLIC_INTERFACE
  const handleSelectReservation = (id) => {
    setSelectedReservationId(id);
  };

  return (
    <div className="ocean-app" data-theme={themeMode}>
      {/* Subtle gradient header background */}
      <div className="gradient-bg" />
      <Header />

      {/* Quick reservations bar (mobile-friendly) */}
      <div className="reservations-strip">
        <div className="reservations-toolbar">
          {reservations.map(r => (
            <button
              key={r.id}
              className={['reservations-chip', r.id === selectedReservationId ? 'active' : ''].join(' ')}
              onClick={() => handleSelectReservation(r.id)}
              type="button"
              title={`Switch to ${r.name}`}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      <div className="content">
        {/* Reservations manager sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ReservationsManager
            reservations={reservations}
            selectedId={selectedReservationId}
            onSelect={handleSelectReservation}
            onCreate={handleCreateReservation}
            onRename={handleRenameReservation}
            onDelete={handleDeleteReservation}
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
              {/* Top header remains to show reservation context and quick add to current category */}
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
                      Reservation: <strong>{(reservations.find(r => r.id === selectedReservationId) || {}).name}</strong>
                    </p>
                  </div>
                </div>
                <div className="category-actions">
                  {/* Add task button adds to currentCategory to keep UX simple */}
                  <button className="btn primary" onClick={openAddModal}>Add Recipe</button>
                </div>
              </section>

              {/* Render all categories as distinct boxes with DnD support */}
              <CategoryBoard
                lists={lists}
                onReorder={(catId, start, end) => {
                  setReservationLists(prev => {
                    const curr = prev[selectedReservationId] || DEFAULT_LISTS;
                    return {
                      ...prev,
                      [selectedReservationId]: {
                        ...curr,
                        [catId]: reorder(curr[catId] || [], start, end)
                      }
                    };
                  });
                }}
                onToggleDone={(catId, taskId) => {
                  setReservationLists(prev => {
                    const curr = prev[selectedReservationId] || DEFAULT_LISTS;
                    return {
                      ...prev,
                      [selectedReservationId]: {
                        ...curr,
                        [catId]: (curr[catId] || []).map(t => t.id === taskId ? { ...t, done: !t.done } : t)
                      }
                    };
                  });
                }}
                onDelete={(catId, taskId) => {
                  setReservationLists(prev => {
                    const curr = prev[selectedReservationId] || DEFAULT_LISTS;
                    return {
                      ...prev,
                      [selectedReservationId]: {
                        ...curr,
                        [catId]: (curr[catId] || []).filter(t => t.id !== taskId)
                      }
                    };
                  });
                }}
                onEdit={(catId, task) => {
                  // Preserve original behavior: open modal using currentCategory context
                  setCurrentSection(catId);
                  setEditingTask(task);
                  setModalOpen(true);
                }}
              />
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
