//
// Simple configuration utility to provide app settings.
// Values can be extended to read from localStorage, backend, or environment.
// For now, uses sensible defaults with optional overrides via window.__APP_CONFIG__.
//
// PUBLIC_INTERFACE
export function getRestaurantLayoutConfig() {
  /**
   * Returns the configured number of rows and columns for the restaurant table grid.
   * - Attempts to read from window.__APP_CONFIG__ if present.
   * - Falls back to defaults if not provided.
   */
  const fromWindow =
    typeof window !== 'undefined' && window.__APP_CONFIG__ && window.__APP_CONFIG__.restaurantLayout
      ? window.__APP_CONFIG__.restaurantLayout
      : null;

  const rows = Number(fromWindow?.rows) > 0 ? Number(fromWindow.rows) : 4;
  const cols = Number(fromWindow?.cols) > 0 ? Number(fromWindow.cols) : 5;

  return { rows, cols };
}

// PUBLIC_INTERFACE
export function getTableLabels(rows, cols) {
  /**
   * Generates human-friendly labels for tables based on a grid position.
   * E.g., T-01, T-02 ... row-major order.
   */
  const total = rows * cols;
  return Array.from({ length: total }, (_, i) => `T-${String(i + 1).padStart(2, '0')}`);
}
