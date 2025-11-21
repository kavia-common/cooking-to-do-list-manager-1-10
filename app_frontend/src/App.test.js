import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ChefMaster header and Ingredients section by default', () => {
  render(<App />);
  expect(screen.getByText('ChefMaster')).toBeInTheDocument();
  // By default we land on Ingredients category header
  expect(screen.getByText('Ingredients')).toBeInTheDocument();
});
