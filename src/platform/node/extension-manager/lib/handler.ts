let fixPath = require('fix-path');
import * as path from 'path';
import { ModuleHandlerOptions, ModuleHandlerResult } from '../types';
import { fileExists, writeJson } from 'eo/shared/node/file';
import { CoreHandler } from './core';
import * as spawn from 'cross-spawn';
// import npmCli from 'npm';
const npmCli = require('npm');
/**
 * 本地模块管理器
 * @class ModuleHandler
 */
fixPath();
export class ModuleHandler extends CoreHandler {
  /**
   * 模块安装源地址
   */
  private readonly registry: string | undefined;

  /**
   * 模块安装代理
   */
  private readonly proxy: string | undefined;

  constructor(options: ModuleHandlerOptions) {
    super(options);
    this.registry = options.registry;
    this.proxy = options.proxy;
  }

  /**
   * 检查package.json
   */
  checkPackageJson(): void {
    const packageJsonFile: string = path.join(this.baseDir, 'package.json');
    if (!fileExists(packageJsonFile)) {
      const data = {
        name: 'eoapi-modules',
        description: 'EOAPI modules package',
        dependencies: {},
      };
      writeJson(packageJsonFile, data);
    }
  }

  /**
   * 获取模块目录
   * @param name
   * @returns
   */
  getModuleDir(name: string): string {
    return path.join(this.baseDir, 'node_modules', name);
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
   * 运行模块管理器
   * @param command
   * @param modules
   */
  private async execCommand(command: string, modules: string[]): Promise<ModuleHandlerResult> {
    return await new Promise((resolve: any, reject: any): void => {
      let args = [command].concat(modules).concat('--color=always', '--save');
      if (!['link', 'unlink', 'uninstall'].includes(command)) {
        if (this.registry) {
          args = args.concat(`--registry=${this.registry}`);
        }
        if (this.proxy) {
          args = args.concat(`--proxy=${this.proxy}`);
        }
      }
      // console.log(npmCli.commands.run('version'));
      // console.log('command', [command].concat(modules), this.baseDir);
      npmCli.load({ 'bin-links': false, verbose: true, prefix: this.baseDir }, (loaderr) => {
        if (command === 'install') {
          npmCli.commands.install(modules, (err, data) => {
            process.chdir(this.baseDir);
            if (err) {
              reject(err);
            }
            resolve({ code: 0, data });
          });
        }
        if (command === 'uninstall') {
          npmCli.commands.uninstall(modules, (err, data) => {
            process.chdir(this.baseDir);
            if (err) {
              reject(err);
            }
            resolve({ code: 0, data });
          });
        }
      });

      // const npm = spawn('npm', args, { cwd: this.baseDir });
      // // console.log('2==>', npm);
      // let output = '';
      // npm.stdout
      //   .on('data', (data: string) => {
      //     output += data;
      //   })
      //   .pipe(process.stdout);
      // npm.stderr
      //   .on('data', (data: string) => {
      //     output += data;
      //   })
      //   .pipe(process.stderr);
      // npm.on('close', (code: number) => {
      //   if (!code) {
      //     resolve({ code: 0, data: output });
      //   } else {
      //     resolve({ code: code, data: output });
      //   }
      // });
    });
  }
}
