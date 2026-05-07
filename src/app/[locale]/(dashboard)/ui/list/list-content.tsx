'use client';

import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { ShowcaseSection, ShowcaseDemo } from '@features/ui-showcase';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';

function ClassesTable({ rows }: {
  rows: { class: string; appliedTo: string; description: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--text-primary)] w-48">Class</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--text-primary)] w-28">Applied to</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--text-primary)]">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {rows.map((row) => (
            <tr key={row.class} className="bg-[var(--surface)]">
              <td className="px-4 py-3 font-mono text-xs text-[var(--accent)]">{row.class}</td>
              <td className="px-4 py-3 font-mono text-xs text-[var(--text-muted)]">{row.appliedTo}</td>
              <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ListContent() {
  const t = useTranslations('list');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const classRows = [
    { class: t('classes.list.class'), appliedTo: t('classes.list.appliedTo'), description: t('classes.list.description') },
    { class: t('classes.ordered.class'), appliedTo: t('classes.ordered.appliedTo'), description: t('classes.ordered.description') },
    { class: t('classes.description.class'), appliedTo: t('classes.description.appliedTo'), description: t('classes.description.description') },
    { class: t('classes.compact.class'), appliedTo: t('classes.compact.appliedTo'), description: t('classes.compact.description') },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">{t('header.title')}</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          {t('header.subtitle')}
        </p>
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)]">
          <pre className="px-4 py-3 text-xs font-mono text-[var(--text-secondary)] overflow-x-auto">
            <code>{`<ul className="nx-list">…</ul>\n<ol className="nx-list nx-list--ordered">…</ol>\n<dl className="nx-list nx-list--description">…</dl>`}</code>
          </pre>
        </div>
      </div>

      {/* Bulleted */}
      <ShowcaseSection title={t('sections.bulleted.title')} description={t('sections.bulleted.description')}>
        <ShowcaseDemo
          title='nx-list'
          code={`<ul className="nx-list">\n  <li>Item one</li>\n  <li>Item two</li>\n</ul>`}
        >
          <ul className="nx-list">
            <li>{t('demos.bulleted.item1')}</li>
            <li>{t('demos.bulleted.item2')}</li>
            <li>{t('demos.bulleted.item3')}</li>
            <li>{t('demos.bulleted.item4')}</li>
          </ul>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Ordered */}
      <ShowcaseSection title={t('sections.ordered.title')} description={t('sections.ordered.description')}>
        <ShowcaseDemo
          title='nx-list nx-list--ordered'
          code={`<ol className="nx-list nx-list--ordered">\n  <li>Step one</li>\n  <li>Step two</li>\n</ol>`}
        >
          <ol className="nx-list nx-list--ordered">
            <li>{t('demos.ordered.item1')}</li>
            <li>{t('demos.ordered.item2')}</li>
            <li>{t('demos.ordered.item3')}</li>
            <li>{t('demos.ordered.item4')}</li>
          </ol>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Description list */}
      <ShowcaseSection title={t('sections.description.title')} description={t('sections.description.description')}>
        <ShowcaseDemo
          title='nx-list nx-list--description'
          code={`<dl className="nx-list nx-list--description">\n  <dt>Term</dt>\n  <dd>Definition text.</dd>\n</dl>`}
        >
          <dl className="nx-list nx-list--description">
            <dt>{t('demos.description.term1')}</dt>
            <dd>{t('demos.description.def1')}</dd>
            <dt>{t('demos.description.term2')}</dt>
            <dd>{t('demos.description.def2')}</dd>
            <dt>{t('demos.description.term3')}</dt>
            <dd>{t('demos.description.def3')}</dd>
          </dl>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Custom icon */}
      <ShowcaseSection title={t('sections.customIcon.title')} description={t('sections.customIcon.description')}>
        <ShowcaseDemo
          title="with Lucide icon"
          code={`import { Check } from 'lucide-react';\n\n<ul className="nx-list" style={{ listStyle: 'none', paddingLeft: 0 }}>\n  <li className="flex items-start gap-2">\n    <Check size={14} className="mt-0.5 shrink-0 text-[var(--success)]" />\n    Item text\n  </li>\n</ul>`}
        >
          <ul className="nx-list" style={{ listStyle: 'none', paddingLeft: 0 }}>
            {[
              t('demos.customIcon.item1'),
              t('demos.customIcon.item2'),
              t('demos.customIcon.item3'),
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check size={14} className="mt-0.5 shrink-0 text-[var(--success)]" />
                {item}
              </li>
            ))}
          </ul>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Nested */}
      <ShowcaseSection title={t('sections.nested.title')} description={t('sections.nested.description')}>
        <ShowcaseDemo
          title="nested nx-list"
          code={`<ul className="nx-list">\n  <li>Parent item\n    <ul className="nx-list">…</ul>\n  </li>\n</ul>`}
        >
          <ul className="nx-list">
            <li>
              {t('demos.nested.parent1')}
              <ul className="nx-list">
                <li>{t('demos.nested.nested1a')}</li>
                <li>{t('demos.nested.nested1b')}</li>
                <li>{t('demos.nested.nested1c')}</li>
              </ul>
            </li>
            <li>
              {t('demos.nested.parent2')}
              <ul className="nx-list">
                <li>{t('demos.nested.nested2a')}</li>
                <li>{t('demos.nested.nested2b')}</li>
              </ul>
            </li>
          </ul>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Classes reference */}
      <ShowcaseSection title={t('sections.classes.title')}>
        <ClassesTable rows={classRows} />
      </ShowcaseSection>

      {/* Localization */}
      <ShowcaseSection title={tNote('title')}>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{tNote('description')}</p>
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
