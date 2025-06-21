import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Contact from "../Contact";
import { act } from "react";

test("renders Contact page content", () => {
  render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>
  );

  // Heading
  expect(screen.getByRole("heading", { name: /contact us/i })).toBeInTheDocument();

  // Email
  expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/your email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/message\*/i)).toBeInTheDocument();
});

test("shows validation error for invalid email", async () => {
  jest.useFakeTimers(); // use mock timers

  render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>
  );

  // Advance the timer to trigger the button render
  act(() => {
    jest.advanceTimersByTime(1000);
  });

  const emailInput = screen.getByLabelText(/your email/i);
  const submitButton = screen.getByRole("button", { name: /send message/i });

  // Enter an invalid email
  fireEvent.change(emailInput, { target: { value: "invalid-email" } });

  // Submit the form
  fireEvent.click(submitButton);

  // Assert that the custom error message is shown
  expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();

  jest.useRealTimers(); // clean up
});