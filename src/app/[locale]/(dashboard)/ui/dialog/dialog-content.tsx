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
import { Dialog } from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { Kbd } from '@components/ui/kbd';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc, AnatomyPart } from '@features/ui-showcase';

// ---------------------------------------------------------------------------
// Demo sub-components — isolated state to keep main component clean
// ---------------------------------------------------------------------------

function BasicDemo() {
  const t = useTranslations('dialog');
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>{t('demos.open')}</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={t('demos.basicTitle')}
        description={t('demos.basicDescription')}
        closeLabel={t('demos.close')}
      >
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {t('demos.basicBody')}
        </p>
        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={() => setOpen(false)}>{t('demos.close')}</Button>
        </div>
      </Dialog>
    </>
  );
}

function SizeDemo({ size, label }: { size: 'sm' | 'md' | 'lg'; label: string }) {
  const t = useTranslations('dialog');
  const [open, setOpen] = useState(false);
  const maxWidths = { sm: '24rem', md: '32rem', lg: '42rem' };
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>{label}</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={`size="${size}" — max-w: ${maxWidths[size]}`}
        description={t('demos.basicDescription')}
        size={size}
        closeLabel={t('demos.close')}
      >
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {t('demos.basicBody')}
        </p>
        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={() => setOpen(false)}>{t('demos.close')}</Button>
        </div>
      </Dialog>
    </>
  );
}

function DestructiveDemo() {
  const t = useTranslations('dialog');
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>{t('demos.delete')}</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={t('demos.deleteTitle')}
        description={t('demos.deleteDescription')}
        closeLabel={t('demos.cancel')}
      >
        <div className="mt-2 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)}>{t('demos.cancel')}</Button>
          <Button variant="destructive" onClick={() => setOpen(false)}>{t('demos.delete')}</Button>
        </div>
      </Dialog>
    </>
  );
}

function FormDemo() {
  const t = useTranslations('dialog');
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>{t('demos.open')}</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={t('demos.formTitle')}
        description={t('demos.formDescription')}
        closeLabel={t('demos.cancel')}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">
              {t('demos.formNameLabel')}
            </label>
            <Input placeholder={t('demos.formNamePlaceholder')} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">
              {t('demos.formBioLabel')}
            </label>
            <Textarea placeholder={t('demos.formBioPlaceholder')} rows={3} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)}>{t('demos.cancel')}</Button>
          <Button onClick={() => setOpen(false)}>{t('demos.save')}</Button>
        </div>
      </Dialog>
    </>
  );
}

function NoCloseButtonDemo() {
  const t = useTranslations('dialog');
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>{t('demos.open')}</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={t('demos.noCloseTitle')}
        description={t('demos.noCloseDescription')}
        hideCloseButton
      >
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {t('demos.noCloseBody')}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)}>{t('demos.cancel')}</Button>
          <Button onClick={() => setOpen(false)}>{t('demos.accept')}</Button>
        </div>
      </Dialog>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main content
// ---------------------------------------------------------------------------

export function DialogContent() {
  const t = useTranslations('dialog');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const parts: AnatomyPart[] = [
    { name: 'overlay', type: 'div', required: true, description: t('anatomy.parts.overlay') },
    { name: 'container', type: 'div[role=dialog]', required: true, description: t('anatomy.parts.container') },
    { name: 'close', type: 'button', required: false, description: t('anatomy.parts.close') },
    { name: 'header', type: 'div', required: false, description: t('anatomy.parts.header') },
    { name: 'body', type: 'ReactNode', required: true, description: t('anatomy.parts.body') },
    { name: 'footer', type: 'ReactNode', required: false, description: t('anatomy.parts.footer') },
  ];

  const props: PropDoc[] = [
    { prop: 'open', type: 'boolean', required: true, description: t('props.open') },
    { prop: 'onClose', type: '() => void', required: true, description: t('props.onClose') },
    { prop: 'title', type: 'string', description: t('props.title') },
    { prop: 'description', type: 'string', description: t('props.description') },
    { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('props.size') },
    { prop: 'closeLabel', type: 'string', default: "'Close'", description: t('props.closeLabel') },
    { prop: 'initialFocusRef', type: 'RefObject<HTMLElement>', description: t('props.initialFocusRef') },
    { prop: 'hideCloseButton', type: 'boolean', default: 'false', description: t('props.hideCloseButton') },
    { prop: 'className', type: 'string', description: t('props.className') },
  ];

  const keyboardRows = [
    { key: t('keyboard.tab'), action: t('keyboard.tabDesc') },
    { key: t('keyboard.shiftTab'), action: t('keyboard.shiftTabDesc') },
    { key: t('keyboard.escape'), action: t('keyboard.escapeDesc') },
    { key: t('keyboard.enter'), action: t('keyboard.enterDesc') },
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
            <code>{`import { Dialog } from '@components/ui/dialog';`}</code>
          </pre>
        </div>
      </div>

      {/* Anatomy */}
      <ShowcaseSection title={t('anatomy.title')} description={t('anatomy.description')}>
        <Anatomy
          render={
            <div className="relative w-full max-w-xs">
              <AnatomyPartHighlight label="overlay">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 space-y-3">
                  <AnatomyPartHighlight label="container">
                    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <AnatomyPartHighlight label="header">
                          <div className="space-y-0.5">
                            <div className="h-3 w-24 rounded bg-[var(--text-primary)] opacity-60" />
                            <div className="h-2 w-36 rounded bg-[var(--text-muted)] opacity-40" />
                          </div>
                        </AnatomyPartHighlight>
                        <AnatomyPartHighlight label="close">
                          <div className="h-5 w-5 rounded border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] text-xs">×</div>
                        </AnatomyPartHighlight>
                      </div>
                      <AnatomyPartHighlight label="body">
                        <div className="h-2 w-full rounded bg-[var(--border)] opacity-60" />
                      </AnatomyPartHighlight>
                      <AnatomyPartHighlight label="footer">
                        <div className="flex justify-end gap-2 pt-1">
                          <div className="h-6 w-14 rounded border border-[var(--border)]" />
                          <div className="h-6 w-14 rounded bg-[var(--accent)] opacity-80" />
                        </div>
                      </AnatomyPartHighlight>
                    </div>
                  </AnatomyPartHighlight>
                </div>
              </AnatomyPartHighlight>
            </div>
          }
          parts={parts}
        />
      </ShowcaseSection>

      {/* Basic */}
      <ShowcaseSection title={t('sections.basic.title')} description={t('sections.basic.description')}>
        <ShowcaseDemo
          title="basic"
          code={`const [open, setOpen] = useState(false);\n\n<Button onClick={() => setOpen(true)}>Open dialog</Button>\n<Dialog\n  open={open}\n  onClose={() => setOpen(false)}\n  title="Dialog title"\n  description="A short description."\n>\n  <p>Your content here.</p>\n  <div className="mt-6 flex justify-end">\n    <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>\n  </div>\n</Dialog>`}
        >
          <BasicDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Sizes */}
      <ShowcaseSection title={t('sections.sizes.title')} description={t('sections.sizes.description')}>
        <ShowcaseDemo
          title="sm / md / lg"
          code={`<Dialog size="sm" ...>...</Dialog>\n<Dialog size="md" ...>...</Dialog>\n<Dialog size="lg" ...>...</Dialog>`}
        >
          <div className="flex flex-wrap gap-3">
            <SizeDemo size="sm" label={t('demos.openSm')} />
            <SizeDemo size="md" label={t('demos.openMd')} />
            <SizeDemo size="lg" label={t('demos.openLg')} />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Destructive + No close button side by side */}
      <ShowcaseGrid columns={2}>
        <ShowcaseSection title={t('sections.destructive.title')} description={t('sections.destructive.description')}>
          <ShowcaseDemo
            title="destructive confirm"
            code={`<Dialog\n  open={open}\n  onClose={() => setOpen(false)}\n  title="Delete account"\n  description="This cannot be undone."\n>\n  <div className="mt-2 flex justify-end gap-3">\n    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>\n    <Button variant="destructive" onClick={handleDelete}>Delete account</Button>\n  </div>\n</Dialog>`}
          >
            <DestructiveDemo />
          </ShowcaseDemo>
        </ShowcaseSection>

        <ShowcaseSection title={t('sections.noCloseButton.title')} description={t('sections.noCloseButton.description')}>
          <ShowcaseDemo
            title="hideCloseButton"
            code={`<Dialog\n  open={open}\n  onClose={() => setOpen(false)}\n  title="Terms of service"\n  hideCloseButton\n>\n  <p>Content...</p>\n  <div className="mt-6 flex justify-end gap-3">\n    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>\n    <Button onClick={() => setOpen(false)}>Accept</Button>\n  </div>\n</Dialog>`}
          >
            <NoCloseButtonDemo />
          </ShowcaseDemo>
        </ShowcaseSection>
      </ShowcaseGrid>

      {/* With form */}
      <ShowcaseSection title={t('sections.withForm.title')} description={t('sections.withForm.description')}>
        <ShowcaseDemo
          title="with form (focus trap demo)"
          code={`<Dialog open={open} onClose={() => setOpen(false)} title="Edit profile">\n  <div className="space-y-4">\n    <Input placeholder="Your full name" />\n    <Textarea placeholder="A short bio" rows={3} />\n  </div>\n  <div className="mt-6 flex justify-end gap-3">\n    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>\n    <Button onClick={() => setOpen(false)}>Save changes</Button>\n  </div>\n</Dialog>`}
        >
          <FormDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Keyboard navigation */}
      <ShowcaseSection title={t('sections.keyboard.title')} description={t('sections.keyboard.description')}>
        <div className="overflow-hidden rounded-xl border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--surface-raised)]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-[var(--text-secondary)]">
                  {t('keyboard.key')}
                </th>
                <th className="px-4 py-3 text-left font-medium text-[var(--text-secondary)]">
                  {t('keyboard.action')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {keyboardRows.map((row) => (
                <tr key={row.key} className="bg-[var(--surface)]">
                  <td className="px-4 py-3 font-mono">
                    <Kbd>{row.key}</Kbd>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
