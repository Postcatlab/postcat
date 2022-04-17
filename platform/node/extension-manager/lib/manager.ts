import { MODULE_DIR as baseDir } from '../../../../shared/common/constant';
import { ModuleHandler } from './handler';
import { CoreHandler } from './core';
import { ModuleHandlerResult, ModuleInfo, ModuleManagerInfo, ModuleManagerInterface, ModuleType } from '../types';
import * as path from 'path';

export class ModuleManager implements ModuleManagerInterface {
  /**
   * 模块管理器
   */
  private readonly moduleHandler: ModuleHandler;

  /**
   * 模块集合
   */
  private readonly modules: Map<string, ModuleInfo>;

  constructor() {
    this.moduleHandler = new ModuleHandler({ baseDir: baseDir });
    this.modules = new Map();
    this.init();
  }

  /**
   * 安装模块，调用npm install | link
   * @param module
   */
  async install(module: ModuleManagerInfo): Promise<ModuleHandlerResult> {
    const result = await this.moduleHandler.install([module.name], module.isLocal || false);
    if (result.code === 0) {
      const moduleInfo: ModuleInfo = this.moduleHandler.info(module.name);
      this.set(moduleInfo);
    }
    return result;
  }

  /**
   * 更新模块，调用npm update
   * @param module
   */
  async update(module: ModuleManagerInfo): Promise<ModuleHandlerResult> {
    const result = await this.moduleHandler.update(module.name);
    if (result.code === 0) {
      this.refresh(module);
    }
    return result;
  }

  /**
   * 删除模块，调用npm uninstall | unlink
   * @param module
   */
  async uninstall(module: ModuleManagerInfo): Promise<ModuleHandlerResult> {
    const moduleInfo: ModuleInfo = this.moduleHandler.info(module.name);
    const result = await this.moduleHandler.uninstall([module.name], module.isLocal || false);
    if (result.code === 0) {
      this.delete(moduleInfo);
    }
    return result;
  }

  /**
   * 读取本地package.json更新模块信息
   * @param module
   */
  refresh(module: ModuleManagerInfo): void {
    const moduleInfo: ModuleInfo = this.moduleHandler.info(module.name);
    this.set(moduleInfo);
  }

  /**
   * 获取应用级app列表
   */
  getAppModuleList(): Array<ModuleInfo> {
    const output: Array<ModuleInfo> = [];
    const modules: Map<string, ModuleInfo> = this.moduleBelongs();
    modules?.forEach((module: ModuleInfo) => {
      if (module.isApp) {
        output.push(module);
      }
    });
    return output;
  }

  /**
   * 获取边栏应用列表
   */
  getSideModuleList(moduleID: string): Array<ModuleInfo> {
    const output: Array<ModuleInfo> = [];
    const modules: Map<string, ModuleInfo> = this.moduleBelongs();
    modules.get(moduleID)?.sideItems?.forEach((_moduleID: string) => {
      if (modules.has(_moduleID)) {
        output.push(modules.get(_moduleID));
      }
    });
    return output;
  }

  /**
   * 获取所有模块列表
   * belongs为true，返回关联子模块集合
   * @param belongs
   */
  getModules(belongs: boolean = false): Map<string, ModuleInfo> {
    if (belongs) {
      return this.moduleBelongs();
    }
    return this.modules;
  }

  /**
   * 获取某个模块信息
   * belongs为true，返回关联子模块集合
   * @param belongs
   */
  getModule(moduleID: string, belongs: boolean = false): ModuleInfo {
    if (belongs) {
      return this.moduleBelongs().get(moduleID);
    }
    return this.modules.get(moduleID);
  }

  /**
   * 设置模块信息到模块列表
   * @param moduleInfo
   */
  private set(moduleInfo: ModuleInfo) {
    // 避免重置
    this.modules.set(moduleInfo.moduleID, moduleInfo);
  }

  /**
   * 清除在模块列表中的信息
   * @param moduleInfo
   */
  private delete(moduleInfo: ModuleInfo) {
    // 避免删除核心
    this.modules.delete(moduleInfo.moduleID);
  }

  /**
   * 读取本地package.json文件得到本地安装的模块列表，依次获取模块信息加入模块列表
   * 待处理：在初始化时加入系统模块的加载
   */
  private init() {
    this.initCore();
    const moduleNames: string[] = this.moduleHandler.list();
    moduleNames.forEach((moduleName: string) => {
      // 这里要加上try catch，避免异常
      const moduleInfo: ModuleInfo = this.moduleHandler.info(moduleName);
      if (moduleInfo.moduleID) {
        this.set(moduleInfo);
      }
    });
  }

  /**
   * 初始化核心模块的加载
   */
  private initCore() {
    const coreDir = path.join(__dirname, '../../../../core');
    const coreHandler = new CoreHandler({ baseDir: coreDir });
    const moduleNames: string[] = coreHandler.list();
    moduleNames.forEach((moduleName: string) => {
      const moduleInfo: ModuleInfo = coreHandler.info(moduleName);
      if (moduleInfo.moduleID) {
        this.set(moduleInfo);
      }
    });
  }

  /**
   * 获取模块到上层模块后的模块列表
   * @returns
   */
  private moduleBelongs(): Map<string, ModuleInfo> {
    const newModules: Map<string, ModuleInfo> = new Map();
    const sideItems = new Map();
    const featureItems = new Map();
    this.modules?.forEach((module: ModuleInfo) => {
      // 如果包含自己则是主应用
      // 后期加入权限限制是否能成为顶层应用
      const belongs: string[] = module.belongs || ['default'];
      module.isApp = belongs.includes(module.moduleID);
      newModules.set(module.moduleID, module);
      belongs.forEach((belong: string) => {
        let _modules: string[];
        if (module.moduleType === ModuleType.app) {
          if (!sideItems.has(belong)) {
            _modules = [];
          } else {
            _modules = sideItems.get(belong);
          }
          // 如果指定上层是自己，自己放最前面
          if (module.moduleID === belong) {
            _modules.unshift(module.moduleID);
          } else {
            _modules.push(module.moduleID);
          }
          sideItems.set(belong, _modules);
        } else if (module.moduleType === ModuleType.feature) {
          if (!featureItems.has(belong)) {
            _modules = [];
          } else {
            _modules = featureItems.get(belong);
          }
          _modules.push(module.moduleID);
          featureItems.set(belong, _modules);
        }
      });
    });
    sideItems?.forEach((value: Array<string>, key: string) => {
      const _current: ModuleInfo = newModules.get(key);
      if (_current.isApp) {
        _current.sideItems = value;
        newModules.set(key, _current);
      }
    });
    featureItems?.forEach((value: Array<string>, key: string) => {
      const _current: ModuleInfo = newModules.get(key);
      _current.featureItems = value;
      newModules.set(key, _current);
    });

    return newModules;
  }
}

export default () => new ModuleManager();
