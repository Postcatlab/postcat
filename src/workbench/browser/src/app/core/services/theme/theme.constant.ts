import { ThemeColors } from 'eo/workbench/browser/src/app/core/services/theme/theme.model';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';

import darkDefault from '../../../../extensions/core-themes/themes/dark.json';
import lightDefault from '../../../../extensions/core-themes/themes/light.json';
export const SYSTEM_THEME: SystemThemeItems[] = [
  {
    label: $localize`Light Default`,
    id: 'pc',
    core: true,
    customColors: lightDefault.colors
  },
  {
    label: $localize`Light Blue`,
    id: 'pc-blue',
    baseTheme: 'pc',
    //* relative path
    //src/extensions/core-themes/themes/light-blue.json
    path: './themes/blue.json'
  },
  {
    label: $localize`Light Green`,
    id: 'pc-green',
    baseTheme: 'pc',
    path: './themes/green.json'
  },
  {
    label: $localize`Light Orange`,
    id: 'pc-orange',
    baseTheme: 'pc',
    path: './themes/orange.json'
  },
  {
    label: $localize`Dark Default`,
    id: 'pc-dark',
    core: true,
    customColors: darkDefault.colors
  },
  {
    label: $localize`Dark Blue`,
    id: 'pc-dark-blue',
    baseTheme: 'pc-dark',
    path: './themes/blue.json'
  },
  {
    label: $localize`Dark Green`,
    id: 'pc-dark-green',
    baseTheme: 'pc-dark',
    path: './themes/green.json'
  },
  {
    label: $localize`Dark Orange`,
    id: 'pc-dark-orange',
    baseTheme: 'pc-dark',
    path: './themes/orange.json'
  },
  ...(APP_CONFIG.production
    ? []
    : [
        {
          label: $localize`Debug Theme`,
          id: 'pc-debug',
          baseTheme: 'pc',
          path: './themes/debug.json'
        }
      ])
];
export type SystemThemeItems = {
  label: string;
  id: string;
  /**
   * If custom color is empty, it will be used as default value
   */
  baseTheme?: string;
  /**
   * Core theme can be used as base theme
   */
  core?: boolean;
  /**
   * User custom color
   */
  customColors?: Partial<ThemeColors>;
  /**
   * Theme all color
   */
  colors?: ThemeColors;
  path?: string;
};
export type SystemUIThemeType = (typeof SYSTEM_THEME)[number]['id'];
export const DEFAULT_THEME_COLORS = {
  alertSuccessText: '#2ca641',
  toastSuccessText: '#2ca641',
  progressSuccess: '#52c41a',
  scrollbarTrackBackground: 'rgba(255, 255, 255, 0.05)',
  scrollbarThumbBackground: 'rgba(0, 0, 0, 0.2)',
  switchText: '#fff',
  popoverText: '#fff',
  popoverBackground: 'rgba(0,0,0,.75)',
  modalMaskBackground: 'rgba(0, 0, 0, 0.35)',
  checkboxCheckedBorder: 'transparent',
  buttonPrimaryText: '#fff'
};
