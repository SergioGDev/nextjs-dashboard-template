'use client';

import { useTranslations } from 'next-intl';
import {
  ShowcaseSection,
  ShowcaseDemo,
  ShowcaseGrid,
  PropsTable,
  Anatomy,
  AnatomyPartHighlight,
} from '@features/ui-showcase';
import { Switch } from '@components/ui/switch';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc, AnatomyPart } from '@features/ui-showcase';

export function SwitchContent() {
  const t = useTranslations('switch');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const parts: AnatomyPart[] = [
    { name: 'input', type: 'input', required: true, description: t('anatomy.parts.input') },
    { name: 'track', type: 'div', required: true, description: t('anatomy.parts.track') },
    { name: 'thumb', type: 'div', required: true, description: t('anatomy.parts.thumb') },
    { name: 'label', type: 'string', required: false, description: t('anatomy.parts.label') },
    { name: 'description', type: 'string', required: false, description: t('anatomy.parts.description') },
  ];

  const props: PropDoc[] = [
    { prop: 'label', type: 'string', description: t('props.label') },
    { prop: 'description', type: 'string', description: t('props.description') },
    { prop: 'size', type: "'sm' | 'md'", default: "'md'", description: t('props.size') },
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
            <code>{`import { Switch } from '@components/ui/switch';`}</code>
          </pre>
        </div>
      </div>

      {/* Anatomy */}
      <ShowcaseSection title={t('anatomy.title')} description={t('anatomy.description')}>
        <Anatomy
          render={
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <AnatomyPartHighlight label="track + thumb">
                  <div className="relative w-9 h-5 rounded-full bg-[var(--border-strong)]">
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow" />
                  </div>
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
            title="off"
            code={`<Switch label="Push notifications" />`}
          >
            <Switch label={t('demos.labelNotifications')} />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="on"
            code={`<Switch label="Push notifications" defaultChecked />`}
          >
            <Switch label={t('demos.labelNotifications')} defaultChecked />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="disabled off"
            code={`<Switch label="Disabled toggle" disabled />`}
          >
            <Switch label={t('demos.labelDisabled')} disabled />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="disabled on"
            code={`<Switch label="Disabled toggle" defaultChecked disabled />`}
          >
            <Switch label={t('demos.labelDisabled')} defaultChecked disabled />
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Sizes */}
      <ShowcaseSection title={t('sections.sizes.title')} description={t('sections.sizes.description')}>
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo
            title="sm"
            code={`<Switch size="sm" label="Auto-save" />`}
          >
            <Switch size="sm" label={t('demos.labelAutoSave')} defaultChecked />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="md (default)"
            code={`<Switch label="Auto-save" />`}
          >
            <Switch label={t('demos.labelAutoSave')} defaultChecked />
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* With label and description */}
      <ShowcaseSection title={t('sections.withLabel.title')} description={t('sections.withLabel.description')}>
        <ShowcaseDemo
          title="with label + description"
          code={`<Switch\n  label="Push notifications"\n  description="Receive notifications on your device."\n  defaultChecked\n/>`}
        >
          <div className="space-y-4">
            <Switch
              label={t('demos.labelNotifications')}
              description={t('demos.descriptionNotifications')}
              defaultChecked
            />
            <Switch
              label={t('demos.labelMarketing')}
              description={t('demos.descriptionMarketing')}
            />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Settings panel pattern */}
      <ShowcaseSection title="Settings panel">
        <ShowcaseDemo
          title="settings list"
          code={`<div className="space-y-1">\n  <Switch size="sm" label="Dark mode" defaultChecked />\n  <Switch size="sm" label="Analytics" />\n  <Switch size="sm" label="Auto-save" defaultChecked />\n</div>`}
        >
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)] w-72">
            {[
              { label: t('demos.labelDarkMode'), checked: true },
              { label: t('demos.labelAnalytics'), checked: false },
              { label: t('demos.labelAutoSave'), checked: true },
            ].map(({ label, checked }) => (
              <div key={label} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-[var(--text-primary)]">{label}</span>
                <Switch size="sm" defaultChecked={checked} />
              </div>
            ))}
          </div>
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
