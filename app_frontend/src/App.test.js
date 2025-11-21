import { render } from '@testing-library/react';
import App from './App';

test('renders app with top navigation bar', () => {
  const { container } = render(<App />);
  // Ensure header exists with 'maestro' title
  const header = container.querySelector('header.app-header');
  expect(header).toBeTruthy();
  expect(container.textContent).toContain('maestro');
});
