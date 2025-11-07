import React, { useEffect } from 'react';
import './App.css';
import './index.css';
import { Theme, setCSSVariables } from './theme';

// Simple placeholder image component
function PlaceholderImage({ label }) {
  return (
    <div className="placeholder-image" aria-hidden>
      <div className="dot tl" />
      <div className="dot tr" />
      <div className="dot bl" />
      <div className="dot br" />
      <span>{label}</span>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  // Apply Ocean Professional variables and set page title
  useEffect(() => {
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    document.title = 'Recipe Examples';
  }, []);

  const recipes = [
    {
      id: 'r1',
      name: 'Lemon Herb Chicken',
      desc: 'Juicy chicken breasts marinated with fresh lemon, garlic, and herbs.',
      imgLabel: 'Chicken'
    },
    {
      id: 'r2',
      name: 'Creamy Tomato Pasta',
      desc: 'Al dente pasta tossed in a silky tomato and cream sauce.',
      imgLabel: 'Pasta'
    },
    {
      id: 'r3',
      name: 'Garden Salad Bowl',
      desc: 'Crisp greens with cucumber, cherry tomatoes, and a zesty vinaigrette.',
      imgLabel: 'Salad'
    },
    {
      id: 'r4',
      name: 'Blueberry Oat Parfait',
      desc: 'Layers of yogurt, oats, and blueberries for a fresh start.',
      imgLabel: 'Parfait'
    }
  ];

  return (
    <div className="ocean-app">
      <div className="gradient-bg" />
      <header className="app-header" aria-label="App header">
        <div className="brand">
          <span className="brand-logo" aria-hidden>🍽️</span>
          <div className="brand-text">
            <h1>Recipe Examples</h1>
            <p className="subtitle">Simple ideas in an Ocean Professional style</p>
          </div>
        </div>
      </header>

      <main className="home-main">
        <section className="hero card">
          <div className="hero-text">
            <h2 className="hero-title">Discover easy, tasty dishes</h2>
            <p className="hero-subtitle">A clean, minimal gallery with blue & amber accents.</p>
          </div>
        </section>

        <section className="recipe-grid">
          {recipes.map(r => (
            <article className="recipe-card card" key={r.id}>
              <PlaceholderImage label={r.imgLabel} />
              <div className="recipe-body">
                <h3 className="recipe-title">{r.name}</h3>
                <p className="recipe-desc">{r.desc}</p>
              </div>
              <div className="recipe-actions">
                <button className="btn ghost" type="button" aria-label={`View ${r.name}`}>Preview</button>
                <button className="btn primary" type="button" aria-label={`Save ${r.name}`}>Save</button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
