import { MODULE_DIR as baseDir } from '../../common/constant/main';
import { ModuleHandler } from './handler';
import { ModuleInfo, ModuleManagerInfo, ModuleManagerInterface, ModuleType } from '../types';
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
    this.moduleHandler = new ModuleHandler({baseDir: baseDir});
    this.modules = new Map();
    this.init();
  }

  /**
   * 安装模块，调用npm install | link
   * @param module
   */
  async install(module: ModuleManagerInfo): Promise<void> {
    await this.moduleHandler.install([module.name], module.isLocal || false);
    const moduleInfo: ModuleInfo = this.moduleHandler.info(module.name);
    this.set(moduleInfo);
  }

  /**
   * 更新模块，调用npm update
   * @param module
   */
  async update(module: ModuleManagerInfo): Promise<void> {
    await this.moduleHandler.update(module.name);
    this.refresh(module);
  }

  /**
   * 删除模块，调用npm uninstall | unlink
   * @param module
   */
  async uninstall(module: ModuleManagerInfo): Promise<void> {
    const moduleInfo: ModuleInfo = this.moduleHandler.info(module.name);
    await this.moduleHandler.uninstall([module.name], module.isLocal || false);
    this.delete(moduleInfo);
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
  getSlideModuleList(moduleID: string): Array<ModuleInfo> {
    const output: Array<ModuleInfo> = [];
    const modules: Map<string, ModuleInfo> = this.moduleBelongs();
    modules.get(moduleID).slideItems?.forEach((_moduleID: string) => {
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
  getModules(belongs?: boolean): Map<string, ModuleInfo> {
    belongs = belongs || false;
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
  getModule(moduleID: string, belongs?: boolean): ModuleInfo {
    belongs = belongs || false;
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
    this.modules.set(moduleInfo.moduleID, moduleInfo);
  }

  /**
   * 清除在模块列表中的信息
   * @param moduleInfo
   */
  private delete(moduleInfo: ModuleInfo) {
    this.modules.delete(moduleInfo.moduleID);
  }

  /**
   * 读取本地package.json文件得到本地安装的模块列表，依次获取模块信息加入模块列表
   * 待处理：在初始化时加入系统模块的加载
   */
  private init() {
    const moduleNames: string[] = this.moduleHandler.list();
    moduleNames.forEach((moduleName: string) => {
      // 这里要加上try catch，避免异常
      const moduleInfo: ModuleInfo = this.moduleHandler.info(moduleName);
      this.set(moduleInfo);
    });
  }

  /**
   * 获取模块到上层模块后的模块列表
   * @param module
   */
  private moduleBelongs(): Map<string, ModuleInfo> {
    const newModules: Map<string, ModuleInfo> = new Map();
    const slideItems = new Map();
    const featureItems = new Map();
    // 绑定默认
    const defaultModule: ModuleInfo = {
      name: 'default',
      author: 'system',
      version: '1.0.0',
      description: '系统默认模块',
      moduleID: 'default',
      moduleName: 'API',
      type: ModuleType.app,
      isApp: true,
      logo: path.join(__dirname, '../../../../dist/assets/images/icon.png'),
      main: path.join(__dirname, '../../../../dist/index.html'),
    };
    // 加入系统默认模块做关联
    newModules.set(defaultModule.moduleID, defaultModule);
    slideItems.set(defaultModule.moduleID, [defaultModule.moduleID]);
    this.modules?.forEach((module: ModuleInfo) => {
      const belongs: string[] = module.belongs || [defaultModule.moduleID];
      // 如果包含自己则是主应用
      // 后期加入权限限制是否能成为顶层应用
      module.isApp = belongs.includes(module.moduleID);
      newModules.set(module.moduleID, module);
      belongs.forEach((belong: string) => {
        let _modules: string[];
        if (module.type === ModuleType.app) {
          if (!slideItems.has(belong)) {
            _modules = [];
          } else {
            _modules = slideItems.get(belong);
          }
          // 如果指定上层是自己，自己放最前面
          if (module.moduleID === belong) {
            _modules.unshift(module.moduleID);
          } else {
            _modules.push(module.moduleID);
          }
          slideItems.set(belong, _modules);
        } else if (module.type === ModuleType.feature) {
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
    slideItems?.forEach((value: Array<string>, key: string) => {
      const _current: ModuleInfo = newModules.get(key);
      if (_current.isApp) {
        _current.slideItems = value;
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
