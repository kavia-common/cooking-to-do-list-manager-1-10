import React, { useEffect, useMemo, useState } from 'react';
import { Theme, setCSSVariables } from '../theme';
import { getRestaurantLayoutConfig, getTableLabels } from '../utils/config';

/**
 * PUBLIC_INTERFACE
 * Tables page
 * - Displays an interactive restaurant table grid driven by configurable rows/columns.
 * - Allows selecting a table cell and mapping a simple assignment label to that table.
 * - All task-related UI and logic have been removed to focus purely on table assignments.
 */
export default function Serving() {
  useEffect(() => {
    // Ensure theme variables are applied if landing directly on this route
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    document.title = 'chef master';
  }, []);

  // Grid configuration (rows x cols)
  const { rows, cols } = getRestaurantLayoutConfig();
  const tableLabels = useMemo(() => getTableLabels(rows, cols), [rows, cols]);

  // Local in-memory assignments mapping: { tableIndex: string }
  const [assignments, setAssignments] = useState({});

  const [selectedTable, setSelectedTable] = useState(null);
  const [newAssignmentText, setNewAssignmentText] = useState('');

  // PUBLIC_INTERFACE
  const handleCellClick = (index) => {
    /**
     * Selects a table cell and primes the input with existing assignment text, if any.
     */
    setSelectedTable(index);
    setNewAssignmentText(assignments[index] || '');
  };

  // PUBLIC_INTERFACE
  const saveAssignment = () => {
    /**
     * Saves or updates the assignment for the selected table.
     * Empty value will clear the assignment.
     */
    if (selectedTable === null || selectedTable === undefined) return;
    setAssignments(prev => {
      const next = { ...prev };
      const value = newAssignmentText.trim();
      if (value) {
        next[selectedTable] = value;
      } else {
        delete next[selectedTable];
      }
      return next;
    });
  };

  // Responsive grid styles
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, minmax(80px, 1fr))`,
    gap: 12,
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="category-header box-header">
        <div className="category-title">
          <span className="category-icon" aria-hidden>🍽️</span>
          <div>
            <h2>Tables</h2>
            <p className="muted">Assign guests to tables in a clear, responsive grid</p>
          </div>
        </div>
        <div className="hero-actions" aria-hidden />
      </div>

      {/* Hero with quick summary */}
      <div className="hero">
        <div className="hero-inner" style={{ rowGap: 10 }}>
          <div className="hero-icon" aria-hidden>🌊</div>
          <div className="hero-text">
            <h3 className="hero-title">Visual table layout</h3>
            <p className="hero-subtitle">
              The grid below uses your configured layout of {rows} row{rows !== 1 ? 's' : ''} × {cols} column{cols !== 1 ? 's' : ''}.
              Click a table to add or update its assignment label.
            </p>
          </div>
          <div className="hero-actions" aria-hidden />
        </div>
      </div>

      {/* Table Grid */}
      <div className="lists">
        <div className="list">
          <div className="box-list" style={{ paddingTop: 0 }}>
            <div style={gridStyle} role="grid" aria-label="Restaurant tables grid">
              {tableLabels.map((label, idx) => {
                const isSelected = selectedTable === idx;
                const assigned = assignments[idx];
                return (
                  <button
                    key={label}
                    role="gridcell"
                    className="btn"
                    onClick={() => handleCellClick(idx)}
                    aria-pressed={isSelected}
                    aria-label={`${label}${assigned ? ` assigned to ${assigned}` : ''}`}
                    style={{
                      // Minimal, modern tile appearance consistent with theme
                      height: 88,
                      borderRadius: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: isSelected ? '1px solid transparent' : '1px solid var(--color-border)',
                      background: isSelected
                        ? 'linear-gradient(135deg, #2563EB, #1D4ED8)'
                        : 'var(--color-surface)',
                      color: isSelected ? '#fff' : 'var(--color-text)',
                      boxShadow: '0 8px 18px var(--shadow-color)',
                      transition: 'transform .12s ease, background-color .2s ease, border-color .2s ease, box-shadow .2s ease',
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>{label}</div>
                    <div
                      className="muted"
                      style={{
                        marginTop: 4,
                        fontSize: 12,
                        color: isSelected ? 'rgba(255,255,255,0.82)' : 'var(--color-muted)',
                        maxWidth: '90%',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {assigned || 'Unassigned'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Assignment editor */}
            <div className="task-item" style={{ marginTop: 12 }} role="group" aria-labelledby="assignment-editor">
              <div className="task-left" style={{ alignItems: 'center' }}>
                <div className="task-content">
                  <div className="task-title" id="assignment-editor" style={{ gap: 8 }}>
                    <span style={{ fontWeight: 600 }}>Selected table</span>
                    <span className="nav-badge" aria-hidden>
                      {selectedTable !== null && selectedTable !== undefined ? tableLabels[selectedTable] : 'None'}
                    </span>
                  </div>
                  <div className="task-notes">
                    Click a table above to edit its assignment label (e.g., "Smith party", "VIP", or a server name").
                  </div>
                </div>
              </div>
              <div className="task-actions" style={{ gap: 8, alignItems: 'center' }}>
                <label className="field" style={{ margin: 0, minWidth: 220 }}>
                  <span style={{ display: 'none' }}>Assignment</span>
                  <input
                    disabled={selectedTable === null || selectedTable === undefined}
                    placeholder={selectedTable === null || selectedTable === undefined ? 'Select a table to edit' : 'Enter assignment'}
                    value={newAssignmentText}
                    onChange={(e) => setNewAssignmentText(e.target.value)}
                    aria-label="Assignment label"
                    style={{ width: 220 }}
                  />
                </label>
                <button
                  className="btn primary"
                  onClick={saveAssignment}
                  disabled={selectedTable === null || selectedTable === undefined}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
