import { ThemeColors } from 'eo/workbench/browser/src/app/core/services/theme/theme.model';

import darkDefault from '../../../../extensions/core-themes/themes/dark.json';
import lightDefault from '../../../../extensions/core-themes/themes/light.json';
export const SYSTEM_THEME: Array<{
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
}> = [
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
  }
];
export type SystemUIThemeType = typeof SYSTEM_THEME[number]['id'];
