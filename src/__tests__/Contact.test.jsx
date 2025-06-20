import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Contact page content', () => {
  window.history.pushState({}, '', '/contact');
  render(<App />);

  expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
  expect(screen.getByText(/email us at/i)).toBeInTheDocument();
  expect(screen.getByText(/info@coatesvillefarm.com/i)).toBeInTheDocument();
  expect(screen.getByText(/14072 old ridge road/i)).toBeInTheDocument();
});