import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Chef Agent heading', () => {
  render(<App />);
  const title = screen.getByText(/Chef Agent/i);
  expect(title).toBeInTheDocument();
});
