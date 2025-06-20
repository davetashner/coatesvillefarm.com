import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders navigation links', () => {
  window.history.pushState({}, '', '/');
  render(<App />);

  expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /crops/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
});