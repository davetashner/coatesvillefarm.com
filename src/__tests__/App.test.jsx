import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App component', () => {
  test('renders hero image on Home page', () => {
    render(<App />);
    const heroImage = screen.getByAltText(/coatesville farm hero/i);
    expect(heroImage).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /crops/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });
});