import { render, screen } from '@testing-library/react';
import App from './App';

test('renders recipe examples heading', () => {
  render(<App />);
  const title = screen.getByText(/Recipe Examples/i);
  expect(title).toBeInTheDocument();
});
