'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  ShowcaseSection,
  ShowcaseDemo,
  ShowcaseGrid,
  PropsTable,
  Anatomy,
  AnatomyPartHighlight,
} from '@features/ui-showcase';
import { Pagination } from '@components/ui/pagination';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc, AnatomyPart } from '@features/ui-showcase';

// Pagination is a controlled component — every demo below owns its own
// `page` state, exactly like a real consumer would.
function DemoPagination({
  totalPages,
  initialPage = 1,
  siblingCount,
}: {
  totalPages: number;
  initialPage?: number;
  siblingCount?: number;
}) {
  const [page, setPage] = React.useState(initialPage);
  return (
    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} siblingCount={siblingCount} />
  );
}

export function PaginationContent() {
  const t = useTranslations('pagination');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const parts: AnatomyPart[] = [
    { name: 'previous', type: 'button', required: true, description: t('anatomy.parts.previous') },
    { name: 'pages', type: 'button[]', required: true, description: t('anatomy.parts.pages') },
    { name: 'ellipsis', type: 'span', required: false, description: t('anatomy.parts.ellipsis') },
    { name: 'next', type: 'button', required: true, description: t('anatomy.parts.next') },
  ];

  const props: PropDoc[] = [
    { prop: 'page', type: 'number', required: true, description: t('props.page') },
    { prop: 'totalPages', type: 'number', required: true, description: t('props.totalPages') },
    { prop: 'onPageChange', type: '(page: number) => void', required: true, description: t('props.onPageChange') },
    { prop: 'siblingCount', type: 'number', default: '1', description: t('props.siblingCount') },
    { prop: 'className', type: 'string', description: t('props.className') },
  ];

  return (
    <div className="space-y-12">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
          {t('header.title')}
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          {t('header.subtitle')}
        </p>
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)]">
          <pre className="px-4 py-3 text-xs font-mono text-[var(--text-secondary)] overflow-x-auto">
            <code>{`import { Pagination } from '@components/ui/pagination';`}</code>
          </pre>
        </div>
      </div>

      {/* Anatomy */}
      <ShowcaseSection title={t('anatomy.title')} description={t('anatomy.description')}>
        <Anatomy
          render={
            <div className="flex items-center gap-4">
              <AnatomyPartHighlight label="previous">
                <span className="h-8 w-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)]">
                  <ChevronLeft size={16} />
                </span>
              </AnatomyPartHighlight>
              <AnatomyPartHighlight label="pages">
                <span className="h-8 w-8 flex items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)] text-sm font-medium">
                  3
                </span>
              </AnatomyPartHighlight>
              <AnatomyPartHighlight label="ellipsis">
                <span className="h-8 w-8 flex items-center justify-center text-[var(--text-muted)]">
                  &#8230;
                </span>
              </AnatomyPartHighlight>
              <AnatomyPartHighlight label="next">
                <span className="h-8 w-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)]">
                  <ChevronRight size={16} />
                </span>
              </AnatomyPartHighlight>
            </div>
          }
          parts={parts}
        />
      </ShowcaseSection>

      {/* Few pages — no ellipsis */}
      <ShowcaseSection title={t('sections.fewPages.title')} description={t('sections.fewPages.description')}>
        <ShowcaseDemo
          title={t('sections.fewPages.title')}
          align="start"
          code={`const [page, setPage] = useState(1);

<Pagination page={page} totalPages={5} onPageChange={setPage} />`}
        >
          <DemoPagination totalPages={5} />
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Many pages — ellipsis on both sides */}
      <ShowcaseSection title={t('sections.manyPages.title')} description={t('sections.manyPages.description')}>
        <ShowcaseDemo
          title={t('sections.manyPages.title')}
          align="start"
          code={`<Pagination page={page} totalPages={50} onPageChange={setPage} />`}
        >
          <DemoPagination totalPages={50} initialPage={25} />
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Boundaries */}
      <ShowcaseSection title={t('sections.boundaries.title')} description={t('sections.boundaries.description')}>
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo
            title={t('demos.startBoundary')}
            align="start"
            code={`<Pagination page={1} totalPages={20} onPageChange={setPage} />`}
          >
            <DemoPagination totalPages={20} initialPage={1} />
          </ShowcaseDemo>
          <ShowcaseDemo
            title={t('demos.endBoundary')}
            align="start"
            code={`<Pagination page={20} totalPages={20} onPageChange={setPage} />`}
          >
            <DemoPagination totalPages={20} initialPage={20} />
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Sibling count */}
      <ShowcaseSection title={t('sections.siblingCount.title')} description={t('sections.siblingCount.description')}>
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo
            title="siblingCount={1}"
            align="start"
            code={`<Pagination page={page} totalPages={30} onPageChange={setPage} siblingCount={1} />`}
          >
            <DemoPagination totalPages={30} initialPage={15} siblingCount={1} />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="siblingCount={2}"
            align="start"
            code={`<Pagination page={page} totalPages={30} onPageChange={setPage} siblingCount={2} />`}
          >
            <DemoPagination totalPages={30} initialPage={15} siblingCount={2} />
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Accessibility */}
      <ShowcaseSection title={t('sections.accessibility.title')} description={t('sections.accessibility.description')}>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <pre className="text-xs font-mono text-[var(--text-secondary)] overflow-x-auto">{`<nav aria-label="Pagination">
  <button aria-label="Previous page">…</button>
  <button aria-current="page">3</button>
  <span aria-hidden="true">…</span>
  <button aria-label="Go to page 10">10</button>
  <button aria-label="Next page">…</button>
</nav>`}</pre>
        </div>
      </ShowcaseSection>

      {/* Props */}
      <ShowcaseSection title={t('sections.props.title')} description={t('sections.props.description')}>
        <PropsTable rows={props} />
      </ShowcaseSection>

      {/* Localization */}
      <ShowcaseSection title={tNote('title')}>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {tNote('description')}
          </p>
          <Link
            href={routes.ui.i18n}
            className="inline-flex text-sm font-medium text-[var(--accent)] hover:underline"
          >
            {tNote('linkLabel')}
          </Link>
        </div>
      </ShowcaseSection>

    </div>
  );
}
