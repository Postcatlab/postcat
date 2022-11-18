import { ModuleInfo } from 'eo/platform/node/extension-manager/types';

/**
 * 模块管理器配置
 * baseDir 模块安装目录
 * registry 模块下载源（NPM源）
 * proxy 代理服务器
 */
export interface ModuleHandlerOptions {
  baseDir: string;
  registry?: string;
  proxy?: string;
}

/**
 * 模块管理命令执行结果.
 */
export interface ModuleHandlerResult {
  code: number;
  data: string;
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
  getSidebarView(extName: any): any;
  getSidebarViews(extName: any): any;
  getExtTabs(extName: any): any;
  installExt: any;
  install: (module: ModuleManagerInfo) => Promise<ModuleHandlerResult>;
  uninstall: (module: ModuleManagerInfo) => Promise<ModuleHandlerResult>;
  refresh: (module: ModuleManagerInfo) => void;
  refreshAll: () => void;
  getModule: (id: string) => ModuleInfo;
  getModules: () => Map<string, ModuleInfo>;
  getFeature: (featureKey: string) => Map<string, object>;
  getFeatures: () => Map<string, Map<string, object>>;
}
