import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen } from '@/test/render';
import { EmptyState } from './empty-state';

const messages = {
  common: {
    feedback: {
      emptyState: {
        default: { title: 'No data yet', description: 'Nothing to show here.' },
        search: { title: 'No results', description: 'Try a different search term.' },
        error: { title: 'Something broke', description: 'We could not load this.' },
      },
    },
  },
};

describe('EmptyState', () => {
  it('resolves the title from i18n per variant when no explicit title is passed', () => {
    const variants = ['default', 'search', 'error'] as const;
    for (const variant of variants) {
      const { unmount } = renderWithProviders(<EmptyState variant={variant} />, { messages });
      expect(screen.getByText(messages.common.feedback.emptyState[variant].title)).toBeInTheDocument();
      unmount();
    }
  });

  it('prefers an explicit title over the i18n default', () => {
    renderWithProviders(<EmptyState title="Custom title" />, { messages });
    expect(screen.getByText('Custom title')).toBeInTheDocument();
    expect(screen.queryByText(messages.common.feedback.emptyState.default.title)).not.toBeInTheDocument();
  });
});
