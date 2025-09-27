import { CssBaseline, ThemeProvider } from '@mui/material';
import { act } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import SignInCard from './SignInCard';
import theme from '../../theme';

describe('SignInCard', () => {
  const renderCard = (props = {}) =>
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SignInCard {...props} />
      </ThemeProvider>
    );

  it('renders email and password fields', () => {
    renderCard();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows validation errors when inputs are empty on submit', async () => {
    renderCard();
    const user = userEvent.setup();

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /login/i }));
    });

    const requiredMessages = await screen.findAllByText(/required/i);
    expect(requiredMessages).toHaveLength(2);
  });

  it('validates email format and min password length', async () => {
    renderCard();
    const user = userEvent.setup();

    await act(async () => {
      await user.type(screen.getByLabelText(/email/i), 'invalid');
      await user.type(screen.getByLabelText(/password/i), 'short');
      await user.click(screen.getByRole('button', { name: /login/i }));
    });

    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
    expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument();
  });

  it('invokes callback and surfaces success banner with valid credentials', async () => {
    const handleSubmit = vi.fn();
    renderCard({ onSubmit: handleSubmit });
    const user = userEvent.setup();

    await act(async () => {
      await user.type(screen.getByLabelText(/email/i), 'user@example.com');
      await user.type(screen.getByLabelText(/password/i), 'supersecret');
      await user.click(screen.getByRole('button', { name: /login/i }));
    });

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'supersecret',
    });

    expect(
      await screen.findByText(/authentication will connect to the api in a later sprint/i)
    ).toBeInTheDocument();
  });
});
