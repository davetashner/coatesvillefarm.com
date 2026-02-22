import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Contact from '../pages/Contact';

test('renders Contact page content', () => {
  render(
    <HelmetProvider>
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    </HelmetProvider>
  );

  expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/your email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/message\*/i)).toBeInTheDocument();
});

test('shows validation error for invalid email', async () => {
  jest.useFakeTimers();

  render(
    <HelmetProvider>
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    </HelmetProvider>
  );

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  const emailInput = screen.getByLabelText(/your email/i);
  const submitButton = screen.getByRole('button', { name: /send message/i });

  fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
  fireEvent.click(submitButton);

  expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();

  jest.useRealTimers();
});
