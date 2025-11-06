import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Recipes section that displays a grid of recipe cards with their ingredients and steps.
 * Note: The 'ingredients' app category has been removed; this section is informational only.
 * Props:
 * - recipes: Array<{ title: string, ingredients: string[], steps: string[] }>
 */
export default function Recipes({ recipes = [] }) {
  return (
    <section className="recipes card" aria-label="Recipes">
      <div className="recipes-header">
        <div className="recipes-title">
          <span className="recipes-icon" aria-hidden>📖</span>
          <div>
            <h2>Recipes</h2>
            <p className="muted">{recipes.length} curated</p>
          </div>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="empty">
          <p>No recipes available.</p>
        </div>
      ) : (
        <div className="recipes-grid">
          {recipes.map((r, idx) => (
            <article className="recipe-card" key={`${r.title}-${idx}`}>
              <header className="recipe-card__header">
                <h3 className="recipe-title">{r.title}</h3>
                <div className="recipe-badge">Easy</div>
              </header>

              <div className="recipe-body">
                <div className="recipe-section">
                  <h4>Ingredients</h4>
                  <ul className="ingredients">
                    {r.ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>
                <div className="recipe-section">
                  <h4>Steps</h4>
                  <ol className="steps">
                    {r.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <footer className="recipe-footer">
                <button className="btn ghost" type="button" aria-label={`View ${r.title}`}>View</button>
                <button className="btn primary" type="button" aria-label={`Cook ${r.title}`}>Cook</button>
              </footer>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
