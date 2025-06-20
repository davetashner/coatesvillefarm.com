import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Home page content', () => {
  window.history.pushState({}, '', '/');
  render(<App />);

  expect(
    screen.getByRole('heading', { name: /welcome to coatesville farm/i })
  ).toBeInTheDocument();

  expect(
    screen.getByText(/rooted in tradition\. growing with care\./i)
  ).toBeInTheDocument();

  const logo = screen.getByRole('img', { name: /coatesville farm logo/i });
  expect(logo).toBeInTheDocument();
  expect(logo).toHaveAttribute('src', '/assets/img/logo.png');
});