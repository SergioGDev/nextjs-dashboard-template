import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen } from '@/test/render';
import { Badge } from './badge';

describe('Badge', () => {
  it('invokes onRemove and stops the click from reaching a parent handler', () => {
    const onRemove = vi.fn();
    const onParentClick = vi.fn();

    renderWithProviders(
      <div onClick={onParentClick}>
        <Badge onRemove={onRemove} aria-label="Remove tag">
          Beta
        </Badge>
      </div>,
    );

    screen.getByRole('button', { name: 'Remove tag' }).click();

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onParentClick).not.toHaveBeenCalled();
  });

  it('renders no remove button when onRemove is not provided', () => {
    renderWithProviders(<Badge>Beta</Badge>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
