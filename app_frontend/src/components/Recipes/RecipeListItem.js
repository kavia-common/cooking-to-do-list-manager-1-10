import React from 'react';

// PUBLIC_INTERFACE
export default function RecipeListItem({ recipe, onEdit, onDelete }) {
  return (
    <div className="task-item" style={{ alignItems: 'flex-start' }}>
      <div className="task-left" style={{ alignItems: 'flex-start' }}>
        <div className="task-content">
          <div className="task-title">
            <span aria-hidden>📄</span>
            <span style={{ fontWeight: 700 }}>{recipe.title}</span>
          </div>
          {recipe.description ? (
            <div className="task-notes">{recipe.description}</div>
          ) : null}
          <div className="task-notes">
            <strong>Ingredients:</strong>{' '}
            {recipe.ingredients?.length ? recipe.ingredients.join(', ') : '—'}
          </div>
          <div className="task-notes">
            <strong>Steps:</strong>{' '}
            {recipe.steps?.length ? recipe.steps.join(' → ') : '—'}
          </div>
        </div>
      </div>
      <div className="task-actions">
        <button className="icon-btn" onClick={() => onEdit(recipe)} aria-label="Edit recipe">✎</button>
        <button className="icon-btn danger" onClick={() => onDelete(recipe.id)} aria-label="Delete recipe">🗑️</button>
      </div>
    </div>
  );
}
