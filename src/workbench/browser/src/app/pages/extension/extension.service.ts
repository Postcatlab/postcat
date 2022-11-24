import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { lastValueFrom } from 'rxjs';
import { ModuleInfo } from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { TranslateService } from 'eo/platform/common/i18n';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';
import { DISABLE_EXTENSION_NAMES } from 'eo/workbench/browser/src/app/shared/constants/storageKeys';
import { WebExtensionService } from 'eo/workbench/browser/src/app/shared/services/web-extension/webExtension.service';

@Injectable({
  providedIn: 'root',
})
export class ExtensionService {
  ignoreList = ['default'];
  disabledExtensionNames: string[] = this.getExtensionNames();
  extensionIDs: Array<string> = [];
  HOST = '';
  localExtensions: Map<string, ModuleInfo>;
  constructor(
    private http: HttpClient,
    private electron: ElectronService,
    private language: LanguageService,
    private webExtensionService: WebExtensionService
  ) {
    this.localExtensions = this.getExtensions();
    this.extensionIDs = this.updateExtensionIDs();
    this.HOST = this.electron.isElectron ? APP_CONFIG.EXTENSION_URL : APP_CONFIG.MOCK_URL;
  }
  private getExtensions() {
    if (this.electron.isElectron) {
      return window.eo?.getModules?.() || new Map();
    } else {
      const webeExts = this.webExtensionService.installedList.map((n) => [n.name, n.pkgInfo]);
      return new Map(webeExts as any);
    }
  }
  getInstalledList() {
    // Local extension exception for ignore list
    return Array.from(this.localExtensions.values()).filter((it) => this.extensionIDs.includes(it.name));
  }
  isInstalled(name) {
    const installList = this.getInstalledList();
    return installList.includes(name);
  }
  public async requestList() {
    const result: any = await lastValueFrom(this.http.get(`${this.HOST}/list?locale=${this.language.systemLanguage}`));
    const installList = this.getInstalledList();
    result.data = [
      ...result.data.filter((val) => installList.every((childVal) => childVal.name !== val.name)),
      //Local debug package
      ...installList.map((module) => {
        if (installList.find((it) => it.name === module.name)) {
          module.i18n = result.data.find((it) => it.name === module.name)?.i18n;
        }
        return module;
      }),
    ];
    result.data = result.data.map((module) => this.translateModule(module));
    return result;
  }
  async getDetail(id, name): Promise<any> {
    let result = {} as ModuleInfo;
    const { code, data }: any = await this.requestDetail(name);
    Object.assign(result, data);
    if (this.localExtensions.has(id)) {
      Object.assign(result, this.localExtensions.get(id), { installed: true });
    }
    result = this.translateModule(result);
    return result;
  }
  /**
   *  install extension by id
   *
   * @param id
   * @returns if install success
   */
  async install(id): Promise<boolean> {
    console.log('Install module:', id);
    const { code, data, modules } = await window.eo.installModule(id);
    if (code === 0) {
      this.localExtensions = modules;
      this.extensionIDs = this.updateExtensionIDs();
      return true;
    }
    console.error(data);
    return false;
  }
  async uninstall(id): Promise<boolean> {
    console.log('Uninstall module:', id);
    const { code, data, modules } = await window.eo.uninstallModule(id);
    if (code === 0) {
      this.localExtensions = modules;
      this.extensionIDs = this.updateExtensionIDs();
      return true;
    }
    console.error(data);
    return false;
  }

  isEnable(name: string) {
    return !this.disabledExtensionNames.includes(name);
  }

  enableExtension(names: string | string[]) {
    const enableNames = Array().concat(names) as string[];
    this.setExtension(this.disabledExtensionNames.filter((n) => !enableNames.includes(n)));
  }

  disableExtension(names: string | string[]) {
    this.setExtension([...new Set(this.disabledExtensionNames.concat(names))]);
  }

  setExtension(arr: string[]) {
    localStorage.setItem(DISABLE_EXTENSION_NAMES, JSON.stringify(arr));
    this.disabledExtensionNames = arr;
  }

  getExtensionNames() {
    try {
      return (this.disabledExtensionNames = JSON.parse(localStorage.getItem(DISABLE_EXTENSION_NAMES) || '[]'));
    } catch (error) {
      return [];
    }
  }

  private async requestDetail(id) {
    return await lastValueFrom(this.http.get(`${this.HOST}/detail/${id}?locale=${this.language.systemLanguage}`)).catch(
      (err) => [0, err]
    );
  }
  private updateExtensionIDs() {
    return Array.from(this.localExtensions.keys())
      .filter((it) => it)
      .filter((it) => !this.ignoreList.includes(it));
  }
  private translateModule(module: ModuleInfo) {
    const lang = this.language.systemLanguage;

    //If extension from web,transalte package content from http moduleInfo
    //Locale extension will translate from local i18n file
    const locale = module.i18n?.find((val) => val.locale === lang)?.package;
    if (!locale) {
      return module;
    }
    module = new TranslateService(module, locale).translate();
    return module;
  }
}
