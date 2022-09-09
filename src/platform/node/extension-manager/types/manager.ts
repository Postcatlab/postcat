import { SidePosition } from 'eo/shared/common/bounds';
import { ModuleHandlerResult } from './handler';

/**
 * 模块类型
 * system 系统模块
 * app 应用模块
 * ui 页面模块
 * feature 功能模块
 */
export enum ModuleType {
  system = 'system',
  app = 'app',
  feature = 'feature',
}
export interface I18nLocale {
  locale: string;
  package: any;
}
/**
 * 模块信息接口
 */
export interface ModuleInfo {
  // npm package name
  name: string;
  // author
  author: string;
  // extension version
  version: string;
  // extension description
  description: string;
  // extension intro,from README.md
  introduction: string;
  // extension ID
  moduleID: string;
  // extension name
  moduleName: string;
  // extension type
  //!TODO what usage
  moduleType: ModuleType;
  // extension logo
  logo: string;
  // manifest code file
  main: string;
  // main node script
  main_node?: string;
  // 入口开发调试
  main_debug?: string;
  // inject script before start app
  preload?: string;
  // 判断是不是顶层App
  //!TODO use feature contribution to control page
  isApp?: boolean;

  // 模块对应上层模块ID
  //!TODO what usage?
  belongs?: Array<string>;
  // 下层关联模块ID集合
  //!TODO what usage?
  sideItems?: Array<string>;
  // 模块路径
  baseDir?: string;
  // 配置项
  configuration?: ModuleConfiguration;
  /** 贡献点 */
  contributes: ModuleContributes;
  // 功能点配置
  features?: {
    [index: string]: any;
  };
  i18n?: I18nLocale[];
}
/**
 * 贡献点
 */

export type ModuleContributes = {
  configuration: ModuleConfiguration;
};

/**
 * 模块配置项接口
 */
export interface ModuleConfiguration {
  title: string;
  properties: {
    [index: string]: ModuleConfigurationField;
  };
}

/**
 * 模块配置项目字段接口
 */
export interface ModuleConfigurationField {
  type: string | Array<string>;
  default: string | number | null;
  label: string;
  description?: string;
  required?: boolean;
}

/**
 * 模块管理信息
 * name 模块名称
 * isLocal 是否本地模块 (本地调用link, unlink安装与卸载)
 */
export interface ModuleManagerInfo {
  name: string;
  isLocal?: boolean;
}

/**
 * 模块管理
 * install 安装模块
 * uninstall 卸载模块
 * refresh 重新从本地读取并更新模块信息
 * getModules 获取所有模块列表，或返回有模块关联子模块的信息
 */
export interface ModuleManagerInterface {
  installExt: any;
  install: (module: ModuleManagerInfo) => Promise<ModuleHandlerResult>;
  uninstall: (module: ModuleManagerInfo) => Promise<ModuleHandlerResult>;
  refresh: (module: ModuleManagerInfo) => void;
  refreshAll: () => void;
  getModule: (moduleID: string, belongs?: boolean) => ModuleInfo;
  getModules: (belongs?: boolean) => Map<string, ModuleInfo>;
  getAppModuleList: () => Array<ModuleInfo>;
  getSideModuleList: (moduleID: string) => Array<ModuleInfo>;
  getFeature: (featureKey: string) => Map<string, object>;
  getFeatures: () => Map<string, Map<string, object>>;
}
