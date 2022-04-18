import {ModuleInfo} from './manager';

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
