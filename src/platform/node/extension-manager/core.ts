import { LanguageService } from 'pc/app/electron-main/language.service';
import { ExtensionInfo } from 'pc/browser/src/app/shared/models/extension-manager';
import { TranslateService } from 'pc/platform/common/i18n';
import { getLocaleData } from 'pc/platform/node/i18n';
import { fileExists, readFile, readJson } from 'pc/shared/node/file';

import { ModuleHandlerOptions } from './handler.model';

import * as path from 'path';
/**
 * 核心模块管理器
 *
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
   *
   * @param {string} name 模块名称
   */
  async info(name: string): Promise<ExtensionInfo> {
    let extensionInfo: ExtensionInfo;
    try {
      const baseDir: string = this.getModuleDir(name);
      extensionInfo = readJson(path.join(baseDir, 'package.json')) as ExtensionInfo;
      extensionInfo.baseDir = baseDir;
      // Get language locale
      //!Warn:baseDir must be set before get locale file
      const lang = await LanguageService.get();
      if (extensionInfo.features?.i18n) {
        const locale = getLocaleData(extensionInfo, lang);
        if (locale) {
          let translateService = new TranslateService(extensionInfo, locale);
          extensionInfo = translateService.translate();
        }
      }
      // Check that the file exists locally
      extensionInfo.introduction = readFile(path.join(baseDir, `README.${lang}.md`)) || readFile(path.join(baseDir, `README.md`));
      if (extensionInfo.main) {
        extensionInfo.main = `file://${path.join(extensionInfo.baseDir, extensionInfo.main)}`;
      }
      if (extensionInfo.browser) {
        extensionInfo.browser = `file://${path.join(extensionInfo.baseDir, extensionInfo.browser)}`;
      }
      if (extensionInfo.logo?.length > 0 && !extensionInfo.logo.startsWith('http') && !extensionInfo.logo.includes('icon-')) {
        extensionInfo.logo = `file://${path.join(extensionInfo.baseDir, extensionInfo.logo)}`;
      }
    } catch (e) {
      console.log(`Get module ${extensionInfo?.name} error:${e}`);
      extensionInfo = {} as ExtensionInfo;
    }
    return extensionInfo;
  }

  /**
   * 获取模块目录
   *
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
    return modules.filter(val => val);
  }
}
