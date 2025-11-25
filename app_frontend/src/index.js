import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Settings from './pages/Settings';

import Serving from './pages/Serving';
import Dashboard from './pages/Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Mount the application with client-side routing for App, Recipes/Ingredients via prop, dedicated Cooking, and Settings.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<App initialSection="dashboard" />} />
        <Route path="/recipes" element={<App initialSection="recipes" />} />
        <Route path="/ingredients" element={<App initialSection="ingredients" />} />


        <Route path="/serving" element={<Serving />} />
        <Route path="/tables" element={<Serving />} />
        <Route path="/seat-assignments" element={<Serving />} />
        <Route
          path="/settings"
          element={
            <div className="ocean-app" data-theme="light" style={{ minHeight: '100%' }}>
              <div className="gradient-bg" />
              <header className="app-header" aria-label="Top navigation">
                <nav className="brand" aria-label="Primary">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <span className="brand-logo" aria-hidden>🍲</span>
                    <div className="brand-text">
                      <h1>chef master</h1>
                      <p className="subtitle">Plan, prep, and cook</p>
                    </div>
                  </div>
                  <div aria-hidden style={{ width: 24, height: 24 }} />
                </nav>
              </header>
              <section className="content" aria-label="Settings shell">
                <aside className="sidebar card" aria-label="Navigation">
                  <div className="sidebar-header">
                    <span className="sidebar-icon" aria-hidden>🧭</span>
                    <div className="sidebar-title">
                      <h3>Navigate</h3>
                      <p className="muted">Quick links</p>
                    </div>
                  </div>
                  <nav className="sidebar-nav">
                    <a className="nav-item" href="/">
                      <span className="nav-emoji" aria-hidden>🏠</span>
                      <span className="nav-text"><span className="nav-label">Home</span></span>
                    </a>

                    <a className="nav-item active" href="/settings" aria-current="page">
                      <span className="nav-emoji" aria-hidden>⚙️</span>
                      <span className="nav-text"><span className="nav-label">Settings</span></span>
                    </a>
                  </nav>
                </aside>
                <main className="main">
                  <Settings />
                </main>
              </section>
            </div>
          }
        />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
