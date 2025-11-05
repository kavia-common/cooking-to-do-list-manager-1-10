//
// Ocean Professional Theme variables and helpers
//

// PUBLIC_INTERFACE
export const Theme = {
  name: 'Ocean Professional',
  colors: {
    primary: '#2563EB',    // Blue
    secondary: '#F59E0B',  // Amber
    error: '#EF4444',
    surface: '#ffffff',
    background: '#f9fafb',
    text: '#111827',
    muted: '#6B7280',
    border: '#E5E7EB',
    overlay: 'rgba(0,0,0,0.4)',
    shadow: 'rgba(2,6,23,0.08)',
  }
};

// PUBLIC_INTERFACE
export const setCSSVariables = (root = document.documentElement) => {
  const c = Theme.colors;
  root.style.setProperty('--color-primary', c.primary);
  root.style.setProperty('--color-secondary', c.secondary);
  root.style.setProperty('--color-error', c.error);
  root.style.setProperty('--color-surface', c.surface);
  root.style.setProperty('--color-background', c.background);
  root.style.setProperty('--color-text', c.text);
  root.style.setProperty('--color-muted', c.muted);
  root.style.setProperty('--color-border', c.border);
  root.style.setProperty('--shadow-color', c.shadow);
};
