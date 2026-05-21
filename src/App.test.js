import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Academia splash screen', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /academia/i })).toBeInTheDocument();
  expect(screen.getByText(/academic q&a/i)).toBeInTheDocument();
});
