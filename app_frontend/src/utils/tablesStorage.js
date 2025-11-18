const RESERVATIONS_STORAGE_KEY = 'cooking_reservations_state_v1';

/**
 * PUBLIC_INTERFACE
 * Load reservations state from localStorage.
 * Structure:
 * {
 *   reservations: [{ id, name }],
 *   selectedReservationId: string,
 *   reservationLists: { [reservationId]: { prep: Task[], cook: Task[], serve: Task[] } }
 * }
 */
export function loadReservationsState() {
  try {
    // Attempt migration from legacy tables key if present
    const legacyRaw = localStorage.getItem('cooking_tables_state_v1');
    const newRaw = localStorage.getItem(RESERVATIONS_STORAGE_KEY);

    if (newRaw) {
      return JSON.parse(newRaw);
    }

    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      // Map legacy structure to new structure
      const migrated = {
        reservations: legacy.tables || [{ id: 'default', name: 'My Reservation' }],
        selectedReservationId: legacy.selectedTableId || 'default',
        reservationLists: legacy.tableLists || { default: { prep: [], cook: [], serve: [] } },
      };
      try {
        localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(migrated));
      } catch {
        // ignore storage errors
      }
      return migrated;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * PUBLIC_INTERFACE
 * Persist reservations state to localStorage.
 */
export function saveReservationsState(state) {
  try {
    localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}
