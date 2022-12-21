//@ts-ignore
import { createServer } from 'http-server/lib/http-server';

export type FeatureInfo = {
  icon: string;
  title: string;
  description: string;
  //Function name
  action: string;
  //ExportAPI.Filename
  filename?: string;

  //*Field for browser generate by code,not actually in package.json
  extensionID: string;
  //!Will deprecated
  label: string;
  rightExtra: any[];
};

/**
 * 模块信息接口
 */
export interface ModuleInfo {
  //Unique npm package name
  name: string;
  version: string;
  author: string | { name: 'string' };
  //Entry js file,webRender environment
  main: string;
  // extension description
  description: string;

  //* Postcat extend
  //Entry js file,node environment
  node: string;
  title: string;
  // extension logo
  logo: string;
  //Contribution Feature
  features?: {
    configuration: ModuleConfiguration;
    i18n?: I18nLocale;
    extensionTabView: ExtensionTabView[];
    sidebarView: SidebarView;
    importAPI: FeatureInfo;
    exportAPI: FeatureInfo;
    syncAPI: FeatureInfo;

    //Random feature
    [index: string]: any;
  };

  //*Field for browser generate by code,not actually in package.json
  //Extension intro,from README.md
  introduction: string;
  //file location
  baseDir: string;

  //*Only exist in HTTP request(from extension server) moduleInfo
  i18n: Array<{
    locale: string;
    package: any | object;
  }>;
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

export interface I18nLocale {
  sourceLocale: string;
  locales: string[];
}
