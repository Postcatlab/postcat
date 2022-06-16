import commonSettings from './common-settings.json';
import extenstionSettings from './extenstion-settings.json';
import featureSettings from './feature-settings.json';
import themeSettings from './theme-settings.json';
import about from './about.json';

export type eoapiSettingsKey = keyof typeof eoapiSettings;

export const eoapiSettings = {
  /** 通用设置 */
  'eoapi-common': commonSettings,
  /** 功能设置 */
  'eoapi-extensions': extenstionSettings,
  /** 插件配置 */
  'eoapi-features': featureSettings,
  /** 主题配置 */
  'eoapi-theme': themeSettings,
  /** 关于 */
  'eoapi-about': about,
} as const;

export default eoapiSettings;
