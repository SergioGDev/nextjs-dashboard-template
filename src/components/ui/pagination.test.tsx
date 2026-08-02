import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen } from '@/test/render';
import { Pagination } from './pagination';

const messages = {
  common: {
    table: {
      pagination: 'Pagination',
      previousPage: 'Previous page',
      nextPage: 'Next page',
      goToPage: 'Go to page {page}',
    },
  },
};

function renderPagination(props: Partial<React.ComponentProps<typeof Pagination>> = {}) {
  const onPageChange = props.onPageChange ?? vi.fn();
  renderWithProviders(
    <Pagination page={1} totalPages={10} onPageChange={onPageChange} {...props} />,
    { messages },
  );
  return { onPageChange };
}

// A page-number button has a numeric accessible name ("Go to page N");
// the prev/next arrows use "Previous page" / "Next page" instead.
function pageButtons() {
  return screen.getAllByRole('button').filter((btn) => /^Go to page \d+$/.test(btn.getAttribute('aria-label') ?? ''));
}

// Total visual slots between the arrows — page-number buttons PLUS ellipsis
// spans. This is the number that must stay constant across pages: an
// ellipsis occupies the same h-8 w-8 footprint as a button, so the container
// only holds steady if this combined count never changes.
function totalSlots() {
  return pageButtons().length + screen.getAllByText('…').length;
}

describe('Pagination — windowing', () => {
  it('shows every page with no ellipsis when totalPages <= 7', () => {
    renderWithProviders(<Pagination page={1} totalPages={5} onPageChange={vi.fn()} />, { messages });

    expect(pageButtons()).toHaveLength(5);
    expect(screen.queryByText('…')).not.toBeInTheDocument();
  });

  // Boundary: the default sibling count yields exactly 7 slots, and /users sits
  // on precisely this value (70 mock users ÷ pageSize 10). Testing only 5 would
  // let an off-by-one in the threshold through unnoticed.
  it('still shows all 7 pages with no ellipsis at the boundary', () => {
    renderWithProviders(<Pagination page={4} totalPages={7} onPageChange={vi.fn()} />, { messages });

    expect(pageButtons()).toHaveLength(7);
    expect(screen.queryByText('…')).not.toBeInTheDocument();
  });

  it('starts collapsing with an ellipsis one page past the boundary', () => {
    renderWithProviders(<Pagination page={4} totalPages={8} onPageChange={vi.fn()} />, { messages });

    expect(screen.getAllByText('…').length).toBeGreaterThan(0);
  });

  it('keeps the first and last page reachable from a middle page of a large set', () => {
    renderWithProviders(<Pagination page={10} totalPages={20} onPageChange={vi.fn()} />, { messages });

    expect(screen.getByRole('button', { name: 'Go to page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 20' })).toBeInTheDocument();
  });

  it('marks the current page with aria-current="page"', () => {
    renderWithProviders(<Pagination page={10} totalPages={20} onPageChange={vi.fn()} />, { messages });

    const current = screen.getByRole('button', { name: 'Go to page 10' });
    expect(current).toHaveAttribute('aria-current', 'page');

    const other = screen.getByRole('button', { name: 'Go to page 1' });
    expect(other).not.toHaveAttribute('aria-current');
  });

  it('renders the same number of slots on the first, a middle, and the last page', () => {
    const { rerender } = renderWithProviders(
      <Pagination page={1} totalPages={20} onPageChange={vi.fn()} />,
      { messages },
    );
    const firstCount = totalSlots();

    rerender(<Pagination page={10} totalPages={20} onPageChange={vi.fn()} />);
    const middleCount = totalSlots();

    rerender(<Pagination page={20} totalPages={20} onPageChange={vi.fn()} />);
    const lastCount = totalSlots();

    expect(firstCount).toBe(middleCount);
    expect(middleCount).toBe(lastCount);
    // Pin the actual count, not just its constancy: asserting only that the
    // three are equal passes just as happily if the window silently shrinks.
    expect(firstCount).toBe(7);
  });

  it('calls onPageChange with the clicked page number', async () => {
    const user = userEvent.setup();
    const { onPageChange } = renderPagination({ page: 1, totalPages: 20 });

    await user.click(screen.getByRole('button', { name: 'Go to page 20' }));

    expect(onPageChange).toHaveBeenCalledWith(20);
  });

  it('calls onPageChange with page - 1 when the previous arrow is clicked', async () => {
    const user = userEvent.setup();
    const { onPageChange } = renderPagination({ page: 5, totalPages: 10 });

    await user.click(screen.getByRole('button', { name: 'Previous page' }));

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('renders nothing when totalPages is 1', () => {
    const { container } = renderWithProviders(
      <Pagination page={1} totalPages={1} onPageChange={vi.fn()} />,
      { messages },
    );

    expect(container).toBeEmptyDOMElement();
  });
});
