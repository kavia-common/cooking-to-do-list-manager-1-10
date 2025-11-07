import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Chef Assistant heading', () => {
  render(<App />);
  const title = screen.getByText(/Chef Assistant/i);
  expect(title).toBeInTheDocument();
});
