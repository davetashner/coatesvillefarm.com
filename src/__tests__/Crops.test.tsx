import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders the crops cards on the Crops page', () => {
  window.history.pushState({}, '', '/crops');
  render(<App />);

  expect(screen.getByRole('heading', { name: /our crops/i })).toBeInTheDocument();

  const cropNames = ['Soybeans', 'Corn', 'Wheat', 'Hay', 'Barley'];
  for (const name of cropNames) {
    expect(screen.getByRole('heading', { name })).toBeInTheDocument();
  }
});
