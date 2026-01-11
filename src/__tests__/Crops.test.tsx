import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders the crops list on the Crops page', () => {
  window.history.pushState({}, '', '/crops');
  render(<App />);

  expect(screen.getByRole('heading', { name: /our crops/i })).toBeInTheDocument();
  expect(screen.getByText(/soybeans/i)).toBeInTheDocument();
  expect(screen.getByText(/wheat/i)).toBeInTheDocument();
  expect(screen.getByText(/corn/i)).toBeInTheDocument();
  expect(screen.getByText(/straw/i)).toBeInTheDocument();
  expect(screen.getByText(/hay/i)).toBeInTheDocument();
});
