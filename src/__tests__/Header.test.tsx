import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header';

// Force mobile viewport so the menu toggle button appears
function setMobileViewport() {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 400,
  });
}

function setDesktopViewport() {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  });
}

function renderHeader() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Header />
    </MemoryRouter>
  );
}

describe('Header', () => {
  beforeEach(() => {
    setMobileViewport();
  });

  afterEach(() => {
    setDesktopViewport();
    // Dispatch resize inside act to avoid warnings about state updates
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
  });

  test('renders all navigation links', () => {
    renderHeader();

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /crops/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  test('menu toggle opens and closes the mobile menu', () => {
    renderHeader();

    const toggleButton = screen.getByRole('button', { name: /open navigation/i });
    const navMenu = document.getElementById('nav-menu');

    // Initially hidden
    expect(navMenu?.className).toContain('mobile-hidden');
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

    // Open
    fireEvent.click(toggleButton);
    expect(navMenu?.className).toContain('mobile-visible');
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

    // Close
    fireEvent.click(toggleButton);
    expect(navMenu?.className).toContain('mobile-hidden');
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('menu closes when a navigation link is clicked', () => {
    renderHeader();

    const toggleButton = screen.getByRole('button', { name: /open navigation/i });
    const navMenu = document.getElementById('nav-menu');

    // Open the menu first
    fireEvent.click(toggleButton);
    expect(navMenu?.className).toContain('mobile-visible');

    // Click a nav link
    fireEvent.click(screen.getByRole('link', { name: /about/i }));

    // Menu should close
    expect(navMenu?.className).toContain('mobile-hidden');
  });
});
