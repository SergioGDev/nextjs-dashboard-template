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
import { Slider } from '@components/ui/slider';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc, AnatomyPart } from '@features/ui-showcase';

function ControlledSliderDemo() {
  const t = useTranslations('slider');
  const [volume, setVolume] = useState(60);

  return (
    <Slider
      label={t('demos.labelVolume')}
      showValue
      formatValue={(v) => `${v}${t('demos.unitPercent')}`}
      value={volume}
      onChange={(e) => setVolume(Number(e.target.value))}
    />
  );
}

export function SliderContent() {
  const t = useTranslations('slider');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const parts: AnatomyPart[] = [
    { name: 'input', type: 'input', required: true, description: t('anatomy.parts.input') },
    { name: 'track', type: 'div', required: true, description: t('anatomy.parts.track') },
    { name: 'thumb', type: 'div', required: true, description: t('anatomy.parts.thumb') },
    { name: 'label', type: 'string', required: false, description: t('anatomy.parts.label') },
    { name: 'value', type: 'string', required: false, description: t('anatomy.parts.value') },
  ];

  const props: PropDoc[] = [
    { prop: 'label', type: 'string', description: t('props.label') },
    { prop: 'showValue', type: 'boolean', default: 'false', description: t('props.showValue') },
    { prop: 'formatValue', type: '(value: number) => string', description: t('props.formatValue') },
    { prop: 'min', type: 'number', default: '0', description: t('props.min') },
    { prop: 'max', type: 'number', default: '100', description: t('props.max') },
    { prop: 'step', type: 'number', default: '1', description: t('props.step') },
    { prop: 'value', type: 'number', description: t('props.value') },
    { prop: 'defaultValue', type: 'number', description: t('props.defaultValue') },
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
            <code>{`import { Slider } from '@components/ui/slider';`}</code>
          </pre>
        </div>
      </div>

      {/* Anatomy */}
      <ShowcaseSection title={t('anatomy.title')} description={t('anatomy.description')}>
        <Anatomy
          render={
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <div className="flex items-center justify-between">
                <AnatomyPartHighlight label="label">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {t('demos.labelVolume')}
                  </span>
                </AnatomyPartHighlight>
                <AnatomyPartHighlight label="value">
                  <span className="text-xs font-medium text-[var(--text-muted)]">60%</span>
                </AnatomyPartHighlight>
              </div>
              <AnatomyPartHighlight label="track + thumb">
                <div className="relative w-full h-4 flex items-center">
                  <div className="w-full h-1 rounded-full bg-[var(--border-strong)]" />
                  <div className="absolute left-[60%] w-4 h-4 rounded-full bg-[var(--accent)] shadow -translate-x-1/2" />
                </div>
              </AnatomyPartHighlight>
            </div>
          }
          parts={parts}
        />
      </ShowcaseSection>

      {/* States */}
      <ShowcaseSection title={t('sections.states.title')} description={t('sections.states.description')}>
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo
            title="default"
            code={`<Slider label="Brightness" defaultValue={40} />`}
          >
            <Slider label={t('demos.labelBrightness')} defaultValue={40} />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="with value display"
            code={`<Slider\n  label="Volume"\n  showValue\n  formatValue={(v) => \`\${v}%\`}\n  defaultValue={60}\n/>`}
          >
            <Slider
              label={t('demos.labelVolume')}
              showValue
              formatValue={(v) => `${v}${t('demos.unitPercent')}`}
              defaultValue={60}
            />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="controlled"
            code={`const [volume, setVolume] = useState(60);\n\n<Slider\n  label="Volume"\n  showValue\n  formatValue={(v) => \`\${v}%\`}\n  value={volume}\n  onChange={(e) => setVolume(Number(e.target.value))}\n/>`}
          >
            <ControlledSliderDemo />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="disabled"
            code={`<Slider label="Disabled slider" defaultValue={30} disabled />`}
          >
            <Slider label={t('demos.labelDisabled')} defaultValue={30} disabled />
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Range and step */}
      <ShowcaseSection title={t('sections.range.title')} description={t('sections.range.description')}>
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo
            title="min / max"
            code={`<Slider\n  label="Opacity"\n  showValue\n  formatValue={(v) => \`\${v}%\`}\n  min={0}\n  max={100}\n  defaultValue={75}\n/>`}
          >
            <Slider
              label={t('demos.labelOpacity')}
              showValue
              formatValue={(v) => `${v}${t('demos.unitPercent')}`}
              min={0}
              max={100}
              defaultValue={75}
            />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="custom step"
            code={`<Slider\n  label="Zoom level"\n  showValue\n  formatValue={(v) => \`\${v}x\`}\n  min={1}\n  max={5}\n  step={0.5}\n  defaultValue={2}\n/>`}
          >
            <Slider
              label={t('demos.labelZoom')}
              showValue
              formatValue={(v) => `${v}${t('demos.unitX')}`}
              min={1}
              max={5}
              step={0.5}
              defaultValue={2}
            />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="large range"
            code={`<Slider\n  label="Temperature"\n  showValue\n  formatValue={(v) => \`\${v}°C\`}\n  min={-20}\n  max={50}\n  defaultValue={22}\n/>`}
          >
            <Slider
              label={t('demos.labelTemperature')}
              showValue
              formatValue={(v) => `${v}°C`}
              min={-20}
              max={50}
              defaultValue={22}
            />
          </ShowcaseDemo>
        </ShowcaseGrid>
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
