import { ThemeColors } from 'pc/browser/src/app/core/services/theme/theme.model';
import { APP_CONFIG } from 'pc/browser/src/environments/environment';

import darkDefault from '../../../../extensions/themes/dark.json';
import lightDefault from '../../../../extensions/themes/light.json';
const debugTheme = {
  label: $localize`Debug Theme`,
  id: 'pc-debug',
  baseTheme: 'pc',
  path: 'debug.json'
};
/**
 * Color value,set default value
 */
export const DEFAULT_THEME_COLORS = {
  progressSuccess: '#52c41a',
  switchText: '#fff',
  modalMaskBackground: 'rgba(0, 0, 0, 0.35)',
  buttonPrimaryText: '#fff',
  checkboxInner: '#fff'
};

/**
 * Color rule,generate default value
 */
const DEFAULT_THEME_RULE = {
  shadow: '#d9d9d9',
  success: '#2ca641',
  warning: '#ed6a0c',
  danger: '#ff3c32',
  info: '#2878ff'
};
export const SYSTEM_THEME: SystemThemeItems[] = [
  {
    label: $localize`Light Default`,
    id: 'pc',
    core: true,
    customColors: { ...DEFAULT_THEME_RULE, ...lightDefault.colors }
  },
  {
    label: $localize`Light Blue`,
    id: 'pc-blue',
    baseTheme: 'pc',
    path: 'blue.json'
  },
  {
    label: $localize`Light Green`,
    id: 'pc-green',
    baseTheme: 'pc',
    path: 'green.json'
  },
  {
    label: $localize`Light Orange`,
    id: 'pc-orange',
    baseTheme: 'pc',
    path: 'orange.json'
  },
  {
    label: $localize`Dark Default`,
    id: 'pc-dark',
    core: true,
    customColors: { ...DEFAULT_THEME_RULE, ...darkDefault.colors }
  },
  {
    label: $localize`Dark Blue`,
    id: 'pc-dark-blue',
    baseTheme: 'pc-dark',
    path: 'blue.json'
  },
  {
    label: $localize`Dark Green`,
    id: 'pc-dark-green',
    baseTheme: 'pc-dark',
    path: 'green.json'
  },
  {
    label: $localize`Dark Orange`,
    id: 'pc-dark-orange',
    baseTheme: 'pc-dark',
    path: 'orange.json'
  },
  ...(APP_CONFIG.production ? [] : [debugTheme])
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
  isExtension?: boolean;
};
export type SystemUIThemeType = (typeof SYSTEM_THEME)[number]['id'];
