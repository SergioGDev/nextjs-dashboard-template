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
import { RadioGroup } from '@components/ui/radio-group';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc, AnatomyPart } from '@features/ui-showcase';

function ControlledDemo() {
  const t = useTranslations('radioGroup');
  const [plan, setPlan] = useState('pro');

  const items = [
    { value: 'free', label: t('demos.labelFree') },
    { value: 'pro', label: t('demos.labelPro') },
    { value: 'enterprise', label: t('demos.labelEnterprise') },
  ];

  return <RadioGroup name="plan-controlled" value={plan} onChange={setPlan} items={items} />;
}

export function RadioGroupContent() {
  const t = useTranslations('radioGroup');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const parts: AnatomyPart[] = [
    { name: 'input', type: 'input', required: true, description: t('anatomy.parts.input') },
    { name: 'box', type: 'div', required: true, description: t('anatomy.parts.box') },
    { name: 'dot', type: 'div', required: true, description: t('anatomy.parts.dot') },
    { name: 'label', type: 'string', required: false, description: t('anatomy.parts.label') },
    { name: 'description', type: 'string', required: false, description: t('anatomy.parts.description') },
  ];

  const props: PropDoc[] = [
    { prop: 'name', type: 'string', required: true, description: t('props.name') },
    { prop: 'value', type: 'string', description: t('props.value') },
    { prop: 'defaultValue', type: 'string', description: t('props.defaultValue') },
    { prop: 'onChange', type: '(value: string) => void', description: t('props.onChange') },
    { prop: 'items', type: 'RadioItem[]', required: true, description: t('props.items') },
    { prop: 'disabled', type: 'boolean', default: 'false', description: t('props.disabled') },
    { prop: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: t('props.orientation') },
  ];

  const notificationItems = [
    { value: 'email', label: t('demos.labelEmail') },
    { value: 'sms', label: t('demos.labelSMS') },
    { value: 'push', label: t('demos.labelPush') },
  ];

  const themeItems = [
    { value: 'light', label: t('demos.labelLight') },
    { value: 'dark', label: t('demos.labelDark') },
    { value: 'system', label: t('demos.labelSystem') },
  ];

  const disabledItems = [
    { value: 'free', label: t('demos.labelFree') },
    { value: 'disabled', label: t('demos.labelDisabled'), description: t('demos.descriptionDisabled'), disabled: true },
    { value: 'enterprise', label: t('demos.labelEnterprise') },
  ];

  const withDescriptionItems = [
    { value: 'free', label: t('demos.labelFree'), description: t('demos.descriptionFree') },
    { value: 'pro', label: t('demos.labelPro'), description: t('demos.descriptionPro') },
    { value: 'enterprise', label: t('demos.labelEnterprise'), description: t('demos.descriptionEnterprise') },
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
            <code>{`import { RadioGroup } from '@components/ui/radio-group';`}</code>
          </pre>
        </div>
      </div>

      {/* Anatomy */}
      <ShowcaseSection title={t('anatomy.title')} description={t('anatomy.description')}>
        <Anatomy
          render={
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <AnatomyPartHighlight label="box + dot">
                  <div className="relative w-4 h-4 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  </div>
                </AnatomyPartHighlight>
                <div className="flex flex-col gap-1">
                  <AnatomyPartHighlight label="label">
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {t('demos.labelPro')}
                    </span>
                  </AnatomyPartHighlight>
                  <AnatomyPartHighlight label="description">
                    <span className="text-xs text-[var(--text-muted)]">
                      {t('demos.descriptionPro')}
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
            title="uncontrolled"
            code={`<RadioGroup\n  name="notify"\n  defaultValue="email"\n  items={[\n    { value: 'email', label: 'Email' },\n    { value: 'sms', label: 'SMS' },\n    { value: 'push', label: 'Push notification' },\n  ]}\n/>`}
          >
            <RadioGroup name="notify-demo" defaultValue="email" items={notificationItems} />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="controlled"
            code={`const [plan, setPlan] = useState('pro');\n\n<RadioGroup\n  name="plan"\n  value={plan}\n  onChange={setPlan}\n  items={[\n    { value: 'free', label: 'Free' },\n    { value: 'pro', label: 'Pro' },\n    { value: 'enterprise', label: 'Enterprise' },\n  ]}\n/>`}
          >
            <ControlledDemo />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="group disabled"
            code={`<RadioGroup\n  name="theme"\n  defaultValue="light"\n  disabled\n  items={[...]}\n/>`}
          >
            <RadioGroup name="theme-disabled" defaultValue="light" disabled items={themeItems} />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="item disabled"
            code={`<RadioGroup\n  name="plan"\n  items={[\n    { value: 'free', label: 'Free' },\n    { value: 'disabled', label: 'Disabled option', disabled: true },\n    { value: 'enterprise', label: 'Enterprise' },\n  ]}\n/>`}
          >
            <RadioGroup name="plan-item-disabled" defaultValue="free" items={disabledItems} />
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Orientation */}
      <ShowcaseSection title={t('sections.orientation.title')} description={t('sections.orientation.description')}>
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo
            title="vertical (default)"
            code={`<RadioGroup\n  name="theme"\n  orientation="vertical"\n  items={[...]}\n/>`}
          >
            <RadioGroup name="theme-vert" defaultValue="light" orientation="vertical" items={themeItems} />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="horizontal"
            code={`<RadioGroup\n  name="theme"\n  orientation="horizontal"\n  items={[...]}\n/>`}
          >
            <RadioGroup name="theme-horiz" defaultValue="dark" orientation="horizontal" items={themeItems} />
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* With descriptions */}
      <ShowcaseSection title={t('sections.withDescription.title')} description={t('sections.withDescription.description')}>
        <ShowcaseDemo
          title="items with descriptions"
          code={`<RadioGroup\n  name="plan"\n  defaultValue="pro"\n  items={[\n    { value: 'free', label: 'Free', description: 'Up to 3 projects, community support.' },\n    { value: 'pro', label: 'Pro', description: 'Unlimited projects, priority support.' },\n    { value: 'enterprise', label: 'Enterprise', description: 'Custom contracts, dedicated account manager.' },\n  ]}\n/>`}
        >
          <RadioGroup name="plan-desc" defaultValue="pro" items={withDescriptionItems} />
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
