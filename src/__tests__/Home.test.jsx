import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

afterEach(() => {
  jest.useRealTimers();
});

test('renders Home page with default logo (non-fall, non-summer, non-winter, daytime)', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-04-01T12:00:00Z')); // April, noon
  window.history.pushState({}, '', '/');
  render(<App />);
  const logo = screen.getByRole('img', { name: /coatesville farm logo/i });
  expect(logo).toHaveAttribute('src', '/assets/img/logo.png');
});

test('renders Home page with fall logo (October, daytime)', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-10-10T14:00:00Z')); // October, afternoon
  window.history.pushState({}, '', '/');
  render(<App />);
  const logo = screen.getByRole('img', { name: /coatesville farm logo/i });
  expect(logo).toHaveAttribute('src', '/assets/img/logo-fall.png');
});

test('renders Home page with summer logo (June, daytime)', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-06-15T11:00:00Z')); // June, morning
  window.history.pushState({}, '', '/');
  render(<App />);
  const logo = screen.getByRole('img', { name: /coatesville farm logo/i });
  expect(logo).toHaveAttribute('src', '/assets/img/logo-summer.png');
});

test('renders Home page with winter logo (January, daytime)', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-01-15T10:00:00Z')); // January, morning
  window.history.pushState({}, '', '/');
  render(<App />);
  const logo = screen.getByRole('img', { name: /coatesville farm logo/i });
  expect(logo).toHaveAttribute('src', '/assets/img/logo-winter.png');
});

test('renders Home page with night logo (non-fall, night)', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-04-01T20:00:00Z')); // April, night
  window.history.pushState({}, '', '/');
  render(<App />);
  const logo = screen.getByRole('img', { name: /coatesville farm logo/i });
  expect(logo).toHaveAttribute('src', '/assets/img/logo-night.png');
});