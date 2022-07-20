import extenstionSettings from './extenstion-settings.json';

export type eoapiSettingsKey = keyof typeof eoapiSettings;

export const eoapiSettings = {
  /** 功能设置 */
  'eoapi-extensions': extenstionSettings,
} as const;

export default eoapiSettings;
