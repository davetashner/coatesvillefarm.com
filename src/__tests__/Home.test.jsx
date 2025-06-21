import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import * as logoUtils from '../utils/logoUtils';

describe('renders Home page with seasonal logos', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders Home page with autumn logo (October, daytime)', () => {
    jest.spyOn(logoUtils, 'getLogoPath').mockReturnValue('/assets/img/logo-autumn.png');
    render(<App />);
    const logo = screen.getByRole('img', { name: /coatesville farm logo/i });
    expect(logo).toHaveAttribute('src', '/assets/img/logo-autumn.png');
  });

  test('renders Home page with summer logo (June, daytime)', () => {
    jest.spyOn(logoUtils, 'getLogoPath').mockReturnValue('/assets/img/logo-summer.png');
    render(<App />);
    const logo = screen.getByRole('img', { name: /coatesville farm logo/i });
    expect(logo).toHaveAttribute('src', '/assets/img/logo-summer.png');
  });

  test('renders Home page with winter logo (January, daytime)', () => {
    jest.spyOn(logoUtils, 'getLogoPath').mockReturnValue('/assets/img/logo-winter.png');
    render(<App />);
    const logo = screen.getByRole('img', { name: /coatesville farm logo/i });
    expect(logo).toHaveAttribute('src', '/assets/img/logo-winter.png');
  });

  test('renders Home page with night logo (non-fall, night)', () => {
    jest.spyOn(logoUtils, 'getLogoPath').mockReturnValue('/assets/img/logo-spring-night.png');
    render(<App />);
    const logo = screen.getByRole('img', { name: /coatesville farm logo/i });
    expect(logo).toHaveAttribute('src', '/assets/img/logo-spring-night.png');
  });
});