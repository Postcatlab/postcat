import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from 'eo/platform/common/i18n';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { DISABLE_EXTENSION_NAMES } from 'eo/workbench/browser/src/app/shared/constants/storageKeys';
import { FeatureInfo, ModuleInfo, SidebarView } from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { WebExtensionService } from 'eo/workbench/browser/src/app/shared/services/web-extension/webExtension.service';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';
import { lastValueFrom, map } from 'rxjs';
const defaultExtensions = ['postcat-export-openapi', 'postcat-import-openapi'];
@Injectable({
  providedIn: 'root'
})
export class ExtensionService {
  ignoreList = ['default'];
  disabledExtensionNames: string[] = this.getDisableExtensionNames();
  extensionIDs: string[] = [];
  HOST = APP_CONFIG.EXTENSION_URL;
  installedList: ModuleInfo[] = [];
  installedMap: Map<string, ModuleInfo>;
  constructor(
    private http: HttpClient,
    private electron: ElectronService,
    private language: LanguageService,
    private webExtensionService: WebExtensionService,
    private messageService: MessageService
  ) {}
  async init() {
    if (!this.electron.isElectron) {
      //Install  extensions
      const { data } = await lastValueFrom<any>(this.http.get(`${this.HOST}/list?locale=${this.language.systemLanguage}`));
      for (let i = 0; i < this.webExtensionService.installedList.length; i++) {
        const target = data.find(m => m.name === this.webExtensionService.installedList[i].name);
        if (target) {
          this.installExtension({
            name: target.name
          });
        }
      }
      //Install default extensions
      defaultExtensions.forEach(name => {
        const target = data.find(m => m.name === name);
        if (target && !this.installedList.some(m => m.name === target.name)) {
          this.installExtension({
            name: target.name
          });
        }
      });
    } else {
      this.updateInstalledInfo(this.getExtensions());
    }
  }
  getExtensions() {
    let result: any = new Map();
    if (this.electron.isElectron) {
      result = window.electron.getInstalledExtensions() || new Map();
    } else {
      result = this.webExtensionService.getExtensions();
      result = new Map(result);
    }
    return result;
  }
  getInstalledList() {
    return this.installedList;
  }
  updateInstalledInfo(data) {
    this.installedMap = data;
    this.installedMap.forEach((val, key) => {
      val['enable'] = this.isEnable(val.name);
    });
    this.extensionIDs = this.updateExtensionIDs();
    this.installedList = Array.from(this.installedMap.values()).filter(it => this.extensionIDs.includes(it.name));
    this.emitInstalledExtensionsChangeEvent();
  }
  isInstalled(name) {
    return this.installedList.includes(name);
  }
  public async requestList() {
    const result: any = await lastValueFrom(this.http.get(`${this.HOST}/list?locale=${this.language.systemLanguage}`));
    result.data = [
      ...result.data.filter(val => this.installedList.every(childVal => childVal.name !== val.name)),
      //Local debug package
      ...this.installedList.map(module => {
        if (this.installedList.find(it => it.name === module.name)) {
          module.i18n = result.data.find(it => it.name === module.name)?.i18n;
        }
        return module;
      })
    ];
    result.data = result.data.map(module => this.translateModule(module));
    return result;
  }
  async getDetail(id, name): Promise<any> {
    let result = {} as ModuleInfo;
    const { code, data }: any = await this.requestDetail(name);
    Object.assign(result, data);
    if (this.installedMap.has(id)) {
      Object.assign(result, this.installedMap.get(id), { installed: true, enable: this.isEnable(result.name) });
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
  async installExtension({ name, version = 'latest', main = '' }): Promise<boolean> {
    const successCallback = () => {
      this.updateInstalledInfo(this.getExtensions());
      if (!this.isEnable(name)) {
        this.toggleEnableExtension(name, true);
      }
    };
    if (this.electron.isElectron) {
      const { code, data, modules } = await window.electron.installExtension(name);
      if (code === 0) {
        successCallback();
        return true;
      } else {
        console.error(data);
        return false;
      }
    } else {
      const isSuccess = await this.webExtensionService.installExtension(name, version, main);
      if (isSuccess) {
        successCallback();
      }
      return isSuccess;
    }
  }
  async uninstallExtension(name): Promise<boolean> {
    if (this.electron.isElectron) {
      const { code, data, modules } = await window.electron.uninstallExtension(name);
      if (code === 0) {
        this.updateInstalledInfo(this.getExtensions());
        return true;
      }
      console.error(data);
      return false;
    } else {
      const isSuccess = await this.webExtensionService.unInstallExtension(name);
      if (isSuccess) {
        this.updateInstalledInfo(this.getExtensions());
      }
      return isSuccess;
    }
  }

  isEnable(name: string) {
    return !this.disabledExtensionNames.includes(name);
  }
  toggleEnableExtension(id: string, isEnable: boolean) {
    if (isEnable) {
      this.enableExtension(id);
    } else {
      this.disableExtension(id);
    }
    this.updateInstalledInfo(this.installedMap);
  }
  private enableExtension(names: string | string[]) {
    const enableNames = Array().concat(names) as string[];
    this.setDisabledExtension(this.disabledExtensionNames.filter(n => !enableNames.includes(n)));
  }

  private disableExtension(names: string | string[]) {
    this.setDisabledExtension([...new Set(this.disabledExtensionNames.concat(names))]);
  }

  private setDisabledExtension(arr: string[]) {
    localStorage.setItem(DISABLE_EXTENSION_NAMES, JSON.stringify(arr));
    this.disabledExtensionNames = arr;
  }
  async getExtensionPackage(name: string): Promise<any> {
    if (this.electron.isElectron) {
      return window.electron.getExtensionPackage(name);
    } else {
      if (!window[name]) {
        await this.installExtension({ name });
      }
      return window[name];
    }
  }
  getExtensionsByFeature<T = FeatureInfo>(featureKey: string): Map<string, T> {
    let extensions = new Map();
    if (this.electron.isElectron) {
      extensions = window.electron.getExtensionsByFeature(featureKey);
    } else {
      this.installedList.forEach(item => {
        const feature: T = item.features?.[featureKey];
        if (feature) {
          extensions.set(item.name, {
            extensionID: item.name,
            ...feature
          });
        }
      });
    }
    return extensions || new Map();
  }
  getValidExtensionsByFature<T = FeatureInfo>(featureKey: string): Map<string, T> {
    const extensions = this.getExtensionsByFeature<T>(featureKey);
    const validExtensions = new Map([...extensions].filter(([k, v]) => this.isEnable(k)));
    return validExtensions;
  }
  getSidebarView(extName) {
    if (this.electron.isElectron) {
      return window.electron.getSidebarView(extName);
    }
    return this.getSidebarViews().find(n => n.extensionID === extName);
  }
  getSidebarViews(): SidebarView[] {
    let result: any = new Map();
    if (this.electron.isElectron) {
      result = window.electron.getSidebarViews();
    } else {
      result = this.getExtensionsByFeature<SidebarView>('sidebarView');
      result = [...result.values()];
    }
    return result;
  }
  private getDisableExtensionNames() {
    try {
      return JSON.parse(localStorage.getItem(DISABLE_EXTENSION_NAMES) || '[]');
    } catch (error) {
      return [];
    }
  }
  private emitInstalledExtensionsChangeEvent() {
    this.messageService.send({ type: 'installedExtensionsChange', data: this.installedMap });
  }
  private async requestDetail(id) {
    return await lastValueFrom(this.http.get(`${this.HOST}/detail/${id}?locale=${this.language.systemLanguage}`)).catch(err => [0, err]);
  }
  private updateExtensionIDs() {
    return Array.from(this.installedMap.keys())
      .filter(it => it)
      .filter(it => !this.ignoreList.includes(it));
  }
  private translateModule(module: ModuleInfo) {
    const lang = this.language.systemLanguage;

    //If extension from web,transalte package content from http moduleInfo
    //Locale extension will translate from local i18n file
    const locale = module.i18n?.find(val => val.locale === lang)?.package;
    if (!locale) {
      return module;
    }
    module = new TranslateService(module, locale).translate();
    return module;
  }
}
