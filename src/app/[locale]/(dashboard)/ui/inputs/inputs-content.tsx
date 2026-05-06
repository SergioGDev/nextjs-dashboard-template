'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, Search, Eye, EyeOff, X } from 'lucide-react';
import {
  ShowcaseSection,
  ShowcaseDemo,
  ShowcaseGrid,
  PropsTable,
  Anatomy,
  AnatomyPartHighlight,
} from '@features/ui-showcase';
import { Input } from '@components/ui/input';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc, AnatomyPart } from '@features/ui-showcase';

export function InputsContent() {
  const t = useTranslations('inputs');
  const tNote = useTranslations('uiShowcase.localizationNote');
  const [showPassword, setShowPassword] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const parts: AnatomyPart[] = [
    { name: 'label', type: 'string', required: false, description: t('anatomy.parts.label') },
    { name: 'leading', type: 'ReactNode', required: false, description: t('anatomy.parts.leading') },
    { name: 'field', type: 'input', required: true, description: t('anatomy.parts.field') },
    { name: 'trailing', type: 'ReactNode', required: false, description: t('anatomy.parts.trailing') },
    { name: 'helper', type: 'string', required: false, description: t('anatomy.parts.helper') },
  ];

  const props: PropDoc[] = [
    { prop: 'label', type: 'string', description: t('props.label') },
    { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('props.size') },
    { prop: 'error', type: 'string', description: t('props.error') },
    { prop: 'helperText', type: 'string', description: t('props.helperText') },
    { prop: 'leftIcon', type: 'ReactNode', description: t('props.leftIcon') },
    { prop: 'rightIcon', type: 'ReactNode', description: t('props.rightIcon') },
    { prop: 'disabled', type: 'boolean', default: 'false', description: t('props.disabled') },
    { prop: 'placeholder', type: 'string', description: t('props.placeholder') },
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
            <code>{`import { Input } from '@components/ui/input';`}</code>
          </pre>
        </div>
      </div>

      {/* Anatomy */}
      <ShowcaseSection title={t('anatomy.title')} description={t('anatomy.description')}>
        <Anatomy
          render={
            <div className="flex flex-col gap-6 w-64">
              <AnatomyPartHighlight label="label">
                <span className="text-sm font-medium text-[var(--text-secondary)]">{t('demos.labelEmail')}</span>
              </AnatomyPartHighlight>
              <div className="flex items-center gap-2">
                <AnatomyPartHighlight label="leading">
                  <span className="text-[var(--text-muted)] inline-flex"><Mail size={14} /></span>
                </AnatomyPartHighlight>
                <AnatomyPartHighlight label="field">
                  <span className="h-9 px-3 border border-[var(--border-strong)] rounded-lg bg-[var(--surface)] text-xs text-[var(--text-muted)] inline-flex items-center w-28">{t('demos.placeholderEmail')}</span>
                </AnatomyPartHighlight>
                <AnatomyPartHighlight label="trailing">
                  <span className="text-[var(--text-muted)] inline-flex"><X size={14} /></span>
                </AnatomyPartHighlight>
              </div>
              <AnatomyPartHighlight label="helper">
                <span className="text-xs text-[var(--text-muted)]">{t('demos.helperEmail')}</span>
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
            code={`<Input label="Email address" placeholder="you@example.com" />`}
          >
            <Input label={t('demos.labelEmail')} placeholder={t('demos.placeholderEmail')} />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="helper"
            code={`<Input\n  label="Email address"\n  helperText="We'll never share your email."\n/>`}
          >
            <Input label={t('demos.labelEmail')} helperText={t('demos.helperEmail')} placeholder={t('demos.placeholderEmail')} />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="error"
            code={`<Input\n  label="Email address"\n  error="Enter a valid email address."\n/>`}
          >
            <Input label={t('demos.labelEmail')} error={t('demos.errorEmail')} placeholder={t('demos.placeholderEmail')} />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="disabled"
            code={`<Input label="Disabled field" disabled placeholder="Not editable" />`}
          >
            <Input label={t('demos.disabledLabel')} disabled placeholder={t('demos.disabledPlaceholder')} />
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Sizes */}
      <ShowcaseSection title={t('sections.sizes.title')} description={t('sections.sizes.description')}>
        <ShowcaseGrid columns={3}>
          <ShowcaseDemo title="sm" code={`<Input size="sm" placeholder="Small" />`}>
            <Input size="sm" placeholder="Small" />
          </ShowcaseDemo>
          <ShowcaseDemo title="md" code={`<Input placeholder="Medium" />`}>
            <Input placeholder="Medium" />
          </ShowcaseDemo>
          <ShowcaseDemo title="lg" code={`<Input size="lg" placeholder="Large" />`}>
            <Input size="lg" placeholder="Large" />
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* With icons */}
      <ShowcaseSection title={t('sections.withIcons.title')} description={t('sections.withIcons.description')}>
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo
            title="leading"
            code={`<Input leftIcon={<Mail size={14} />} placeholder="you@example.com" />`}
          >
            <Input leftIcon={<Mail size={14} />} placeholder={t('demos.placeholderEmail')} />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="trailing — password toggle"
            code={`<Input\n  type={show ? 'text' : 'password'}\n  rightIcon={\n    <button onClick={() => setShow(v => !v)} aria-label="Toggle visibility">\n      {show ? <EyeOff size={14} /> : <Eye size={14} />}\n    </button>\n  }\n/>`}
          >
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* Search pattern */}
      <ShowcaseSection title={t('sections.searchPattern.title')} description={t('sections.searchPattern.description')}>
        <ShowcaseDemo
          title="search"
          code={`const [value, setValue] = useState('');\n\n<Input\n  leftIcon={<Search size={14} />}\n  rightIcon={\n    value ? (\n      <button onClick={() => setValue('')} aria-label="Clear">\n        <X size={14} />\n      </button>\n    ) : null\n  }\n  value={value}\n  onChange={e => setValue(e.target.value)}\n  placeholder="Search…"\n/>`}
        >
          <div className="w-full max-w-sm">
            <Input
              leftIcon={<Search size={14} />}
              rightIcon={
                searchValue ? (
                  <button
                    type="button"
                    onClick={() => setSearchValue('')}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    aria-label={t('demos.clearLabel')}
                  >
                    <X size={14} />
                  </button>
                ) : null
              }
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t('demos.searchPlaceholder')}
            />
          </div>
        </ShowcaseDemo>
        <p className="mt-3 text-xs text-[var(--text-muted)]">{t('sections.searchPattern.note')}</p>
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
