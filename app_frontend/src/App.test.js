import { render, screen } from '@testing-library/react';
import App from './App';

test('renders minimal home screen', () => {
  render(<App />);
  expect(screen.getByText('Welcome')).toBeInTheDocument();
  expect(screen.getByText('A clean start. No distractions on the home screen.')).toBeInTheDocument();
});
