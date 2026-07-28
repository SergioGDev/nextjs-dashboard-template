import { describe, expect, it } from 'vitest';
import { fireEvent, renderWithProviders, screen } from '@/test/render';
import { Avatar } from './avatar';

describe('Avatar', () => {
  it('falls back to initials derived from alt when there is no src', () => {
    renderWithProviders(<Avatar alt="Jane Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('falls back to initials after the image fails to load', () => {
    renderWithProviders(<Avatar src="https://example.com/broken.png" alt="Jane Doe" />);
    // Image is attempted first — initials aren't rendered yet.
    expect(screen.queryByText('JD')).not.toBeInTheDocument();

    const img = screen.getByRole('img');
    fireEvent.error(img);

    expect(screen.getByText('JD')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
