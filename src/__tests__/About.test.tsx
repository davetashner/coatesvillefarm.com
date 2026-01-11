import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders About page content', () => {
  window.history.pushState({}, '', '/about');
  render(<App />);

  expect(screen.getByRole('heading', { name: /about us/i })).toBeInTheDocument();
  expect(
    screen.getByText(/Coatesville Farm is a family-run farm/i)
  ).toBeInTheDocument();
});
