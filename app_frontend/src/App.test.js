import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Chef Master heading', () => {
  render(<App />);
  const title = screen.getByText(/Chef Master/i);
  expect(title).toBeInTheDocument();
});
