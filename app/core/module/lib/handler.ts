import * as path from 'path';
import spawn from 'cross-spawn';
import { ModuleHandlerOptions, ModuleHandlerResult, ModuleInfo } from '../types';
import { fileExists, readJson, writeJson, resolveModule } from '../../common/util';

/**
 * 本地模块管理器
 * @class ModuleHandler
 */
export class ModuleHandler {
  /**
   * 模块安装包文件
   */
  private readonly baseDir: string;

  /**
   * 模块安装源地址
   */
  private readonly registry: string | undefined;

  /**
   * 模块安装代理
   */
  private readonly proxy: string | undefined;

  constructor(options: ModuleHandlerOptions) {
    this.baseDir = options.baseDir;
    this.registry = options.registry;
    this.proxy = options.proxy;
    const packageJsonFile: string = path.join(this.baseDir, 'package.json');
    if (!fileExists(packageJsonFile)) {
        const data = {
          name: 'eoapi-modules',
          description: 'EOAPI modules package',
          dependencies: {}
        };
        writeJson(packageJsonFile, data);
    }
  }

  /**
   * 获取模块package.json信息
   * @param {string} name 模块名称
   */
  info(name: string): ModuleInfo {
    const main: string = resolveModule(name, this.baseDir);
    const baseDir: string = path.dirname(main);
    const moduleInfo: ModuleInfo = readJson(path.join(baseDir, 'package.json')) as ModuleInfo;
    // 这里要加上判断或try catch，避免异常读取不到文件，或格式错误
    moduleInfo.main = main;
    moduleInfo.baseDir = baseDir;
    if (moduleInfo.preload && moduleInfo.preload.length > 0) {
      moduleInfo.preload = path.join(baseDir, moduleInfo.preload);
    }
    if (moduleInfo.logo && moduleInfo.logo.length > 0 && !moduleInfo.logo.startsWith('http')) {
      moduleInfo.logo = path.join(baseDir, moduleInfo.logo);
    }
    return moduleInfo;
  }

  /**
   * 安装模块
   * @param modules 模块名称数组
   * @param isLocal 本地安装用link
   */
  async install(modules: string[], isLocal: boolean): Promise<ModuleHandlerResult> {
    return await this.execCommand(isLocal ? 'link' : 'install', modules);
  }

  /**
   * 更新模块
   * @param {...string[]} modules 模块名称数组
   */
  async update(...modules: string[]): Promise<ModuleHandlerResult> {
    return await this.execCommand('update', modules);
  }

  /**
   * 卸载模块
   * @param {string[]} modules 模块名称数组
   * @param isLocal 本地卸载用unlink
   */
  async uninstall(modules: string[], isLocal: boolean): Promise<ModuleHandlerResult> {
    return await this.execCommand(isLocal ? 'unlink' : 'uninstall', modules);
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
    return modules;;
  }

  /**
   * 运行模块管理器
   * @param command
   * @param modules
   */
  private async execCommand(command: string, modules: string[]): Promise<ModuleHandlerResult> {
    return await new Promise((resolve: any): void => {
      let args = [command].concat(modules).concat('--color=always').concat('--save');
      if (!['link', 'unlink', 'uninstall'].includes(command)) {
        if (this.registry) {
          args = args.concat(`--registry=${this.registry}`);
        }
        if (this.proxy) {
          args = args.concat(`--proxy=${this.proxy}`);
        }
      }
      const npm = spawn('npm', args, { cwd: this.baseDir });
      let output = '';
      // @ts-ignore
      npm.stdout.on('data', (data: string) => {
        output += data;
      }).pipe(process.stdout);
      // @ts-ignore
      npm.stderr.on('data', (data: string) => {
        output += data;
      }).pipe(process.stderr);
      npm.on('close', (code: number) => {
        if (!code) {
          resolve({ code: 0, data: output });
        } else {
          resolve({ code: code, data: output });
        }
      });
    })
  }
}
