import { fileExists, writeJson } from 'eo/shared/node/file';
import fixPath from 'fix-path';

import { CoreHandler } from './core';
import { ModuleHandlerOptions, ModuleHandlerResult } from './handler.model';

import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

type Action = 'uninstall' | 'install' | 'update';
/**
 * Install npm packages in case of missing Node Environment
 * ! npm version should be 6.14.8, otherwise npm function can't be used
 * */
const npmCli = require('npm');

/**
 * Fix the $PATH on macOS and Linux when run from a GUI app
 *  https://github.com/sindresorhus/fix-path
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
        name: 'postcat-extensions',
        description: 'Postcat extensions package',
        dependencies: {}
      };
      writeJson(packageJsonFile, data);
    }
  }

  /**
   * 获取模块目录
   *
   * @param name
   * @returns
   */
  getModuleDir(name: string): string {
    return path.join(this.baseDir, 'node_modules', name);
  }

  /**
   * 安装模块
   *
   * @param modules 模块名称数组
   * @param isLocal 本地安装用link
   */
  async install(modules: any[], isLocal: boolean): Promise<ModuleHandlerResult> {
    return await this.execCommand(isLocal ? 'link' : 'install', modules);
  }
  /**
   * 更新模块
   *
   * @param [{ name:string, version:string }]
   */
  async update(modules: any[]): Promise<ModuleHandlerResult> {
    return await this.execCommand('install', modules);
  }

  /**
   * 卸载模块
   *
   * @param {string[]} modules 模块名称数组
   * @param isLocal 本地卸载用unlink
   */
  async uninstall(modules: any[], isLocal: boolean): Promise<ModuleHandlerResult> {
    return await this.execCommand(isLocal ? 'unlink' : 'uninstall', modules);
  }

  /**
   * 手动操作package.json
   *
   * @param result npm install安装成功回调的结果
   * @param moduleList 所有的模块列表
   */
  private operatePackage(result: any[], moduleList: string[], action: Action) {
    if (Array.isArray(result)) {
      const names = moduleList.map(n => n.split('@')[0]);
      const packagePath = path.join(this.baseDir, 'package.json');
      result.forEach(([name]) => {
        const [pkgName, pkgVersion] = name.split('@');
        if (names.includes(pkgName)) {
          const packageJSON = fs.readFileSync(packagePath);
          const packageObj = JSON.parse(packageJSON.toString());
          const dependencieKeys = Object.keys(packageObj.dependencies);
          if (!dependencieKeys.includes(pkgName)) {
            if (action === 'install') {
              packageObj.dependencies[pkgName] = pkgVersion;
            } else {
              delete packageObj.dependencies[pkgName];
            }
          }
          fs.writeFileSync(packagePath, JSON.stringify(packageObj, null, 2));
        }
      });
    }
  }
  private executeByAppNpm(command: string, modules: any[], resolve, reject) {
    // https://www.npmjs.com/package/bin-links
    npmCli.load({ 'bin-links': false, verbose: true, prefix: this.baseDir }, loaderr => {
      const moduleList = modules.map(({ name, version }) => (version ? `${name}@${version}` : name));
      let executeCommand = ['update', 'install', 'uninstall'];
      if (!executeCommand.includes(command)) {
        return;
      }
      npmCli.commands[command](moduleList, (err, data) => {
        // console.log('command', command);
        process.chdir(this.baseDir);
        if (err) {
          return reject(err);
        }
        this.operatePackage(data, moduleList, command as Action);
        return resolve({ code: 0, data });
      });
    });
  }
  private executeBySystemNpm(command: string, modules: string[], resolve) {
    let args = [command].concat(modules).concat('--color=always', '--save');
    if (!['link', 'unlink', 'uninstall', 'update'].includes(command)) {
      if (this.registry) {
        args = args.concat(`--registry=${this.registry}`);
      }
      if (this.proxy) {
        args = args.concat(`--proxy=${this.proxy}`);
      }
    }
    const npm = spawn('npm', args, { cwd: this.baseDir });
    let output = '';
    npm.stdout
      .on('data', (data: string) => {
        output += data;
      })
      .pipe(process.stdout);
    npm.stderr
      .on('data', (data: string) => {
        output += data;
      })
      .pipe(process.stderr);
    npm.on('close', (code: number) => {
      if (!code) {
        resolve({ code: 0, data: output });
      } else {
        resolve({ code: code, data: output });
      }
    });
  }
  /**
   * 运行模块管理器
   *
   * @param command
   * @param modules
   */
  private async execCommand(command: string, modules: any[]): Promise<ModuleHandlerResult> {
    return await new Promise((resolve: any, reject: any): void => {
      // this.executeBySystemNpm(command, modules, resolve)
      this.executeByAppNpm(command, modules, resolve, reject);
    });
  }
}
