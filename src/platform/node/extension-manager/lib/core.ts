import * as path from 'path';
import { ModuleHandlerOptions, ModuleInfo } from '../types';
import { fileExists, readJson } from '../../../../shared/node/file';
import { isNotEmpty } from '../../../../shared/common/common';

/**
 * 核心模块管理器
 * @class CoreHandler
 */
export class CoreHandler {
  /**
   * 模块安装包文件
   */
  readonly baseDir: string;

  constructor(options: ModuleHandlerOptions) {
    this.baseDir = options.baseDir;
    this.checkPackageJson();
  }

  /**
   * 检查package.json
   */
  checkPackageJson(): void {
    const packageJsonFile: string = path.join(this.baseDir, 'package.json');
    if (!fileExists(packageJsonFile)) {
      throw new Error(`Package file [${packageJsonFile}] does not exist.`);
    }
  }

  /**
   * 获取模块package.json信息
   * @param {string} name 模块名称
   */
  info(name: string): ModuleInfo {
    let moduleInfo: ModuleInfo;
    try {
      const baseDir: string = this.getModuleDir(name);
      moduleInfo = readJson(path.join(baseDir, 'package.json')) as ModuleInfo;
      moduleInfo.baseDir = baseDir;
      moduleInfo.main = 'file://' + path.join(moduleInfo.baseDir, moduleInfo.main);
      if (moduleInfo.preload?.length > 0) {
        moduleInfo.preload = path.join(moduleInfo.baseDir, moduleInfo.preload);
      }
      if (moduleInfo.main_node?.length > 0) {
        moduleInfo.main_node = path.join(moduleInfo.baseDir, moduleInfo.main_node);
      }
      if (moduleInfo.logo?.length > 0 && !moduleInfo.logo.startsWith('http') && !moduleInfo.logo.includes('icon-')) {
        moduleInfo.logo = 'file://' + path.join(moduleInfo.baseDir, moduleInfo.logo);
      }
      if (!moduleInfo.belongs || !isNotEmpty(moduleInfo.belongs)) {
        moduleInfo.belongs = ['default'];
      }
    } catch (e) {
      moduleInfo = {} as ModuleInfo;
    }
    const { author } = moduleInfo;
    if (typeof author === 'string') {
      return moduleInfo;
    }
    const { name: authorName } = author;
    return { ...moduleInfo, author: authorName };
  }

  /**
   * 获取模块目录
   * @param name
   * @returns
   */
  getModuleDir(name: string): string {
    return path.join(this.baseDir, name, 'browser');
  }

  /**
   * 获取已安装模块列表
   */
  list(): string[] {
    let modules: string[] = [];
    const packageInfo = readJson(path.join(this.baseDir, 'package.json'));
    if (packageInfo) {
      // @ts-ignore
      modules = Object.keys(packageInfo.dependencies || {});
    }
    return modules;
  }
}
