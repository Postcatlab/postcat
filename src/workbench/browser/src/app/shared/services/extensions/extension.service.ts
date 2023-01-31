import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { DISABLE_EXTENSION_NAMES } from 'eo/workbench/browser/src/app/shared/constants/storageKeys';
import { FeatureInfo, ExtensionInfo, SidebarView } from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';
import { lastValueFrom } from 'rxjs';

import { ExtensionStoreService } from './extension-store.service';
import { WebExtensionService } from './webExtension.service';

const defaultExtensions = ['postcat-export-openapi', 'postcat-import-openapi'];
@Injectable({
  providedIn: 'root'
})
export class ExtensionService {
  ignoreList = ['default'];
  disabledExtensionNames: string[] = this.getDisableExtensionNames();
  extensionIDs: string[] = [];
  HOST = APP_CONFIG.EXTENSION_URL;
  installedList: ExtensionInfo[] = [];
  installedMap: Map<string, ExtensionInfo>;
  constructor(
    private http: HttpClient,
    private electron: ElectronService,
    private store: ExtensionStoreService,
    private language: LanguageService,
    private webExtensionService: WebExtensionService,
    private messageService: MessageService
  ) {}
  async init() {
    await this.requestList('init');
    if (!this.electron.isElectron) {
      const installedName = [];

      //Get extensions
      [...this.webExtensionService.installedList, ...defaultExtensions.map(name => ({ name }))].forEach(val => {
        if (this.installedList.some(m => m.name === val.name)) return;
        installedName.push(val.name);
      });

      //* Install Extension by foreach because of async
      const uniqueNames = Array.from(new Set(installedName));
      for (let i = 0; i < uniqueNames.length; i++) {
        const name = uniqueNames[i];
        await this.installExtension({
          name
        });
      }
    } else {
      this.updateInstalledInfo(this.getExtensions(), {
        action: 'init'
      });
    }
  }
  getExtension(name: string) {
    return this.installedList.find(val => val.name === name);
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
  updateInstalledInfo(data, opts) {
    this.installedMap = data;
    this.installedMap.forEach((val, key) => {
      val['enable'] = this.isEnable(val.name);
    });
    this.extensionIDs = this.updateExtensionIDs();
    this.installedList = Array.from(this.installedMap.values()).filter(it => this.extensionIDs.includes(it.name));
    this.messageService.send({
      type: 'installedExtensionsChange',
      data: {
        installedMap: this.installedMap,
        ...opts
      }
    });
  }
  isInstalled(name) {
    return this.installedList.includes(name);
  }
  public async requestList(type = 'list') {
    const result: any = await lastValueFrom(this.http.get(`${this.HOST}/list?locale=${this.language.systemLanguage}`), {
      defaultValue: []
    });
    const debugExtensions = [];

    if (type !== 'init') {
      for (let i = 0; i < this.webExtensionService.debugExtensionNames.length; i++) {
        const name = this.webExtensionService.debugExtensionNames[i];
        const hasExist = this.installedList.some(val => val.name === name);
        if (hasExist) continue;
        debugExtensions.push(await this.webExtensionService.getDebugExtensionsPkgInfo(name));
      }
    }

    result.data = [
      ...result.data.filter(val => this.installedList.every(childVal => childVal.name !== val.name)),
      //Local debug package
      ...this.installedList.map(module => {
        const extension = result.data.find(it => it.name === module.name);
        if (extension) {
          module.i18n = extension.i18n;
        }
        return module;
      }),
      ...debugExtensions
    ];
    //Handle featue data
    result.data = result.data.map(module => {
      let result = this.parseExtensionInfo(module);
      return result;
    });

    //Get debug extensions
    this.webExtensionService.debugExtensions = result.data.filter(val => val.isDebug);

    this.store.setExtensionList(result.data);
    return result;
  }
  async getDetail(name): Promise<any> {
    let result = {} as ExtensionInfo;
    const { code, data }: any = await this.requestDetail(name);
    Object.assign(result, data);
    if (this.installedMap.has(name)) {
      Object.assign(result, this.installedMap.get(name), { installed: true });
      result.enable = this.isEnable(result.name);
    }
    result = this.parseExtensionInfo(result);
    return result;
  }
  /**
   *  install extension by id
   *
   * @param id
   * @returns if install success
   */
  async installExtension({ name, version = 'latest' }): Promise<boolean> {
    const successCallback = () => {
      this.updateInstalledInfo(this.getExtensions(), {
        action: 'install',
        name
      });
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
      const isSuccess = await this.webExtensionService.installExtension(name, {
        version
      });
      if (isSuccess) {
        successCallback();
      }
      return isSuccess;
    }
  }
  async uninstallExtension(name): Promise<boolean> {
    const successCallback = () => {
      this.updateInstalledInfo(this.getExtensions(), {
        action: 'uninstall',
        name
      });
    };
    if (this.electron.isElectron) {
      const { code, data, modules } = await window.electron.uninstallExtension(name);
      if (code === 0) {
        successCallback();
        return true;
      }
      console.error(data);
      return false;
    } else {
      const isSuccess = await this.webExtensionService.unInstallExtension(name);
      if (isSuccess) {
        successCallback();
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
    this.updateInstalledInfo(this.installedMap, {
      action: isEnable ? 'enable' : 'disable',
      name: id
    });
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
        await this.webExtensionService.getExtensionPackage(name);
      }
      return window[name];
    }
  }
  getExtensionsByFeature<T = FeatureInfo>(featureKey: string): Map<string, T> {
    let extensions = new Map();
    if (this.electron.isElectron) {
      extensions = window.electron.getExtensionsByFeature(featureKey);
    } else {
      extensions = this.webExtensionService.getExtensionsByFeature(featureKey, this.installedList);
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
  private async requestDetail(id) {
    const debugExtension = this.webExtensionService.debugExtensions.find(val => val.name === id);
    if (debugExtension) {
      return {
        code: 0,
        data: debugExtension
      };
    }
    return await lastValueFrom(this.http.get(`${this.HOST}/detail/${id}?locale=${this.language.systemLanguage}`)).catch(err => [0, err]);
  }
  private updateExtensionIDs() {
    return Array.from(this.installedMap.keys())
      .filter(it => it)
      .filter(it => !this.ignoreList.includes(it));
  }
  /**
   * Parse extension info for ui show
   * such as: author, translate ...
   *
   * @param pkg
   * @returns
   */
  private parseExtensionInfo(pkg): ExtensionInfo {
    pkg = this.webExtensionService.translateModule(pkg);
    if (typeof pkg.author === 'object') {
      pkg.author = pkg.author['name'] || '';
    }
    return pkg;
  }
}
