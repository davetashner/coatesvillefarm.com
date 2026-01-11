import { render, screen, within } from '@testing-library/react';
import App from '../App';

const routesToTest = ['/', '/about', '/crops', '/contact'];

describe('Footer appears on all pages', () => {
  routesToTest.forEach((route) => {
    test(`renders footer on route: ${route}`, () => {
      window.history.pushState({}, '', route);
      render(<App />);

      const footer = screen.getByRole('contentinfo');

      // Footer contact checks scoped to footer
      expect(within(footer).getByText(/14072 old ridge road/i)).toBeInTheDocument();
      expect(within(footer).getByRole('link', { name: /\(804\) 449-6016/i })).toBeInTheDocument();
      expect(within(footer).getByRole('link', { name: /coatesvillefarm@gmail.com/i })).toBeInTheDocument();

      // Copyright check with dynamic year
      const currentYear = new Date().getFullYear();
      expect(within(footer).getByText(new RegExp(`© ${currentYear} coatesville farm`, 'i'))).toBeInTheDocument();
    });
  });
});
