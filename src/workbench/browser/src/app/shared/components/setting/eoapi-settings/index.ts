import commonSettings from './common-settings.json';
import extensitonSettings from './extensiton-settings.json';
import featureSettings from './feature-settings.json';
import themeSettings from './theme-settings.json';
import about from './about.json';

export type eoapiSettingsKey = keyof typeof eoapiSettings;

export const eoapiSettings = {
  /** 通用设置 */
  'Eoapi-Common': commonSettings,
  /** 功能设置 */
  'Eoapi-Extensions': extensitonSettings,
  /** 扩展配置 */
  'Eoapi-Features': featureSettings,
  /** 主题配置 */
  'Eoapi-theme': themeSettings,
  /** 关于 */
  'Eoapi-about': about,
} as const;

export default eoapiSettings;
