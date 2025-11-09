import React, { useEffect, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * RecipeFormModal - modal for adding/editing a recipe.
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onSubmit: ({title, description, ingredients, steps}) => void
 * - initial: optional initial data
 */
export default function RecipeFormModal({ open, onClose, onSubmit, initial }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [ingredients, setIngredients] = useState((initial?.ingredients || []).join('\n'));
  const [steps, setSteps] = useState((initial?.steps || []).join('\n'));
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title || '');
      setDescription(initial?.description || '');
      setIngredients((initial?.ingredients || []).join('\n'));
      setSteps((initial?.steps || []).join('\n'));
      setTimeout(() => firstInputRef.current?.focus(), 0);
    }
  }, [open, initial]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    const ing = ingredients
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    const st = steps
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    onSubmit({
      title: trimmedTitle,
      description: description.trim(),
      ingredients: ing,
      steps: st,
    });
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <h3>{initial ? 'Edit Recipe' : 'Add Recipe'}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <form onSubmit={submit} className="modal-body">
          <label className="field">
            <span>Title</span>
            <input
              ref={firstInputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Lemon Garlic Chicken"
              required
            />
          </label>
          <label className="field">
            <span>Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
              rows={2}
            />
          </label>
          <label className="field">
            <span>Ingredients (one per line)</span>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="- 2 chicken breasts
- 2 cloves garlic
- 1 lemon"
              rows={5}
            />
          </label>
          <label className="field">
            <span>Steps (one per line)</span>
            <textarea
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="1. Marinate chicken
2. Sear on pan
3. Finish in oven"
              rows={5}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">{initial ? 'Save' : 'Add Recipe'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
