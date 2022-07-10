import { MODULE_DIR as baseDir } from 'eo/shared/electron-main/constant';
import { ModuleHandler } from './handler';
import { ModuleHandlerResult, ModuleInfo, ModuleManagerInfo, ModuleManagerInterface, ModuleType } from '../types';
import { isNotEmpty } from 'eo/shared/common/common';
import { processEnv } from '../../constant';

// * npm pkg name
const installExtension = [{ name: 'eoapi-export-openapi' }, { name: 'eoapi-import-openapi' }];
export class ModuleManager implements ModuleManagerInterface {
  /**
   * 模块管理器
   */
  private readonly moduleHandler: ModuleHandler;

  /**
   * extension list
   */
  private readonly installExtension = installExtension;

  /**
   * 模块集合
   */
  private readonly modules: Map<string, ModuleInfo>;

  /**
   * 功能点集合
   */
  private readonly features: Map<string, Map<string, object>>;

  constructor() {
    this.moduleHandler = new ModuleHandler({ baseDir: baseDir });
    this.modules = new Map();
    this.features = new Map();
    this.init();
    this.updateAll();
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
  updateAll() {
    // * ModuleManager will be new only one while app run start, so it should be here upgrade & install extension
    // * Upgrade
    const list = Array.from(this.getModules().values()).map((val) => val.name);
    list.forEach((item) => {
      //!Warn this is bug,it did't work @kungfuboy
      this.update({ name: item });
    });
    // * Install default extension
    this.installExtension.forEach((item) => {
      // * If the extension already in local extension list, then do not repeat installation
      if (list.includes(item.name)) return;
      //!TODO  this will reinstall all package, npm link(debug) package will be remove after npm install command,
      // this.install(item);
    });
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
   * 读取本地package.json更新模块信息
   * @param module
   */
  refreshAll(): void {
    const list = Array.from(this.getModules().values());
    list.forEach((module) => {
      this.refresh(module);
    });
  }
  /**
   * 获取应用级app列表
   */
  getAppModuleList(): Array<ModuleInfo> {
    const output: Array<ModuleInfo> = [];
    const modules: Map<string, ModuleInfo> = this.moduleBelongs();
    modules?.forEach((module: ModuleInfo) => {
      if (module.isApp) {
        (module.main = processEnv === 'development' && module.main_debug ? module.main_debug : module.main),
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
   * 获取所有功能点列表
   * @returns
   */
  getFeatures(): Map<string, Map<string, object>> {
    return this.features;
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
   * 获取某个功能点的集合
   * @param featureKey
   * @returns
   */
  getFeature(featureKey: string): Map<string, object> {
    return this.features.get(featureKey);
  }

  /**
   * 设置模块信息到模块列表
   * @param moduleInfo
   */
  private set(moduleInfo: ModuleInfo) {
    // 避免重置
    this.modules.set(moduleInfo.moduleID, moduleInfo);
    this.setFeatures(moduleInfo);
  }

  /**
   * 解析模块的功能点加入功能点集合
   * @param moduleInfo
   */
  private setFeatures(moduleInfo: ModuleInfo) {
    if (moduleInfo.features && typeof moduleInfo.features === 'object' && isNotEmpty(moduleInfo.features)) {
      Object.entries(moduleInfo.features).forEach(([key, value]) => {
        if (!this.features.has(key)) {
          this.features.set(key, new Map());
        }
        this.features.get(key).set(moduleInfo.moduleID, value);
      });
    }
  }

  /**
   * 清除在模块列表中的信息
   * @param moduleInfo
   */
  private delete(moduleInfo: ModuleInfo) {
    // 避免删除核心
    this.modules.delete(moduleInfo.moduleID);
    this.deleteFeatures(moduleInfo);
  }

  /**
   * 清除功能点集合中的模块功能点
   * @param moduleInfo
   */
  private deleteFeatures(moduleInfo: ModuleInfo) {
    if (moduleInfo.features && typeof moduleInfo.features === 'object' && isNotEmpty(moduleInfo.features)) {
      for (const key in moduleInfo.features) {
        if (this.features.has(key)) {
          this.features.get(key).delete(moduleInfo.moduleID);
        }
      }
    }
  }

  /**
   * 加入模块管理
   * @param moduleInfo
   */
  private setup(moduleInfo: ModuleInfo) {
    if (isNotEmpty(moduleInfo.moduleID)) {
      this.set(moduleInfo);
    }
  }

  /**
   * 读取本地package.json文件得到本地安装的模块列表，依次获取模块信息加入模块列表
   */
  private init() {
    const moduleNames: string[] = this.moduleHandler.list();
    moduleNames.forEach((moduleName: string) => {
      // 这里要加上try catch，避免异常
      const moduleInfo: ModuleInfo = this.moduleHandler.info(moduleName);
      this.setup(moduleInfo);
    });
  }

  /**
   * 获取模块到上层模块后的模块列表
   * @returns
   */
  private moduleBelongs(): Map<string, ModuleInfo> {
    const newModules: Map<string, ModuleInfo> = new Map();
    const sideItems = new Map();
    this.modules?.forEach((module: ModuleInfo) => {
      // 如果包含自己则是主应用
      // 后期加入权限限制是否能成为顶层应用
      const belongs: string[] = module.belongs || ['default'];
      module.isApp = belongs.includes(module.moduleID);
      newModules.set(module.moduleID, module);
      belongs.forEach((belong: string) => {
        // let _modules: string[];
        if (module.moduleType === ModuleType.app) {
          /*
          if (!sideItems.has(belong)) {
            _modules = [];
          } else {
            _modules = sideItems.get(belong);
          }
          */
          const _modules: string[] = sideItems.get(belong) || [];
          // 如果指定上层是自己，自己放最前面
          if (module.moduleID === belong) {
            _modules.unshift(module.moduleID);
          } else {
            _modules.push(module.moduleID);
          }
          sideItems.set(belong, _modules);
        }
      });
    });
    sideItems?.forEach((value: Array<string>, key: string) => {
      const _current: ModuleInfo = newModules.get(key);
      if (_current && _current.isApp) {
        _current.sideItems = value;
        newModules.set(key, _current);
      }
    });
    return newModules;
  }
}
