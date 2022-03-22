import { ModuleRuntime, ModuleType, ModuleInfo, ModuleLoaderInterface } from './type';

/**
 * 模块加载类
 * 根据运行环境加载模块
 */
export class ModuleLoader implements ModuleLoaderInterface {
  /**
   * 模块运行时环境
   */
  private readonly runtime: ModuleRuntime;

  /**
   * 模块加载方法
   */
  private readonly moduleRequire: any;

  constructor(_runtime: ModuleRuntime, _moduleRequire?: any) {
    this.runtime = _runtime;
    this.moduleRequire = _moduleRequire || require;
  }

  /**
   * 批量加载模块
   * @param modules
   */
  loadModules(modules: Array<ModuleInfo>): void {
    modules.forEach((module: ModuleInfo) => {
      this.loadModule(module);
    })
  }

  /**
   * 实际加载模块并运行
   * 需要检查模块的类型与运行环境匹配
   * main运行环境只能加载system和app模块
   * render运行环境只能加载ui和feature模块
   * web运行环境只能加载web支持的模块
   * @param module ModuleInfo
   */
  loadModule(module: ModuleInfo): void {
    console.log(module);
    if ((this.runtime === ModuleRuntime.main && ![ModuleType.system, ModuleType.app].indexOf(module.type))
      || (this.runtime === ModuleRuntime.render && ![ModuleType.ui, ModuleType.feature].indexOf(module.type))
      || (this.runtime === ModuleRuntime.web && !module.web)) {
      console.log(`The [${module.type}] module [${module.name}] can not run in runtime [${this.runtime}].`);
      return;
    }
    if (this.runtime === ModuleRuntime.main) {
      console.log('load from main');
      const _module = this.moduleRequire(module.baseDir)();
      console.log(_module);
    } else if (this.runtime === ModuleRuntime.render) {
      console.log('load from render');
      const _module = this.moduleRequire(module.baseDir)();
      console.log(_module);
    } else if (this.runtime === ModuleRuntime.web) {
      console.log('load from web');
      // todo with script src
    }
    // 加入hooks列表
  }
}
