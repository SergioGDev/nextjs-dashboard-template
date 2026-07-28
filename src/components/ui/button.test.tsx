import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen } from '@/test/render';
import { Button } from './button';

describe('Button', () => {
  it('shows a spinner and disables the button when loading', () => {
    renderWithProviders(<Button loading>Save</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByRole('status')).toBeInTheDocument();
    // Label stays in the DOM (visually hidden) so the button keeps its width.
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('requires and renders an accessible name for icon-only buttons', () => {
    renderWithProviders(
      <Button iconOnly aria-label="Delete">
        <span aria-hidden="true">x</span>
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });
});
