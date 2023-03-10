//@ts-ignore
import { createServer } from 'http-server/lib/http-server';

import { ThemeColors } from '../../../core/services/theme/theme.model';
type ThemeItems = {
  label: string;
  id: string;
  baseTheme: string;
  colors?: Partial<ThemeColors>;
};
export type FeatureInfo = {
  icon: string;
  label: string;
  description: string;
  //Function name
  action: string;
  configuration?: Record<string, any>;

  //ExportAPI.Filename
  filename?: string;

  //theme
  theme: ThemeItems[];
  //*Field for browser generate by code,not actually in package.json
  extensionID: string;
  rightExtra: any[];
};

export type I18nLocale = {
  locale: string;
  package: any | object;
};

/**
 * 模块信息接口
 */
export interface ExtensionInfo {
  //Unique npm package name
  name: string;
  version: string;
  browser: string;
  author: string | { name: 'string' };
  //Entry js file,webRender environment
  main: string;
  // extension description
  description: string;

  //* Postcat extend
  //Entry js file,node environment
  node: string;
  title: string;
  downloadCounts: number;
  // extension logo
  logo: string;
  //Contribution Feature
  features?: {
    apiPreviewTab: any;
    configuration: ModuleConfiguration;
    i18n?: FeatureI18nLocale;
    extensionTabView: ExtensionTabView[];
    sidebarView: SidebarView;
    importAPI: FeatureInfo;
    exportAPI: FeatureInfo;
    pushAPI: FeatureInfo;
    theme: ThemeItems[];
    //Random feature
    [index: string]: any;
    /**
     * @deprecated
     */
    syncAPI: FeatureInfo;
    pullAPI: FeatureInfo;
  };

  //*Field for browser generate by code,not actually in package.json
  //Extension intro,from README.md
  introduction: string;
  //file location
  baseDir: string;
  //Is open
  enable?: boolean;

  //*Only exist in HTTP request(from extension server) moduleInfo
  i18n: I18nLocale[];
}

/**
 * 模块配置项接口
 */
interface ModuleConfiguration {
  title: string;
  properties: {
    [index: string]: ModuleConfigurationField;
  };
}

/**
 * 模块配置项目字段接口
 */
interface ModuleConfigurationField {
  type: string | string[];
  default: string | number | null;
  label: string;
  description?: string;
  required?: boolean;
}
export type ExtensionTabView = SidebarView;

type HttpServer = ReturnType<typeof createServer>;
export type SidebarView = {
  icon: string;
  name: string;
  /** uniqueKey */
  key: string;
  title: string;
  url: string;
  debugUrl: string;
  extensionID: string;
  server?: HttpServer;
};

export interface FeatureI18nLocale {
  sourceLocale: string;
  locales: string[];
}
