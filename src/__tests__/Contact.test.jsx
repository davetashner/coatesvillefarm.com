import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Contact page content', () => {
  window.history.pushState({}, '', '/contact');
  render(<App />);

  // Heading
  expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();

  // Email section
  expect(screen.getByText(/email us at/i)).toBeInTheDocument();
  const emailLinks = screen.getAllByText(/info@coatesvillefarm.com/i);
  expect(emailLinks.length).toBeGreaterThanOrEqual(2);
  expect(emailLinks[0]).toHaveAttribute('href', 'mailto:info@coatesvillefarm.com');

  // Address section
  const addressMatches = screen.getAllByText(/14072 old ridge road/i);
  expect(addressMatches.length).toBeGreaterThanOrEqual(2);
  expect(addressMatches[0].textContent.toLowerCase()).toContain('14072 old ridge road');
});