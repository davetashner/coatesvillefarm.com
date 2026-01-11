import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders hero section with background image', () => {
  render(<App />);
  const hero = screen.getByAltText(/Coatesville Farm landscape/i);
  expect(hero).toBeInTheDocument();
});
