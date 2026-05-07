'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  ShowcaseSection,
  ShowcaseDemo,
  ShowcaseGrid,
  PropsTable,
  Anatomy,
  AnatomyPartHighlight,
} from '@features/ui-showcase';
import { Checkbox } from '@components/ui/checkbox';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc, AnatomyPart } from '@features/ui-showcase';

function IndeterminateGroupDemo() {
  const t = useTranslations('checkbox');
  const [checked, setChecked] = useState([true, false, false]);

  const allChecked = checked.every(Boolean);
  const someChecked = checked.some(Boolean) && !allChecked;

  const toggleAll = () => {
    const next = !allChecked;
    setChecked([next, next, next]);
  };

  const toggle = (i: number) => {
    const next = [...checked];
    next[i] = !next[i];
    setChecked(next);
  };

  return (
    <div className="space-y-3">
      <Checkbox
        label={t('demos.labelSelectAll')}
        checked={allChecked}
        indeterminate={someChecked}
        onChange={toggleAll}
      />
      <div className="pl-7 space-y-2">
        <Checkbox label={t('demos.labelOption1')} checked={checked[0]} onChange={() => toggle(0)} />
        <Checkbox label={t('demos.labelOption2')} checked={checked[1]} onChange={() => toggle(1)} />
        <Checkbox label={t('demos.labelOption3')} checked={checked[2]} onChange={() => toggle(2)} />
      </div>
    </div>
  );
}

export function CheckboxContent() {
  const t = useTranslations('checkbox');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const parts: AnatomyPart[] = [
    { name: 'control', type: 'input', required: true, description: t('anatomy.parts.control') },
    { name: 'box', type: 'div', required: true, description: t('anatomy.parts.box') },
    { name: 'icon', type: 'ReactNode', required: false, description: t('anatomy.parts.icon') },
    { name: 'label', type: 'string', required: false, description: t('anatomy.parts.label') },
    { name: 'description', type: 'string', required: false, description: t('anatomy.parts.description') },
  ];

  const props: PropDoc[] = [
    { prop: 'label', type: 'string', description: t('props.label') },
    { prop: 'description', type: 'string', description: t('props.description') },
    { prop: 'indeterminate', type: 'boolean', default: 'false', description: t('props.indeterminate') },
    { prop: 'checked', type: 'boolean', description: t('props.checked') },
    { prop: 'defaultChecked', type: 'boolean', description: t('props.defaultChecked') },
    { prop: 'disabled', type: 'boolean', default: 'false', description: t('props.disabled') },
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
            <code>{`import { Checkbox } from '@components/ui/checkbox';`}</code>
          </pre>
        </div>
      </div>

      {/* Anatomy */}
      <ShowcaseSection title={t('anatomy.title')} description={t('anatomy.description')}>
        <Anatomy
          render={
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <AnatomyPartHighlight label="control + box">
                  <div className="h-4 w-4 rounded border border-[var(--border-strong)] bg-[var(--surface)]" />
                </AnatomyPartHighlight>
                <div className="flex flex-col gap-1">
                  <AnatomyPartHighlight label="label">
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {t('demos.labelNotifications')}
                    </span>
                  </AnatomyPartHighlight>
                  <AnatomyPartHighlight label="description">
                    <span className="text-xs text-[var(--text-muted)]">
                      {t('demos.descriptionNotifications')}
                    </span>
                  </AnatomyPartHighlight>
                </div>
              </div>
            </div>
          }
          parts={parts}
        />
      </ShowcaseSection>

      {/* States */}
      <ShowcaseSection title={t('sections.states.title')} description={t('sections.states.description')}>
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo
            title="unchecked"
            code={`<Checkbox label="Email notifications" />`}
          >
            <Checkbox label={t('demos.labelNotifications')} />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="checked"
            code={`<Checkbox label="Email notifications" defaultChecked />`}
          >
            <Checkbox label={t('demos.labelNotifications')} defaultChecked />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="indeterminate"
            code={`<Checkbox label="Select all" indeterminate />`}
          >
            <Checkbox label={t('demos.labelSelectAll')} indeterminate />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="disabled"
            code={`<Checkbox\n  label="Disabled option"\n  description="This option cannot be changed."\n  disabled\n/>`}
          >
            <Checkbox
              label={t('demos.labelDisabled')}
              description={t('demos.descriptionDisabled')}
              disabled
            />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="with description"
            code={`<Checkbox\n  label="Email notifications"\n  description="Receive emails about account activity."\n  defaultChecked\n/>`}
          >
            <div className="space-y-3">
              <Checkbox
                label={t('demos.labelNotifications')}
                description={t('demos.descriptionNotifications')}
                defaultChecked
              />
              <Checkbox
                label={t('demos.labelMarketing')}
                description={t('demos.descriptionMarketing')}
              />
              <Checkbox
                label={t('demos.labelSecurity')}
                description={t('demos.descriptionSecurity')}
                defaultChecked
                disabled
              />
            </div>
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Group with indeterminate */}
      <ShowcaseSection title={t('sections.group.title')} description={t('sections.group.description')}>
        <ShowcaseDemo
          title="indeterminate parent"
          code={`const [checked, setChecked] = useState([true, false, false]);\nconst allChecked = checked.every(Boolean);\nconst someChecked = checked.some(Boolean) && !allChecked;\n\n<Checkbox\n  label="Select all"\n  checked={allChecked}\n  indeterminate={someChecked}\n  onChange={toggleAll}\n/>`}
        >
          <IndeterminateGroupDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Props */}
      <ShowcaseSection title={t('sections.props.title')} description={t('sections.props.description')}>
        <PropsTable rows={props} />
        <p className="mt-3 text-xs text-[var(--text-muted)]">{t('props.extendsNote')}</p>
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
