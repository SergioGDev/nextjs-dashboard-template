import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen } from '@/test/render';
import { ErrorState } from './error-state';

const messages = {
  common: {
    feedback: {
      errorState: {
        title: 'Something went wrong',
        description: 'Please try again.',
        retry: 'Retry',
        tryAgain: 'Try again',
        technicalDetails: 'Technical details',
      },
    },
  },
};

describe('ErrorState', () => {
  it('invokes onRetry when the retry button is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    renderWithProviders(<ErrorState onRetry={onRetry} />, { messages });

    await user.click(screen.getByRole('button', { name: messages.common.feedback.errorState.tryAgain }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('shows technical details when an error is passed (dev mode)', () => {
    renderWithProviders(<ErrorState error={new Error('boom')} />, { messages });
    expect(screen.getByText('boom')).toBeInTheDocument();
  });

  it('omits technical details when no error is passed', () => {
    renderWithProviders(<ErrorState />, { messages });
    expect(screen.queryByText('boom')).not.toBeInTheDocument();
  });
});
