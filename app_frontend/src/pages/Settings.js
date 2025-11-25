import React, { useEffect } from 'react';
import { Theme, setCSSVariables } from '../theme';

/**
 * PUBLIC_INTERFACE
 * Settings page
 * - Dedicated location for user settings and preferences.
 * - Follows Ocean Professional theme and the app's clean, minimal, modern style.
 * - Includes placeholders for future settings (toggles and inputs).
 */
export default function Settings() {
  useEffect(() => {
    // Ensure theme variables are applied if this is routed standalone
    setCSSVariables();
    document.body.style.background = Theme.colors.background;
    // Maintain tab title consistency on direct navigation to /settings
    document.title = 'maestro';
  }, []);

  const onSave = (e) => {
    e.preventDefault();
    alert('Settings saved (placeholder).');
  };

  return (
    <div className="card">
      <div className="category-header box-header">
        <div className="category-title">
          <span className="category-icon" aria-hidden>⚙️</span>
          <div>
            <h2>Settings</h2>
            <p className="muted">Configure your maestro preferences</p>
          </div>
        </div>
        <div className="hero-actions" aria-hidden />
      </div>

      <div className="hero">
        <div className="hero-inner">
          <div className="hero-icon" aria-hidden>🌊</div>
          <div className="hero-text">
            <h3 className="hero-title">Personalize your experience</h3>
            <p className="hero-subtitle">
              Adjust app preferences like theme, notifications, and defaults. These are placeholders; functionality will be wired in a future update.
            </p>
          </div>
          <div className="hero-actions" aria-hidden />
        </div>
      </div>

      <form className="lists" onSubmit={onSave}>
        <div className="list">
          <h3>Appearance</h3>
          <div className="box-list" style={{ paddingTop: 0 }}>
            <div className="task-item" role="group" aria-labelledby="appearance-theme">
              <div className="task-left">
                <div className="task-content">
                  <div className="task-title" id="appearance-theme">
                    <span style={{ fontWeight: 600 }}>Theme</span>
                  </div>
                  <div className="task-notes">Choose the theme for the app interface</div>
                </div>
              </div>
              <div className="task-actions" style={{ gap: 10 }}>
                <label className="field" style={{ margin: 0, minWidth: 180 }}>
                  <span style={{ display: 'none' }}>Theme</span>
                  <select
                    defaultValue="light"
                    style={{
                      borderRadius: 10,
                      border: '1px solid var(--color-border)',
                      padding: '10px 12px',
                      background: 'var(--color-surface)',
                    }}
                    aria-label="Theme"
                  >
                    <option value="light">Light (Ocean Professional)</option>
                    <option value="dark" disabled>
                      Dark (coming soon)
                    </option>
                    <option value="system" disabled>
                      System (coming soon)
                    </option>
                  </select>
                </label>
              </div>
            </div>

            <div className="task-item" role="group" aria-labelledby="appearance-density">
              <div className="task-left">
                <div className="task-content">
                  <div className="task-title" id="appearance-density">
                    <span style={{ fontWeight: 600 }}>Density</span>
                  </div>
                  <div className="task-notes">Control spacing in lists and controls</div>
                </div>
              </div>
              <div className="task-actions" style={{ gap: 10 }}>
                <label>
                  <input type="radio" name="density" defaultChecked /> Comfortable
                </label>
                <label>
                  <input type="radio" name="density" /> Compact
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="list">
          <h3>Notifications</h3>
          <div className="box-list" style={{ paddingTop: 0 }}>
            <div className="task-item" role="group" aria-labelledby="notif-due">
              <div className="task-left">
                <div className="task-content">
                  <div className="task-title" id="notif-due">
                    <span style={{ fontWeight: 600 }}>Task reminders</span>
                  </div>
                  <div className="task-notes">Receive reminders for upcoming cooking</div>
                </div>
              </div>
              <div className="task-actions">
                <label className="switch">
                  <input type="checkbox" defaultChecked aria-label="Enable task reminders" />
                </label>
              </div>
            </div>

            <div className="task-item" role="group" aria-labelledby="notif-news">
              <div className="task-left">
                <div className="task-content">
                  <div className="task-title" id="notif-news">
                    <span style={{ fontWeight: 600 }}>Product updates</span>
                  </div>
                  <div className="task-notes">Get notified about new features and tips</div>
                </div>
              </div>
              <div className="task-actions">
                <label className="switch">
                  <input type="checkbox" aria-label="Enable product updates" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="list">
          <h3>Defaults</h3>
          <div className="box-list" style={{ paddingTop: 0 }}>
            <div className="task-item" role="group" aria-labelledby="default-priority">
              <div className="task-left">
                <div className="task-content">
                  <div className="task-title" id="default-priority">
                    <span style={{ fontWeight: 600 }}>Default task priority</span>
                  </div>
                  <div className="task-notes">Set the default priority for new tasks</div>
                </div>
              </div>
              <div className="task-actions">
                <label className="field" style={{ margin: 0, minWidth: 180 }}>
                  <span style={{ display: 'none' }}>Default task priority</span>
                  <select
                    defaultValue="medium"
                    style={{
                      borderRadius: 10,
                      border: '1px solid var(--color-border)',
                      padding: '10px 12px',
                      background: 'var(--color-surface)',
                    }}
                    aria-label="Default task priority"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="category-header" style={{ paddingTop: 0 }}>
          <div aria-hidden />
          <div className="hero-actions">
            <button type="button" className="btn">Reset</button>
            <button type="submit" className="btn primary">Save Changes</button>
          </div>
        </div>
      </form>
    </div>
  );
}
