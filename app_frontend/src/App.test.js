import { render } from '@testing-library/react';
import App from './App';

test('renders app with top navigation bar', () => {
  const { container } = render(<App />);
  // Ensure header exists with bonito title (lowercase)
  const header = container.querySelector('header.app-header');
  expect(header).toBeTruthy();
  expect(container.textContent.toLowerCase()).toContain('bonito');
});
