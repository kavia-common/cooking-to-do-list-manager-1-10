import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Floating Action Button for adding tasks.
 */
export default function FAB({ onClick }) {
  return (
    <button className="fab" onClick={onClick} aria-label="Add recipe" title="Add recipe">
      +
    </button>
  );
}
