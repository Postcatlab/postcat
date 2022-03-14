import { MODULE_DIR as baseDir } from "../../common/constant/main";
import { ModuleHandler } from "./handler";
import { ModuleInfo, ModuleManagerInfo, ModuleManagerInterface} from "../types";

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
    let subModules = new Map();
    // @ts-ignore
    for (let [key, value] of this.modules) {
      newModules.set(key, value);
      if (value.belongs) {
        const belongs: string[] = value.belongs;
        belongs.forEach((belong: string) => {
          let _modules: string[];
          if (!subModules.has(belong)) {
            _modules = [];
          } else {
            _modules = subModules.get(belong);
          }
          _modules.push(value.moduleID);
          subModules.set(belong, _modules);
        });
      }
    }
    // @ts-ignore
    for (let [key, value] of subModules) {
      if (newModules.has(key)) {
        // @ts-ignore
        const _current: ModuleInfo = newModules.get(key);
        _current.subModules = value;
        newModules.set(key, _current);
      }
    }

    return newModules;
  }

}

export default () => new ModuleManager();
