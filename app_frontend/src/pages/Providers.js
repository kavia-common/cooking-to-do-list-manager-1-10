import React, { useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * Providers management page
 * - Displays a list of providers (mock/placeholder data).
 * - Includes future-ready action hooks for add/edit/remove.
 * - Styled with the Ocean Professional theme using existing CSS tokens.
 */
export default function Providers() {
  // Keep browser tab title consistent when landing directly on /providers
  if (typeof document !== 'undefined') {
    document.title = 'tester';
  }
  // Mock providers list
  const initialProviders = useMemo(
    () => ([
      { id: 'prov_1', name: 'FreshFarm Grocers', type: 'Groceries', contact: 'support@freshfarm.com', status: 'Active' },
      { id: 'prov_2', name: 'VeggieBox Co', type: 'Vegetables', contact: 'hello@veggiebox.example', status: 'Active' },
      { id: 'prov_3', name: 'SpiceWorld', type: 'Spices', contact: 'orders@spiceworld.example', status: 'Paused' },
      { id: 'prov_4', name: 'SeaWave Foods', type: 'Seafood', contact: 'contact@seawavefoods.example', status: 'Active' },
    ]),
    []
  );

  const [providers, setProviders] = useState(initialProviders);
  const [query, setQuery] = useState('');

  const filtered = providers.filter(p => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q) ||
      p.contact.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q)
    );
  });

  const onAdd = () => {
    alert('Add Provider (placeholder)');
    // Future: open a modal form to create a provider
  };

  const onEdit = (prov) => {
    alert(`Edit Provider (placeholder): ${prov.name}`);
    // Future: open a modal prefilled with provider details
  };

  const onRemove = (prov) => {
    if (!window.confirm(`Remove provider "${prov.name}"?`)) return;
    setProviders(prev => prev.filter(p => p.id !== prov.id));
  };

  return (
    <div className="card">
      <div className="category-header box-header">
        <div className="category-title">
          <span className="category-icon" aria-hidden>🤝</span>
          <div>
            <h2>Providers</h2>
            <p className="muted">Manage your suppliers and service providers</p>
          </div>
        </div>
        <div className="hero-actions">
          <button className="btn" onClick={() => setQuery('')}>Clear</button>
          <button className="btn primary" onClick={onAdd}>Add Provider</button>
        </div>
      </div>

      <div className="hero">
        <div className="hero-inner" style={{ rowGap: 10 }}>
          <div className="hero-icon" aria-hidden>🌊</div>
          <div className="hero-text">
            <h3 className="hero-title">Keep your kitchen network organized</h3>
            <p className="hero-subtitle">
              Store and manage providers for ingredients, tools, and services.
              Use search to quickly find a provider. Edit or remove as needed.
            </p>
          </div>
          <div className="hero-actions" style={{ minWidth: 220, flex: '0 0 260px' }}>
            <div className="field" style={{ margin: 0 }}>
              <span>Search providers</span>
              <input
                placeholder="Search by name, type, contact, or status"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search providers"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="lists">
        <div className="list">
          <h3>All Providers</h3>
          <div className="box-list" style={{ paddingTop: 0 }}>
            {filtered.length === 0 ? (
              <div className="empty">
                <p>No providers match your search.</p>
                <p className="muted" style={{ marginTop: 8, fontSize: 12 }}>
                  Try clearing the search or adding a new provider.
                </p>
              </div>
            ) : (
              <div className="task-list">
                {filtered.map((p) => (
                  <div key={p.id} className="task-item" role="row">
                    <div className="task-left" style={{ alignItems: 'center' }}>
                      <div className="task-content">
                        <div className="task-title" style={{ gap: 10 }}>
                          <span style={{ fontWeight: 700 }}>{p.name}</span>
                          <span
                            className="nav-badge"
                            style={{
                              background: 'rgba(17,24,39,0.06)',
                              color: 'var(--color-text)',
                              fontWeight: 600,
                            }}
                            aria-label={`Type: ${p.type}`}
                          >
                            {p.type}
                          </span>
                          <span
                            className="nav-badge"
                            style={{
                              background: p.status === 'Active' ? 'rgba(37,99,235,0.12)' : 'rgba(245,158,11,0.12)',
                              color: 'var(--color-text)',
                              fontWeight: 600,
                            }}
                            aria-label={`Status: ${p.status}`}
                          >
                            {p.status}
                          </span>
                        </div>
                        <div className="task-notes" style={{ marginTop: 2 }}>
                          {p.contact}
                        </div>
                      </div>
                    </div>
                    <div className="task-actions">
                      <button className="icon-btn" onClick={() => onEdit(p)} aria-label="Edit provider">✎</button>
                      <button className="icon-btn danger" onClick={() => onRemove(p)} aria-label="Remove provider">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
