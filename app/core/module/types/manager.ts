import { SlidePosition } from '../../common/util';

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
  // 判断是不是顶层App
  isApp?: boolean;
  // web运行支持
  web?: boolean;
  // 模块对应上层模块ID
  belongs?: Array<string>;
  // 下层关联模块ID集合
  slideItems?: Array<string>;
  // 下层功能模块ID集合
  featureItems?: Array<string>;
  // 模块路径
  baseDir?: string;
  // 边栏显示
  slidePosition?: SlidePosition;
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
  install: (module: ModuleManagerInfo) => Promise<void>;
  uninstall: (module: ModuleManagerInfo) => Promise<void>;
  refresh: (module: ModuleManagerInfo) => void;
  getModule: (moduleID: string, belongs?: boolean) => ModuleInfo;
  getModules: (belongs?: boolean) => Map<string, ModuleInfo>;
  getAppModuleList: () => Array<ModuleInfo>;
  getSlideModuleList: (moduleID: string) => Array<ModuleInfo>;
}
