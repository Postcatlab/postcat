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
