/**
 * 模块加载接口.
 */
export interface ModuleLoaderInterface {
  loadModules: (modules: Array<ModuleInfo>) => void;
  loadModule: (module: ModuleInfo) => void;
}

/**
 * 模块运行环境
 */
export enum ModuleRuntime {
  main = 'main',
  render = 'render',
  web = 'web'
}

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
  ui = 'ui',
  feature = 'feature'
}

/**
 * 模块信息接口
 */
export interface ModuleInfo {
  // 模块名称, npm包名
  name: string;
  // 作者
  author: string;
  // 版本
  version: string;
  // 模块描述
  description: string;
  // 模块ID，用于关联
  moduleID: string;
  // 模块名称，用于显示
  moduleName: string;
  // 模块类型
  type: ModuleType;
  // 模块Logo
  logo: string;
  // 入口文件
  main: string;
  // 预加载js文件
  preload?: string;
  // web运行支持
  web?: boolean;
  // 模块对应上层模块ID
  belongs?: Array<string>;
  // 下层关联模块ID集合
  subModules?: Array<string>;
  // 模块路径
  baseDir?: string;
}
