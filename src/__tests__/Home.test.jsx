import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import SeasonalLogo from '../components/SeasonalLogo';

test('renders hero section with background image', () => {
  render(<App />);
  const hero = screen.getByAltText(/Coatesville Farm landscape/i);
  expect(hero).toBeInTheDocument();
});