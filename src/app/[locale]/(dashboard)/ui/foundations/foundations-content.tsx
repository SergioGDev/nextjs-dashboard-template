'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Square,
  RectangleHorizontal,
  Type,
  Minus,
  Layers,
  Palette,
  Search,
  Bell,
  User,
  Settings,
  Home,
  Mail,
  Calendar,
  Star,
  Heart,
  Bookmark,
  Filter,
  Download,
  RotateCcw,
} from 'lucide-react';
import {
  AccentScope,
  AccentPicker,
  TokenSwatch,
  TokenRow,
  TypeSpecimen,
  PhilosophyCard,
} from '@features/ui-showcase';
import styles from './foundations-content.module.css';

const TOC_IDS = [
  'philosophy',
  'colors',
  'typography',
  'spacing',
  'radii',
  'elevation',
  'motion',
  'iconography',
] as const;

const PRINCIPLE_KEYS = [
  'sharp_cards',
  'pill_controls',
  'positive_tracking',
  'weight_ceiling',
  'layering_over_shadow',
  'monochrome_accent',
] as const;

const PRINCIPLE_ICONS: Record<(typeof PRINCIPLE_KEYS)[number], React.ElementType> = {
  sharp_cards: Square,
  pill_controls: RectangleHorizontal,
  positive_tracking: Type,
  weight_ceiling: Minus,
  layering_over_shadow: Layers,
  monochrome_accent: Palette,
};

const SEMANTIC_KEYS = ['success', 'warning', 'error', 'info'] as const;

export function FoundationsContent() {
  const t = useTranslations('foundations');

  return (
    <AccentScope>
      <div className="max-w-[var(--content-max)] mx-auto">
        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
            {t('title')}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
            {t('subtitle')}
          </p>
        </div>

        {/* Layout: content + sticky TOC on lg+ */}
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12">
          <main className="space-y-16 min-w-0">
            <PhilosophySection />
            <ColorsSection />
            <TypographySection />
            <SpacingSection />
            <RadiiSection />
            <ElevationSection />
            <MotionSection />
            <IconographySection />
          </main>

          <aside className="hidden lg:block">
            <nav className="sticky top-6 flex flex-col gap-2">
              <p className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">
                {t('toc.label')}
              </p>
              {TOC_IDS.map((id) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  style={{
                    transitionDuration: 'var(--dur-fast)',
                    transitionTimingFunction: 'var(--ease-out)',
                  }}
                >
                  {t(`toc.${id}`)}
                </a>
              ))}
            </nav>
          </aside>
        </div>
      </div>
    </AccentScope>
  );
}

function PhilosophySection() {
  const t = useTranslations('foundations.philosophy');

  return (
    <section id="philosophy" className="space-y-6 scroll-mt-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
          {t('title')}
        </h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
          {t('subtitle')}
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {PRINCIPLE_KEYS.map((key) => {
          const Icon = PRINCIPLE_ICONS[key];
          return (
            <PhilosophyCard
              key={key}
              title={t(`principles.${key}.title`)}
              description={t(`principles.${key}.description`)}
              icon={<Icon size={16} />}
            />
          );
        })}
      </div>
    </section>
  );
}

function ColorsSection() {
  const t = useTranslations('foundations.colors');

  return (
    <section id="colors" className="space-y-8 scroll-mt-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
          {t('title')}
        </h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
          {t('subtitle')}
        </p>
      </header>

      {/* Surfaces */}
      <SubSection title={t('surfaces.title')} description={t('surfaces.description')}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TokenSwatch
            color="var(--background)"
            varName="background"
            label="Background"
            description={t('surfaces.background_role')}
          />
          <TokenSwatch
            color="var(--surface)"
            varName="surface"
            label="Surface"
            description={t('surfaces.surface_role')}
          />
          <TokenSwatch
            color="var(--surface-raised)"
            varName="surface-raised"
            label="Surface raised"
            description={t('surfaces.surface_raised_role')}
          />
          <TokenSwatch
            color="var(--surface-sunk)"
            varName="surface-sunk"
            label="Surface sunk"
            description={t('surfaces.surface_sunk_role')}
          />
        </div>
      </SubSection>

      {/* Text */}
      <SubSection title={t('text.title')} description={t('text.description')}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TokenSwatch
            color="var(--text-primary)"
            varName="text-primary"
            label="Primary"
            description={t('text.primary_role')}
          />
          <TokenSwatch
            color="var(--text-secondary)"
            varName="text-secondary"
            label="Secondary"
            description={t('text.secondary_role')}
          />
          <TokenSwatch
            color="var(--text-muted)"
            varName="text-muted"
            label="Muted"
            description={t('text.muted_role')}
          />
          <TokenSwatch
            color="var(--text-subtle)"
            varName="text-subtle"
            label="Subtle"
            description={t('text.subtle_role')}
          />
        </div>
      </SubSection>

      {/* Borders */}
      <SubSection title={t('borders.title')} description={t('borders.description')}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TokenSwatch
            color="var(--border)"
            varName="border"
            label="Border"
            description={t('borders.default_role')}
            showAlpha
          />
          <TokenSwatch
            color="var(--border-strong)"
            varName="border-strong"
            label="Border strong"
            description={t('borders.strong_role')}
            showAlpha
          />
          <TokenSwatch
            color="var(--border-focus)"
            varName="border-focus"
            label="Border focus"
            description={t('borders.focus_role')}
          />
        </div>
      </SubSection>

      {/* Semantic */}
      <SubSection title={t('semantic.title')} description={t('semantic.description')}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SEMANTIC_KEYS.map((key) => (
            <div
              key={key}
              className="p-4 border border-[var(--border)] bg-[var(--surface)] space-y-3"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <h4 className="text-sm font-medium text-[var(--text-primary)]">
                {t(`semantic.${key}`)}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <TokenSwatch
                  size="sm"
                  color={`var(--${key})`}
                  varName={key}
                  label="Solid"
                />
                <TokenSwatch
                  size="sm"
                  color={`var(--${key}-muted)`}
                  varName={`${key}-muted`}
                  label={t('semantic.muted_suffix')}
                />
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      {/* Accent */}
      <SubSection title={t('accent.title')} description={t('accent.description')}>
        <div className="space-y-6">
          <div>
            <h4 className="mb-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
              {t('accent.picker_label')}
            </h4>
            <AccentPicker />
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button type="button" className="nx-btn nx-btn--primary">
              {t('accent.demo_button')}
            </button>
            <span style={{ color: 'var(--accent)' }} className="text-sm font-medium">
              {t('accent.demo_text')}
            </span>
            <div className="w-32">
              <TokenSwatch
                size="sm"
                color="var(--accent)"
                varName="accent"
                label="Accent"
              />
            </div>
            <div className="w-32">
              <TokenSwatch
                size="sm"
                color="var(--accent-muted)"
                varName="accent-muted"
                label="Accent muted"
              />
            </div>
          </div>
        </div>
      </SubSection>
    </section>
  );
}

function SubSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
        {description && (
          <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

const TYPE_SCALE = [
  {
    name: 'Display 3XL',
    sizeToken: 'fs-3xl',
    sizePx: '32px',
    lineHeightToken: 'lh-3xl',
    lineHeight: '1.15',
    weightToken: 'fw-semibold',
    weight: '530',
    trackingToken: 'tracking-tight',
    sample: 'The quick brown fox',
    usage: 'Page hero titles',
  },
  {
    name: 'Heading 2XL',
    sizeToken: 'fs-2xl',
    sizePx: '24px',
    lineHeightToken: 'lh-2xl',
    lineHeight: '1.25',
    weightToken: 'fw-semibold',
    weight: '530',
    trackingToken: 'tracking-tight',
    sample: 'The quick brown fox',
    usage: 'Section titles',
  },
  {
    name: 'Heading XL',
    sizeToken: 'fs-xl',
    sizePx: '20px',
    lineHeightToken: 'lh-xl',
    lineHeight: '1.35',
    weightToken: 'fw-medium',
    weight: '480',
    trackingToken: 'tracking-tight',
    sample: 'The quick brown fox',
    usage: 'Subsection titles',
  },
  {
    name: 'Body LG',
    sizeToken: 'fs-lg',
    sizePx: '16px',
    lineHeightToken: 'lh-lg',
    lineHeight: '1.5',
    weightToken: 'fw-regular',
    weight: '400',
    trackingToken: 'tracking-tight',
    sample: 'The quick brown fox jumps over the lazy dog.',
    usage: 'Lead paragraphs, large body text',
  },
  {
    name: 'Body Base',
    sizeToken: 'fs-base',
    sizePx: '14px',
    lineHeightToken: 'lh-base',
    lineHeight: '1.5',
    weightToken: 'fw-regular',
    weight: '400',
    trackingToken: 'tracking-tight',
    sample:
      'The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.',
    usage: 'Default body text — most UI runs at this size',
  },
  {
    name: 'Body SM',
    sizeToken: 'fs-sm',
    sizePx: '13px',
    lineHeightToken: 'lh-sm',
    lineHeight: '1.4',
    weightToken: 'fw-regular',
    weight: '400',
    trackingToken: 'tracking-tight',
    sample: 'The quick brown fox jumps over the lazy dog.',
    usage: 'Secondary text, captions',
  },
  {
    name: 'Caption XS',
    sizeToken: 'fs-xs',
    sizePx: '11px',
    lineHeightToken: 'lh-xs',
    lineHeight: '1.25',
    weightToken: 'fw-regular',
    weight: '400',
    trackingToken: 'tracking-wider',
    sample: 'OVERLINE LABEL',
    usage: 'Uppercase labels, eyebrow text — uses --tracking-wider',
  },
] as const;

const WEIGHT_TOKENS = [
  { token: 'fw-regular', value: '400', wasNote: undefined as string | undefined },
  { token: 'fw-medium', value: '480', wasNote: '(was 500)' },
  { token: 'fw-semibold', value: '530', wasNote: undefined },
  { token: 'fw-bold', value: '530', wasNote: '(was 700)' },
] as const;

const TRACKING_TOKENS: {
  token: string;
  value: string;
  label: string;
  preview: 'sample' | 'overline';
}[] = [
  { token: 'tracking-tight', value: '0.005em', label: 'Default body & headings', preview: 'sample' },
  { token: 'tracking-normal', value: '0.01em', label: 'Slightly opened', preview: 'sample' },
  { token: 'tracking-wide', value: '0.02em', label: 'Decorative', preview: 'sample' },
  { token: 'tracking-wider', value: '0.08em', label: 'Uppercase eyebrows', preview: 'overline' },
];

function TypographySection() {
  const t = useTranslations('foundations.typography');

  return (
    <section id="typography" className="space-y-8 scroll-mt-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
          {t('title')}
        </h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
          {t('subtitle')}
        </p>
      </header>

      {/* Families */}
      <SubSection title={t('families.title')} description={t('families.description')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FamilyCard
            label="Sans"
            sample="Inter"
            sampleStyle={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-3xl)',
              fontWeight: 530,
              letterSpacing: 'var(--tracking-tight)',
            }}
            pangram="The quick brown fox jumps over the lazy dog 0123456789"
            pangramStyle={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-base)' }}
            stack="--font-sans  ·  Inter, ui-sans-serif, system-ui"
          />
          <FamilyCard
            label="Mono"
            sample="JetBrains Mono"
            sampleStyle={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--fs-2xl)',
              fontWeight: 480,
              letterSpacing: 'var(--tracking-tight)',
            }}
            pangram="const greeting = 'Hello, world!' // 0123456789"
            pangramStyle={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-base)' }}
            stack="--font-mono  ·  JetBrains Mono, ui-monospace, SF Mono"
          />
        </div>
      </SubSection>

      {/* Scale */}
      <SubSection title={t('scale.title')} description={t('scale.description')}>
        <div
          className="border border-[var(--border)] bg-[var(--surface)] px-6"
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          {TYPE_SCALE.map((spec) => (
            <TypeSpecimen key={spec.name} {...spec} />
          ))}
        </div>
      </SubSection>

      {/* Weights */}
      <SubSection title={t('weights.title')} description={t('weights.description')}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {WEIGHT_TOKENS.map((w) => (
            <div
              key={w.token}
              className="p-5 border border-[var(--border)] bg-[var(--surface)] space-y-2"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <div
                style={{
                  fontSize: 'var(--fs-3xl)',
                  fontWeight: w.value as unknown as number,
                  letterSpacing: 'var(--tracking-tight)',
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                }}
              >
                Aa
              </div>
              <p className="font-mono text-xs text-[var(--text-secondary)]">--{w.token}</p>
              <p className="font-mono text-xs text-[var(--text-muted)]">
                {w.value}
                {w.wasNote && (
                  <span className="ml-2 text-[var(--text-subtle)]">{w.wasNote}</span>
                )}
              </p>
              {w.value === '530' && (
                <p className="text-xs italic text-[var(--text-muted)] opacity-70">
                  Capped at 530
                </p>
              )}
            </div>
          ))}
        </div>
      </SubSection>

      {/* Tracking */}
      <SubSection title={t('tracking.title')} description={t('tracking.description')}>
        <p className="text-xs italic text-[var(--text-muted)] mb-2">{t('tracking.note')}</p>
        <div
          className="border border-[var(--border)] bg-[var(--surface)] px-6"
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          {TRACKING_TOKENS.map((tr) => (
            <TokenRow
              key={tr.token}
              varName={tr.token}
              value={tr.value}
              label={tr.label}
              preview={
                <span
                  style={{
                    fontSize:
                      tr.preview === 'overline' ? 'var(--fs-xs)' : 'var(--fs-base)',
                    fontWeight: 480,
                    letterSpacing: `var(--${tr.token})`,
                    color: 'var(--text-primary)',
                    textTransform: tr.preview === 'overline' ? 'uppercase' : 'none',
                  }}
                >
                  {tr.preview === 'overline' ? 'OVERLINE LABEL' : 'TRACKING SAMPLE'}
                </span>
              }
            />
          ))}
        </div>
      </SubSection>
    </section>
  );
}

function FamilyCard({
  label,
  sample,
  sampleStyle,
  pangram,
  pangramStyle,
  stack,
}: {
  label: string;
  sample: string;
  sampleStyle: React.CSSProperties;
  pangram: string;
  pangramStyle: React.CSSProperties;
  stack: string;
}) {
  return (
    <div
      className="p-6 border border-[var(--border)] bg-[var(--surface)] space-y-4"
      style={{ borderRadius: 'var(--radius-md)' }}
    >
      <p className="font-mono text-xs text-[var(--text-muted)]">{label}</p>
      <div style={{ ...sampleStyle, color: 'var(--text-primary)', lineHeight: 1.1 }}>
        {sample}
      </div>
      <p style={{ ...pangramStyle, color: 'var(--text-secondary)' }}>{pangram}</p>
      <p className="font-mono text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border)]">
        {stack}
      </p>
    </div>
  );
}

const SPACING_TOKENS: { token: string; px: number }[] = [
  { token: 'space-0', px: 0 },
  { token: 'space-1', px: 4 },
  { token: 'space-2', px: 8 },
  { token: 'space-3', px: 12 },
  { token: 'space-4', px: 16 },
  { token: 'space-5', px: 20 },
  { token: 'space-6', px: 24 },
  { token: 'space-8', px: 32 },
  { token: 'space-10', px: 40 },
  { token: 'space-12', px: 48 },
  { token: 'space-16', px: 64 },
];

function SpacingSection() {
  const t = useTranslations('foundations.spacing');

  return (
    <section id="spacing" className="space-y-6 scroll-mt-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
          {t('title')}
        </h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
          {t('subtitle')}
        </p>
        <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">
          {t('description')}
        </p>
      </header>
      <div
        className="border border-[var(--border)] bg-[var(--surface)] px-6"
        style={{ borderRadius: 'var(--radius-md)' }}
      >
        {SPACING_TOKENS.map(({ token, px }) => (
          <TokenRow
            key={token}
            varName={token}
            value={`${px}px`}
            preview={
              px === 0 ? (
                <div
                  style={{
                    width: '100%',
                    height: '1px',
                    background: 'var(--border-strong)',
                    opacity: 0.5,
                  }}
                />
              ) : (
                <span
                  className="inline-block"
                  style={{
                    width: `${px}px`,
                    height: '8px',
                    background: 'var(--accent)',
                  }}
                />
              )
            }
          />
        ))}
      </div>
    </section>
  );
}

const RADII_TOKENS: { token: string; px: number; label?: string }[] = [
  { token: 'radius-sm', px: 2 },
  { token: 'radius-md', px: 4 },
  { token: 'radius-lg', px: 0, label: 'Cards (sharp)' },
  { token: 'radius-xl', px: 4 },
  { token: 'radius-pill', px: 32, label: 'Controls' },
  { token: 'radius-pill-lg', px: 40, label: 'Large CTAs' },
  { token: 'radius-full', px: 9999, label: 'Badges, dots' },
];

function RadiiSection() {
  const t = useTranslations('foundations.radii');

  return (
    <section id="radii" className="space-y-6 scroll-mt-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
          {t('title')}
        </h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
          {t('subtitle')}
        </p>
        <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">
          {t('description')}
        </p>
      </header>

      {/* Signature panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="p-6 border border-[var(--border)] bg-[var(--surface)] space-y-4"
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          <h4 className="text-sm font-medium text-[var(--text-primary)]">
            {t('signature_sharp')}
          </h4>
          <div
            className="w-full flex items-center justify-center"
            style={{
              height: '80px',
              background: 'var(--surface-raised)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <span className="font-mono text-xs text-[var(--text-muted)]">0px</span>
          </div>
          <p className="font-mono text-xs text-[var(--text-muted)]">--radius-lg: 0px</p>
        </div>

        <div
          className="p-6 border border-[var(--border)] bg-[var(--surface)] space-y-4"
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          <h4 className="text-sm font-medium text-[var(--text-primary)]">
            {t('signature_pill')}
          </h4>
          <div className="w-full flex items-center justify-center" style={{ height: '80px' }}>
            <div
              style={{
                background: 'var(--accent)',
                color: 'var(--accent-foreground)',
                borderRadius: 'var(--radius-pill)',
                padding: '8px 20px',
                height: '40px',
                display: 'inline-flex',
                alignItems: 'center',
                fontSize: 'var(--fs-sm)',
                fontWeight: 480,
              }}
            >
              Primary action
            </div>
          </div>
          <p className="font-mono text-xs text-[var(--text-muted)]">
            --radius-pill: 32px  ·  height 40px
          </p>
        </div>
      </div>

      {/* Token list */}
      <div
        className="mt-8 border border-[var(--border)] bg-[var(--surface)] px-6"
        style={{ borderRadius: 'var(--radius-md)' }}
      >
        {RADII_TOKENS.map(({ token, px, label }) => (
          <TokenRow
            key={token}
            varName={token}
            value={px === 9999 ? '9999px' : `${px}px`}
            label={label}
            preview={<RadiusPreview token={token} px={px} />}
          />
        ))}
      </div>
    </section>
  );
}

function RadiusPreview({ token, px }: { token: string; px: number }) {
  const isPill = token === 'radius-pill';
  const isPillLg = token === 'radius-pill-lg';
  const isFull = token === 'radius-full';

  let width = 24;
  let height = 24;
  if (isPill) {
    width = 64;
    height = 24;
  } else if (isPillLg) {
    width = 80;
    height = 32;
  }

  return (
    <span
      className="inline-block"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: 'var(--surface-raised)',
        border: '1px solid var(--border-strong)',
        borderRadius: isFull ? '9999px' : `${px}px`,
      }}
    />
  );
}

function ElevationSection() {
  const t = useTranslations('foundations.elevation');

  return (
    <section id="elevation" className="space-y-8 scroll-mt-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
          {t('title')}
        </h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
          {t('subtitle')}
        </p>
      </header>

      {/* Layering tower */}
      <SubSection title={t('layering.title')} description={t('layering.description')}>
        <div
          className="p-8 border border-[var(--border)]"
          style={{
            background: 'var(--surface-sunk)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <p className="mb-2 font-mono text-xs text-[var(--text-muted)]">--surface-sunk</p>
          <div
            className="p-6 border border-[var(--border)]"
            style={{
              background: 'var(--background)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <p className="mb-2 font-mono text-xs text-[var(--text-muted)]">--background</p>
            <div
              className="p-6 border border-[var(--border)]"
              style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <p className="mb-2 font-mono text-xs text-[var(--text-muted)]">--surface</p>
              <div
                className="p-8 border border-[var(--border)] flex items-center"
                style={{
                  background: 'var(--surface-raised)',
                  borderRadius: 'var(--radius-md)',
                  minHeight: '60px',
                }}
              >
                <p className="font-mono text-xs text-[var(--text-secondary)]">
                  --surface-raised
                </p>
              </div>
            </div>
          </div>
        </div>
      </SubSection>

      {/* Box shadows */}
      <SubSection title={t('shadows.title')} description={t('shadows.description')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ShadowDemoCard
            varName="--shadow-card"
            shadow="var(--shadow-card)"
            note={t('shadows.dark_note')}
          />
          <ShadowDemoCard
            varName="--shadow-pop"
            shadow="var(--shadow-pop)"
            note={t('shadows.pop_note')}
          />
        </div>
      </SubSection>
    </section>
  );
}

function ShadowDemoCard({
  varName,
  shadow,
  note,
}: {
  varName: string;
  shadow: string;
  note: string;
}) {
  return (
    <div
      className="p-8 border border-[var(--border)] flex flex-col items-center gap-4"
      style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)' }}
    >
      <div
        className="w-full max-w-xs"
        style={{
          height: '80px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: shadow,
        }}
      />
      <div className="text-center space-y-1">
        <p className="font-mono text-xs text-[var(--text-muted)]">{varName}</p>
        <p className="text-xs italic text-[var(--text-muted)]">{note}</p>
      </div>
    </div>
  );
}

const MOTION_DURATIONS: { token: string; value: string; pulseClass: string }[] = [
  { token: 'dur-fast', value: '120ms', pulseClass: styles.pulseFast },
  { token: 'dur-base', value: '180ms', pulseClass: styles.pulseBase },
  { token: 'dur-slow', value: '240ms', pulseClass: styles.pulseSlow },
];

const MOTION_EASINGS: { token: string; value: string; loopClass: string }[] = [
  {
    token: 'ease-out',
    value: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    loopClass: styles.easeOutLoop,
  },
  {
    token: 'ease-in-out',
    value: 'cubic-bezier(0.4, 0, 0.2, 1)',
    loopClass: styles.easeInOutLoop,
  },
];

const REPLAY_CELLS: { row: 'ease-out' | 'ease-in-out'; col: 'fast' | 'base' | 'slow'; cls: string }[] = [
  { row: 'ease-out', col: 'fast', cls: styles.cellFastOut },
  { row: 'ease-out', col: 'base', cls: styles.cellBaseOut },
  { row: 'ease-out', col: 'slow', cls: styles.cellSlowOut },
  { row: 'ease-in-out', col: 'fast', cls: styles.cellFastInOut },
  { row: 'ease-in-out', col: 'base', cls: styles.cellBaseInOut },
  { row: 'ease-in-out', col: 'slow', cls: styles.cellSlowInOut },
];

function MotionSection() {
  const t = useTranslations('foundations.motion');
  const [replayKey, setReplayKey] = useState(0);

  return (
    <section id="motion" className="space-y-8 scroll-mt-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
          {t('title')}
        </h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
          {t('subtitle')}
        </p>
      </header>

      {/* Durations */}
      <SubSection title={t('durations.title')} description={t('durations.description')}>
        <div
          className="border border-[var(--border)] bg-[var(--surface)] px-6"
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          {MOTION_DURATIONS.map((d) => (
            <TokenRow
              key={d.token}
              varName={d.token}
              value={d.value}
              preview={
                <span
                  className={d.pulseClass}
                  style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    borderRadius: '9999px',
                    background: 'var(--accent)',
                  }}
                />
              }
            />
          ))}
        </div>
      </SubSection>

      {/* Easings */}
      <SubSection title={t('easings.title')} description={t('easings.description')}>
        <div
          className="border border-[var(--border)] bg-[var(--surface)] px-6"
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          {MOTION_EASINGS.map((e) => (
            <TokenRow
              key={e.token}
              varName={e.token}
              value={e.value}
              preview={
                <span
                  className="inline-flex items-center"
                  style={{
                    width: '80px',
                    height: '20px',
                    background: 'var(--surface-raised)',
                    border: '1px solid var(--border)',
                    borderRadius: '2px',
                    padding: '2px',
                  }}
                >
                  <span
                    className={e.loopClass}
                    style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      background: 'var(--accent)',
                      borderRadius: '2px',
                    }}
                  />
                </span>
              }
            />
          ))}
        </div>
      </SubSection>

      {/* Replay demo */}
      <SubSection title={t('demo.title')}>
        <div
          className="p-6 border border-[var(--border)] bg-[var(--surface)]"
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="grid grid-cols-[80px_repeat(3,1fr)] gap-4 flex-1 max-w-md">
              <span />
              <span className="font-mono text-xs text-[var(--text-muted)] text-center">
                Fast (120ms)
              </span>
              <span className="font-mono text-xs text-[var(--text-muted)] text-center">
                Base (180ms)
              </span>
              <span className="font-mono text-xs text-[var(--text-muted)] text-center">
                Slow (240ms)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setReplayKey((k) => k + 1)}
              className="nx-btn nx-btn--secondary"
            >
              <RotateCcw size={16} />
              <span>{t('demo.replay')}</span>
            </button>
          </div>

          <div key={replayKey} className="grid grid-cols-[80px_repeat(3,1fr)] gap-4 max-w-md">
            {(['ease-out', 'ease-in-out'] as const).map((row) => (
              <ReplayRow key={row} row={row} />
            ))}
          </div>
        </div>
      </SubSection>
    </section>
  );
}

function ReplayRow({ row }: { row: 'ease-out' | 'ease-in-out' }) {
  const cells = REPLAY_CELLS.filter((c) => c.row === row);
  return (
    <>
      <span className="font-mono text-xs text-[var(--text-muted)] flex items-center">
        {row}
      </span>
      {cells.map((cell) => (
        <div
          key={cell.col}
          style={{
            width: '80px',
            height: '20px',
            background: 'var(--surface-raised)',
            border: '1px solid var(--border)',
            borderRadius: '2px',
            padding: '2px',
          }}
        >
          <div
            className={cell.cls}
            style={{
              width: '16px',
              height: '16px',
              background: 'var(--accent)',
              borderRadius: '2px',
            }}
          />
        </div>
      ))}
    </>
  );
}

const ICON_SIZES: { px: number; labelKey: 'nav' | 'inline' | 'control' | 'display' }[] = [
  { px: 14, labelKey: 'nav' },
  { px: 16, labelKey: 'inline' },
  { px: 20, labelKey: 'control' },
  { px: 24, labelKey: 'display' },
];

const SAMPLE_ICONS = [
  Search,
  Bell,
  User,
  Settings,
  Home,
  Mail,
  Calendar,
  Star,
  Heart,
  Bookmark,
  Filter,
  Download,
];

function IconographySection() {
  const t = useTranslations('foundations.iconography');

  return (
    <section id="iconography" className="space-y-8 scroll-mt-6">
      <header>
        <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
          {t('title')}
        </h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
          {t('subtitle')}
        </p>
      </header>

      {/* Library */}
      <SubSection title={t('library.title')} description={t('library.description')}>
        <div
          className="p-6 border border-[var(--border)] bg-[var(--surface)] space-y-6"
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          <pre className="font-mono text-sm text-[var(--text-secondary)] overflow-x-auto">
            <code>{`import { Search, Bell, User } from 'lucide-react';`}</code>
          </pre>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-4">
            {SAMPLE_ICONS.map((Icon, i) => (
              <span
                key={i}
                className="flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                style={{
                  transition: 'color var(--dur-fast) var(--ease-out)',
                }}
              >
                <Icon size={20} />
              </span>
            ))}
          </div>
        </div>
      </SubSection>

      {/* Sizes */}
      <SubSection title={t('sizes.title')} description={t('sizes.description')}>
        <div
          className="border border-[var(--border)] bg-[var(--surface)] px-6"
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          {ICON_SIZES.map(({ px, labelKey }) => (
            <div
              key={px}
              className="grid items-center gap-4 py-3 border-b border-[var(--border)] last:border-0"
              style={{ gridTemplateColumns: '80px 160px 1fr' }}
            >
              <span className="font-mono text-sm text-[var(--text-secondary)]">
                {px}px
              </span>
              <span className="text-sm text-[var(--text-primary)]">
                {t(`sizes.${labelKey}`)}
              </span>
              <span className="text-[var(--text-secondary)]">
                <Search size={px} />
              </span>
            </div>
          ))}
        </div>
      </SubSection>
    </section>
  );
}
