import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders welcome message on Home page', () => {
  render(<App />);
  expect(screen.getByText(/Welcome to Coatesville Farm/i)).toBeInTheDocument();
});