import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ElectronService } from 'pc/browser/src/app/core/services';
import { LanguageService } from 'pc/browser/src/app/core/services/language/language.service';
import { MessageService } from 'pc/browser/src/app/services/message';
import { defaultExtensions } from 'pc/browser/src/app/shared/models/extension';
import { FeatureInfo, ExtensionInfo, SidebarView } from 'pc/browser/src/app/shared/models/extension-manager';
import { DISABLE_EXTENSION_NAMES } from 'pc/browser/src/app/shared/models/storageKeys.constant';
import StorageUtil from 'pc/browser/src/app/shared/utils/storage/storage.utils';
import { StoreService } from 'pc/browser/src/app/store/state.service';
import { APP_CONFIG } from 'pc/browser/src/environments/environment';
import { lastValueFrom, Subscription } from 'rxjs';

import { ExtensionCommonService } from './extension-store.service';
import { WebExtensionService } from './webExtension.service';

@Injectable({
  providedIn: 'root'
})
export class ExtensionService {
  ignoreList = ['default'];
  disabledExtensionNames: string[] = this.getDisableExtensionNames();
  extensionIDs: string[] = [];
  isFirstInit = true;
  HOST = APP_CONFIG.EXTENSION_URL;
  installedList: ExtensionInfo[] = [];
  installedMap: Map<string, ExtensionInfo> = new Map();
  private requestPending: Subscription | null = null;
  constructor(
    private http: HttpClient,
    private electron: ElectronService,
    private extensionCommon: ExtensionCommonService,
    private language: LanguageService,
    private webExtensionService: WebExtensionService,
    private messageService: MessageService,
    public store: StoreService
  ) {}
  async init() {
    await this.requestList('init');

    if (this.electron.isElectron) {
      this.updateInstalledInfo(this.getExtensions(), {
        action: 'init'
      });
      return;
    }
    //* Web Installl
    const installedName = [];
    //Get extensions
    [...this.webExtensionService.installedList, ...(!this.store.getAppHasInitial ? defaultExtensions.map(name => ({ name })) : [])].forEach(
      val => {
        if (this.installedList.some(m => m.name === val.name)) return;
        installedName.push(val.name);
      }
    );

    //* Install Extension by foreach because of async
    const uniqueNames = [...Array.from(new Set(installedName)), ...this.webExtensionService.debugExtensionNames];
    for (let i = 0; i < uniqueNames.length; i++) {
      const name = uniqueNames[i];
      await this.installExtension(
        {
          name
        },
        true
      );
    }
  }
  getExtension(name: string) {
    return this.installedList.find(val => val.name === name);
  }
  getExtensions() {
    let result: any = new Map();
    if (this.electron.isElectron) {
      result = window.electron.getInstalledExtensions() || new Map();
      result.forEach((value, key) => {
        result.set(key, this.extensionCommon.parseExtensionInfo(value));
      });
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
      type: 'extensionsChange',
      data: {
        installedMap: this.installedMap,
        extension: this.installedList.find(val => val.name === opts.name),
        ...opts
      }
    });
  }
  isInstalled(name) {
    return this.installedList.includes(name);
  }
  public async requestList(type = 'list', queryParams = {}) {
    if (type === 'list' && !this.isFirstInit) {
      this.requestPending?.unsubscribe();
    }
    return new Promise((resolve, reject) => {
      const params = JSON.parse(JSON.stringify({ locale: this.language.systemLanguage, ...queryParams }));

      this.requestPending = this.http.get<any>(`${this.HOST}/list`, { params }).subscribe({
        next: async result => {
          const debugExtensions = [];
          const originData = structuredClone(result.data);

          if (type !== 'init') {
            for (let i = 0; i < this.webExtensionService.debugExtensionNames.length; i++) {
              const name = this.webExtensionService.debugExtensionNames[i];
              const hasExist = this.installedList.some(val => val.name === name);
              if (hasExist) continue;
              debugExtensions.push(await this.webExtensionService.getDebugExtensionsPkgInfo(name));
            }
          }

          result.data = [
            ...debugExtensions,
            //Installed package
            ...this.installedList
              .filter(n => {
                const target = result.data.find(m => n.name === m.name);
                n.downloadCounts = target?.downloadCounts;
                return target;
              })
              .map(module => {
                const extension = result.data.find(it => it.name === module.name);
                if (extension) {
                  module.i18n = extension.i18n;
                }
                return module;
              }),
            ...result.data.filter(val => this.installedList.every(childVal => childVal.name !== val.name))
          ];
          //Handle feature data
          result.data = result.data.map(module => {
            let result = this.extensionCommon.parseExtensionInfo(module);
            return result;
          });

          //Get debug extensions
          this.webExtensionService.debugExtensions = result.data.filter(val => val.isDebug);

          this.extensionCommon.setExtensionList(result.data);
          this.requestPending = null;
          this.isFirstInit = false;
          resolve([result, originData]);
        },
        error: () => {
          this.requestPending = null;
          reject([]);
        }
      });
    });
    // const result: any = await lastValueFrom(, {
    //   defaultValue: []
    // });
  }
  async getDetail(name): Promise<any> {
    let result = {} as ExtensionInfo;
    const { code, data }: any = await this.requestDetail(name);
    Object.assign(result, data);
    if (this.installedMap?.has(name)) {
      Object.assign(result, this.installedMap.get(name), { installed: true });
      result.enable = this.isEnable(result.name);
    }
    result = this.extensionCommon.parseExtensionInfo(result);
    return result;
  }
  /**
   *  install extension by id
   *
   * @param id
   * @param isInit first time install
   * @returns if install success
   */
  async installExtension({ name, version = 'latest' }, isInit = false): Promise<boolean> {
    const successCallback = () => {
      this.updateInstalledInfo(this.getExtensions(), {
        action: isInit ? 'init' : 'install',
        name
      });
      if (isInit) return;
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
    const extension = this.installedList.find(it => it.name === name);
    const successCallback = () => {
      this.updateInstalledInfo(this.getExtensions(), {
        action: 'uninstall',
        name,
        extension
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
    StorageUtil.set(DISABLE_EXTENSION_NAMES, arr);
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
    return StorageUtil.get(DISABLE_EXTENSION_NAMES) || [];
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
}
