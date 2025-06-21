import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

afterEach(() => {
  jest.useRealTimers();
});

test('renders Home page with default logo (non-fall, daytime)', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-01T12:00:00Z')); // July, noon
  window.history.pushState({}, '', '/');
  render(<App />);

  expect(screen.getByRole('heading', { name: /welcome to coatesville farm/i })).toBeInTheDocument();
  expect(screen.getByText(/rooted in tradition\. growing with care\./i)).toBeInTheDocument();

  const logo = screen.getByRole('img', { name: /coatesville farm logo/i });
  expect(logo).toBeInTheDocument();
  expect(logo).toHaveAttribute('src', '/assets/img/logo.png');
});

test('renders Home page with fall logo (October, daytime)', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-10-10T14:00:00Z')); // October, afternoon
  window.history.pushState({}, '', '/');
  render(<App />);

  const logo = screen.getByRole('img', { name: /coatesville farm logo/i });
  expect(logo).toBeInTheDocument();
  expect(logo).toHaveAttribute('src', '/assets/img/logo-fall.png');
});

test('renders Home page with night logo (non-fall, evening)', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-01T21:00:00Z')); // July, night
  window.history.pushState({}, '', '/');
  render(<App />);

  const logo = screen.getByRole('img', { name: /coatesville farm logo/i });
  expect(logo).toBeInTheDocument();
  expect(logo).toHaveAttribute('src', '/assets/img/logo-night.png');
});