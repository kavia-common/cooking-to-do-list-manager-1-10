import React from 'react';
import RecipeListItem from './RecipeListItem';

// PUBLIC_INTERFACE
export default function RecipeList({ recipes, onEdit, onDelete }) {
  return (
    <div className="task-list" style={{ paddingTop: 8 }}>
      {recipes.map(r => (
        <RecipeListItem key={r.id} recipe={r} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
