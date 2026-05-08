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
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@components/ui/dropdown-menu';
import { Button } from '@components/ui/button';
import { Kbd } from '@components/ui/kbd';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc, AnatomyPart } from '@features/ui-showcase';

export function DropdownMenuContent() {
  const t = useTranslations('dropdownMenu');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const anatomyParts: AnatomyPart[] = [
    { name: 'trigger', type: 'ReactNode', required: true, description: t('anatomy.parts.trigger') },
    { name: 'menu', type: 'div[role=menu]', required: true, description: t('anatomy.parts.menu') },
    { name: 'item', type: 'button[role=menuitem]', required: false, description: t('anatomy.parts.item') },
    { name: 'separator', type: 'div[role=separator]', required: false, description: t('anatomy.parts.separator') },
    { name: 'label', type: 'div', required: false, description: t('anatomy.parts.label') },
  ];

  const menuProps: PropDoc[] = [
    { prop: 'trigger', type: 'ReactNode', required: true, description: t('props.menu.trigger') },
    { prop: 'align', type: "'left' | 'right'", default: "'left'", description: t('props.menu.align') },
    { prop: 'open', type: 'boolean', description: t('props.menu.open') },
    { prop: 'onOpenChange', type: '(open: boolean) => void', description: t('props.menu.onOpenChange') },
    { prop: 'className', type: 'string', description: t('props.menu.className') },
  ];

  const itemProps: PropDoc[] = [
    { prop: 'onClick', type: '() => void', description: t('props.item.onClick') },
    { prop: 'destructive', type: 'boolean', default: 'false', description: t('props.item.destructive') },
    { prop: 'disabled', type: 'boolean', default: 'false', description: t('props.item.disabled') },
    { prop: 'className', type: 'string', description: t('props.item.className') },
  ];

  const keyboardRows = [
    { key: t('keyboard.arrowDown'), action: t('keyboard.arrowDownDesc') },
    { key: t('keyboard.arrowUp'), action: t('keyboard.arrowUpDesc') },
    { key: t('keyboard.home'), action: t('keyboard.homeDesc') },
    { key: t('keyboard.end'), action: t('keyboard.endDesc') },
    { key: t('keyboard.enterSpace'), action: t('keyboard.enterSpaceDesc') },
    { key: t('keyboard.escape'), action: t('keyboard.escapeDesc') },
    { key: t('keyboard.tab'), action: t('keyboard.tabDesc') },
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
            <code>{`import {\n  DropdownMenu,\n  DropdownMenuItem,\n  DropdownMenuSeparator,\n  DropdownMenuLabel,\n} from '@components/ui/dropdown-menu';`}</code>
          </pre>
        </div>
      </div>

      {/* Anatomy */}
      <ShowcaseSection title={t('anatomy.title')} description={t('anatomy.description')}>
        <Anatomy
          render={
            <div className="flex items-start gap-6">
              <AnatomyPartHighlight label="trigger">
                <button className="px-3 py-1.5 rounded-md text-sm font-medium bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-primary)]">
                  {t('demos.openMenu')}
                </button>
              </AnatomyPartHighlight>
              <AnatomyPartHighlight label="menu">
                <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] py-1 min-w-[9rem]">
                  <AnatomyPartHighlight label="label">
                    <div className="px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                      {t('demos.actions')}
                    </div>
                  </AnatomyPartHighlight>
                  <AnatomyPartHighlight label="item">
                    <div className="px-3 py-1.5 text-sm text-[var(--text-primary)]">{t('demos.edit')}</div>
                  </AnatomyPartHighlight>
                  <AnatomyPartHighlight label="separator">
                    <div className="h-px bg-[var(--border)] mx-0 my-1" />
                  </AnatomyPartHighlight>
                  <AnatomyPartHighlight label="item (destructive)">
                    <div className="px-3 py-1.5 text-sm text-[var(--error)]">{t('demos.delete')}</div>
                  </AnatomyPartHighlight>
                </div>
              </AnatomyPartHighlight>
            </div>
          }
          parts={anatomyParts}
        />
      </ShowcaseSection>

      {/* Basic example */}
      <ShowcaseSection title={t('sections.basic.title')} description={t('sections.basic.description')}>
        <ShowcaseDemo
          title="basic"
          code={`<DropdownMenu trigger={<Button>Open menu</Button>}>\n  <DropdownMenuItem>Profile</DropdownMenuItem>\n  <DropdownMenuItem>Settings</DropdownMenuItem>\n  <DropdownMenuItem>Help</DropdownMenuItem>\n  <DropdownMenuSeparator />\n  <DropdownMenuItem>Sign out</DropdownMenuItem>\n</DropdownMenu>`}
        >
          <DropdownMenu trigger={<Button variant="secondary">{t('demos.openMenu')}</Button>}>
            <DropdownMenuItem>{t('demos.profile')}</DropdownMenuItem>
            <DropdownMenuItem>{t('demos.settings')}</DropdownMenuItem>
            <DropdownMenuItem>{t('demos.help')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('demos.signOut')}</DropdownMenuItem>
          </DropdownMenu>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* With sections */}
      <ShowcaseSection title={t('sections.withSections.title')} description={t('sections.withSections.description')}>
        <ShowcaseDemo
          title="with sections"
          code={`<DropdownMenu trigger={<Button>Open menu</Button>}>\n  <DropdownMenuLabel>Recent files</DropdownMenuLabel>\n  <DropdownMenuItem>New file</DropdownMenuItem>\n  <DropdownMenuItem>Open file</DropdownMenuItem>\n  <DropdownMenuItem>Save file</DropdownMenuItem>\n  <DropdownMenuSeparator />\n  <DropdownMenuLabel>Actions</DropdownMenuLabel>\n  <DropdownMenuItem>Edit</DropdownMenuItem>\n  <DropdownMenuItem>Duplicate</DropdownMenuItem>\n  <DropdownMenuItem>Archive</DropdownMenuItem>\n</DropdownMenu>`}
        >
          <DropdownMenu trigger={<Button variant="secondary">{t('demos.openMenu')}</Button>}>
            <DropdownMenuLabel>{t('demos.recentFiles')}</DropdownMenuLabel>
            <DropdownMenuItem>{t('demos.newFile')}</DropdownMenuItem>
            <DropdownMenuItem>{t('demos.openFile')}</DropdownMenuItem>
            <DropdownMenuItem>{t('demos.saveFile')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>{t('demos.actions')}</DropdownMenuLabel>
            <DropdownMenuItem>{t('demos.edit')}</DropdownMenuItem>
            <DropdownMenuItem>{t('demos.duplicate')}</DropdownMenuItem>
            <DropdownMenuItem>{t('demos.archive')}</DropdownMenuItem>
          </DropdownMenu>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Destructive + Disabled side by side */}
      <ShowcaseGrid columns={2}>
        <ShowcaseSection title={t('sections.destructive.title')} description={t('sections.destructive.description')}>
          <ShowcaseDemo
            title="destructive"
            code={`<DropdownMenu trigger={<Button>Open menu</Button>}>\n  <DropdownMenuItem>Rename</DropdownMenuItem>\n  <DropdownMenuItem>Share</DropdownMenuItem>\n  <DropdownMenuSeparator />\n  <DropdownMenuLabel>Danger zone</DropdownMenuLabel>\n  <DropdownMenuItem destructive>Delete item</DropdownMenuItem>\n</DropdownMenu>`}
          >
            <DropdownMenu trigger={<Button variant="secondary">{t('demos.openMenu')}</Button>}>
              <DropdownMenuItem>{t('demos.rename')}</DropdownMenuItem>
              <DropdownMenuItem>{t('demos.share')}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>{t('demos.danger')}</DropdownMenuLabel>
              <DropdownMenuItem destructive>{t('demos.delete')}</DropdownMenuItem>
            </DropdownMenu>
          </ShowcaseDemo>
        </ShowcaseSection>

        <ShowcaseSection title={t('sections.disabled.title')} description={t('sections.disabled.description')}>
          <ShowcaseDemo
            title="disabled item"
            code={`<DropdownMenu trigger={<Button>Open menu</Button>}>\n  <DropdownMenuItem>Edit</DropdownMenuItem>\n  <DropdownMenuItem disabled>Disabled action</DropdownMenuItem>\n  <DropdownMenuItem>Copy link</DropdownMenuItem>\n</DropdownMenu>`}
          >
            <DropdownMenu trigger={<Button variant="secondary">{t('demos.openMenu')}</Button>}>
              <DropdownMenuItem>{t('demos.edit')}</DropdownMenuItem>
              <DropdownMenuItem disabled>{t('demos.disabledItem')}</DropdownMenuItem>
              <DropdownMenuItem>{t('demos.copyLink')}</DropdownMenuItem>
            </DropdownMenu>
          </ShowcaseDemo>
        </ShowcaseSection>
      </ShowcaseGrid>

      {/* Align right */}
      <ShowcaseSection title={t('sections.alignRight.title')} description={t('sections.alignRight.description')}>
        <ShowcaseDemo
          title="align=right"
          code={`<DropdownMenu trigger={<Button>Aligned right</Button>} align="right">\n  <DropdownMenuItem>Profile</DropdownMenuItem>\n  <DropdownMenuItem>Settings</DropdownMenuItem>\n  <DropdownMenuSeparator />\n  <DropdownMenuItem>Sign out</DropdownMenuItem>\n</DropdownMenu>`}
        >
          <div className="flex justify-end">
            <DropdownMenu trigger={<Button variant="secondary">{t('demos.openMenuRight')}</Button>} align="right">
              <DropdownMenuItem>{t('demos.profile')}</DropdownMenuItem>
              <DropdownMenuItem>{t('demos.settings')}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{t('demos.signOut')}</DropdownMenuItem>
            </DropdownMenu>
          </div>
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

      {/* Props — DropdownMenu */}
      <ShowcaseSection title={t('sections.props.title')} description={t('sections.props.description')}>
        <p className="mb-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">DropdownMenu</p>
        <PropsTable rows={menuProps} />
        <p className="mt-6 mb-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">DropdownMenuItem</p>
        <PropsTable rows={itemProps} />
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
