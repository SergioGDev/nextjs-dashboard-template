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
          { type: 'link', label: 'sidebar.items.uiButton', href: routes.ui.buttons },
          { type: 'link', label: 'sidebar.items.uiButtonsGroup', href: routes.ui.buttonsGroup },
          { type: 'link', label: 'sidebar.items.uiInput', href: routes.ui.inputs },
          { type: 'link', label: 'sidebar.items.uiTextarea', href: routes.ui.textarea },
          { type: 'link', label: 'sidebar.items.uiCard', href: routes.ui.card },
          { type: 'link', label: 'sidebar.items.uiBadge', href: routes.ui.badge },
          { type: 'link', label: 'sidebar.items.uiAvatar', href: routes.ui.avatar },
          { type: 'link', label: 'sidebar.items.uiSeparator', href: routes.ui.separator },
          { type: 'link', label: 'sidebar.items.uiKbd', href: routes.ui.kbd },
          { type: 'link', label: 'sidebar.items.uiList', href: routes.ui.list },
          { type: 'link', label: 'sidebar.items.uiSelect', href: routes.ui.select },
          { type: 'link', label: 'sidebar.items.uiCheckbox', href: routes.ui.checkbox },
          { type: 'link', label: 'sidebar.items.uiSwitch', href: routes.ui.switch },
          { type: 'link', label: 'sidebar.items.uiRadioGroup', href: routes.ui.radioGroup },
          { type: 'link', label: 'sidebar.items.uiSlider', href: routes.ui.slider },
          { type: 'link', label: 'sidebar.items.uiTooltip', href: routes.ui.tooltip },
          { type: 'link', label: 'sidebar.items.uiDropdownMenu', href: routes.ui.dropdownMenu },
          { type: 'link', label: 'sidebar.items.uiDialog', href: routes.ui.dialog },
          { type: 'link', label: 'sidebar.items.toasts', href: routes.ui.toasts },
          { type: 'link', label: 'sidebar.items.emptyStates', href: routes.ui.emptyStates },
          { type: 'link', label: 'sidebar.items.errorStates', href: routes.ui.errorStates },
          { type: 'link', label: 'sidebar.items.skeletons', href: routes.ui.skeletons },
          { type: 'link', label: 'sidebar.items.uiSpinner', href: routes.ui.spinner },
          { type: 'link', label: 'sidebar.items.i18n', href: routes.ui.i18n },
          { type: 'link', label: 'sidebar.items.uiForms', href: routes.ui.forms },
          { type: 'link', label: 'sidebar.items.uiTable', href: routes.ui.table },
          { type: 'link', label: 'sidebar.items.uiDataTable', href: routes.ui.dataTable },
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
