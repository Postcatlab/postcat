import * as path from 'path';
import { ModuleHandlerOptions, ModuleInfo } from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { fileExists, readFile, readJson } from 'eo/shared/node/file';
import { getLocaleData } from 'eo/platform/node/i18n';
import { LanguageService } from 'eo/app/electron-main/language.service';
import { TranslateService } from 'eo/platform/common/i18n';
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
      // Get language locale
      //!Warn:baseDir must be set before get locale file
      const lang = LanguageService.get();
      if (moduleInfo.features?.i18n) {
        const locale = getLocaleData(moduleInfo, lang);
        if (locale) {
          let translateService = new TranslateService(moduleInfo, locale);
          moduleInfo = translateService.translate();
        }
      }
      // Check that the file exists locally
      moduleInfo.introduction =
        readFile(path.join(baseDir, `README.${lang}.md`)) || readFile(path.join(baseDir, `README.md`));
      if(moduleInfo.main){
        moduleInfo.main = 'file://' + path.join(moduleInfo.baseDir, moduleInfo.main);
      }
      if(moduleInfo.node){
        moduleInfo.node = 'file://' + path.join(moduleInfo.baseDir, moduleInfo.node);
      }
      if (moduleInfo.logo?.length > 0 && !moduleInfo.logo.startsWith('http') && !moduleInfo.logo.includes('icon-')) {
        moduleInfo.logo = 'file://' + path.join(moduleInfo.baseDir, moduleInfo.logo);
      }
      if (typeof moduleInfo.author === 'object') {
        moduleInfo.author = moduleInfo.author['name'] || '';
      }
    } catch (e) {
      console.log(`Get module ${moduleInfo?.name} error:${e}`);
      moduleInfo = {} as ModuleInfo;
    }
    return moduleInfo;
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
