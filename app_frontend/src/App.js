import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import Header from './components/Header';
import TaskList from './components/TaskList';
import TaskFormModal from './components/TaskFormModal';
import FAB from './components/FAB';
import { Theme, setCSSVariables } from './theme';
import { DEFAULT_LISTS, createTask, reorder } from './utils/types';
import { loadReservationsState, saveReservationsState } from './utils/tablesStorage';
import { loadState, saveState } from './utils/storage';

import UnifiedSidebar from './components/UnifiedSidebar';

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
   * - drawer open/close
   * - reservations: [{id, name}]
   * - selectedReservationId: string
   * - reservationLists: {[reservationId]: {}}
   * - task modal + edit
   */
  const [themeMode] = useState('light');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [reservations, setReservations] = useState([{ id: 'default', name: 'My Reservation' }]);
  const [selectedReservationId, setSelectedReservationId] = useState('default');
  const [reservationLists, setReservationLists] = useState({ default: {} });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Apply theme on mount
  useEffect(() => {
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    document.title = 'cheftito';
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
      // Remove any lingering categories and flatten into a single uncategorized list
      const flattened = {};
      const newReservationLists = {};
      Object.keys(reservationsState.reservationLists).forEach(key => {
        const bucket = reservationsState.reservationLists[key] || {};
        // Combine any existing arrays into one unified list
        const combined = [
          ...(Array.isArray(bucket.prep) ? bucket.prep : []),
          ...(Array.isArray(bucket.cook) ? bucket.cook : []),
          ...(Array.isArray(bucket.serve) ? bucket.serve : []),
        ];
        flattened[key] = combined;
        newReservationLists[key] = {}; // keep empty object; tasks are tracked outside per-reservation bucket for UI
      });
      setReservations(reservationsState.reservations);
      setSelectedReservationId(reservationsState.selectedReservationId);
      // Keep per-reservation container but we will track tasks in a single list state derived below
      setReservationLists(newReservationLists);
      // Persist a legacy-compatible state (single list) in local storage
      const legacyLists = { list: flattened[reservationsState.selectedReservationId] || [] };
      saveState({ lists: legacyLists, currentCategory: undefined });
      // Store temp flattened tasks into a dedicated memory state
      setPerReservationTasks(flattened);
    } else {
      const legacy = loadState();
      if (legacy && legacy.lists) {
        const combined = [
          ...(Array.isArray(legacy.lists.prep) ? legacy.lists.prep : []),
          ...(Array.isArray(legacy.lists.cook) ? legacy.lists.cook : []),
          ...(Array.isArray(legacy.lists.serve) ? legacy.lists.serve : []),
          ...(Array.isArray(legacy.lists.list) ? legacy.lists.list : []),
        ];
        setPerReservationTasks({ default: combined });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Maintain a flat task list per reservation without categories
  const [perReservationTasks, setPerReservationTasks] = useState({ default: [] });

  // Persist reservations state
  useEffect(() => {
    // Persist reservations shell
    saveReservationsState({ reservations, selectedReservationId, reservationLists });
    // Backward compatible save of tasks in a single list
    const tasks = perReservationTasks[selectedReservationId] || [];
    saveState({ lists: { list: tasks } });
  }, [reservations, selectedReservationId, reservationLists, perReservationTasks]);

  const tasks = useMemo(
    () => perReservationTasks[selectedReservationId] || [],
    [perReservationTasks, selectedReservationId]
  );

  // PUBLIC_INTERFACE
  const openAddModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  // PUBLIC_INTERFACE
  const addTask = (payload) => {
    const newTask = createTask(payload.title, payload.notes, payload.priority);
    setPerReservationTasks(prev => {
      const curr = prev[selectedReservationId] || [];
      return { ...prev, [selectedReservationId]: [newTask, ...curr] };
    });
    setModalOpen(false);
  };

  // PUBLIC_INTERFACE
  const updateTask = (payload) => {
    setPerReservationTasks(prev => {
      const curr = prev[selectedReservationId] || [];
      return {
        ...prev,
        [selectedReservationId]: curr.map(t =>
          t.id === editingTask.id ? { ...t, ...payload } : t
        )
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
    setPerReservationTasks(prev => {
      const curr = prev[selectedReservationId] || [];
      return {
        ...prev,
        [selectedReservationId]: curr.map(t => (t.id === id ? { ...t, done: !t.done } : t))
      };
    });
  };

  // PUBLIC_INTERFACE
  const deleteTask = (id) => {
    setPerReservationTasks(prev => {
      const curr = prev[selectedReservationId] || [];
      return {
        ...prev,
        [selectedReservationId]: curr.filter(t => t.id !== id)
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
    setPerReservationTasks(prev => {
      const curr = prev[selectedReservationId] || [];
      return {
        ...prev,
        [selectedReservationId]: reorder(curr, startIndex, endIndex)
      };
    });
  };

  // Reservations CRUD
  // PUBLIC_INTERFACE
  const handleCreateReservation = (name) => {
    const r = createReservation(name);
    setReservations(prev => [r, ...prev]);
    setReservationLists(prev => ({ ...prev, [r.id]: {} }));
    setPerReservationTasks(prev => ({ ...prev, [r.id]: [] }));
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
      // also remove lists bucket and tasks
      setReservationLists(prevLists => {
        const n = { ...prevLists };
        delete n[id];
        return n;
      });
      setPerReservationTasks(prevTasks => {
        const n = { ...prevTasks };
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

      <div className="content">
        {/* Unified sidebar: reservations only (no categories) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <UnifiedSidebar
            open={drawerOpen}
            reservations={reservations}
            selectedReservationId={selectedReservationId}
            onSelectReservation={handleSelectReservation}
            onCreateReservation={handleCreateReservation}
            onRenameReservation={handleRenameReservation}
            onDeleteReservation={handleDeleteReservation}
            onToggle={setDrawerOpen}
          />
        </div>

        <main className="main">
          <>
            {/* Header for current reservation context and quick add */}
            <section className="category-header card">
              <div className="category-title">
                <span className="category-icon" aria-hidden>📋</span>
                <div>
                  <h2>Tasks</h2>
                  <p className="muted">
                    {tasks.filter(t => !t.done).length} active • {tasks.length} total
                  </p>
                </div>
              </div>
              <div className="category-actions">
                <button className="btn primary" onClick={openAddModal}>Add Task</button>
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
