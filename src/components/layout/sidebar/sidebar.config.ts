import {
  LayoutDashboard,
  BarChart2,
  FileText,
  Users,
  Settings,
  Sparkles,
  Layers,
  PanelLeft,
  Palette,
} from 'lucide-react';
import { routes } from '@config/routes';
import type { SidebarConfig } from './sidebar.types';

export const sidebarConfig: SidebarConfig = [
  {
    id: 'workspace',
    title: 'sidebar.sections.workspace',
    items: [
      { type: 'link', label: 'sidebar.items.dashboard', href: routes.dashboard, icon: LayoutDashboard },
      { type: 'link', label: 'sidebar.items.analytics', href: routes.analytics, icon: BarChart2 },
      {
        type: 'group',
        label: 'sidebar.items.reports',
        icon: FileText,
        children: [
          { type: 'link', label: 'sidebar.items.reportsOverview', href: routes.reports.overview, exact: true },
          { type: 'link', label: 'sidebar.items.reportsScheduled', href: routes.reports.scheduled },
          { type: 'link', label: 'sidebar.items.reportsArchived', href: routes.reports.archived },
        ],
      },
      { type: 'link', label: 'sidebar.items.users', href: routes.users.list, icon: Users },
      { type: 'link', label: 'sidebar.items.settings', href: routes.settings, icon: Settings },
    ],
  },
  {
    id: 'ui',
    title: 'sidebar.sections.ui',
    items: [
      { type: 'link', label: 'sidebar.items.uiOverview', href: routes.ui.overview, icon: Sparkles, exact: true },
      { type: 'link', label: 'sidebar.items.uiFoundations', href: routes.ui.foundations, icon: Palette },
      {
        type: 'group',
        label: 'sidebar.items.uiComponents',
        icon: Layers,
        children: [
          { type: 'link', label: 'sidebar.items.toasts', href: routes.ui.toasts },
          { type: 'link', label: 'sidebar.items.emptyStates', href: routes.ui.emptyStates },
          { type: 'link', label: 'sidebar.items.errorStates', href: routes.ui.errorStates },
          { type: 'link', label: 'sidebar.items.skeletons', href: routes.ui.skeletons },
          { type: 'link', label: 'sidebar.items.i18n', href: routes.ui.i18n },
        ],
      },
      {
        type: 'group',
        label: 'sidebar.items.uiLayout',
        icon: PanelLeft,
        children: [
          { type: 'link', label: 'sidebar.items.uiSidebar', href: routes.ui.sidebar },
        ],
      },
    ],
  },
];
