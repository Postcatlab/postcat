import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { DISABLE_EXTENSION_NAMES } from 'eo/workbench/browser/src/app/shared/constants/storageKeys';
import { FeatureInfo } from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import StorageUtil from 'eo/workbench/browser/src/app/utils/storage/Storage';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';
import { lastValueFrom } from 'rxjs';

type ExtensionItem = {
  name: string;
  version: string;
  url: string;
  disable: boolean;
  pkgInfo: Record<string, any>;
};

const extKey = 'ext_installed_list';
const defaultExtensions = ['eoapi-export-openapi', 'eoapi-import-openapi'];

@Injectable({
  providedIn: 'root'
})
export class WebExtensionService {
  installedList: ExtensionItem[] = StorageUtil.get(extKey, []);
  disabledExtensionNames = [];

  constructor(
    private message: EoNgFeedbackMessageService,
    private webService: WebService,
    private messageService: MessageService,
    private http: HttpClient,
    private language: LanguageService
  ) {}

  async init() {
    const { data } = await lastValueFrom<any>(this.http.get(`${APP_CONFIG.MOCK_URL}/list?locale=${this.language.systemLanguage}`));
    if (this.webService.isWeb) {
      defaultExtensions.forEach(n => {
        const isInstall = this.getExtensionByName(n);
        isInstall || this.installedList.push({ name: n } as any);
      });
      this.installedList.forEach(n => {
        const target = data.find(m => m.name === n.name);
        if (target) {
          this.installExtension(target.name, target.version, target.main);
        }
      });
    }
  }

  async installExtension(extName: string, version = 'latest', entry = '') {
    const url = `${extName}@${version}${entry ? `/${entry}` : entry}`;
    const fullPath = new URL(url, 'https://unpkg.com');
    const res = await fetch(fullPath);
    const data = await res.text();
    if (res.status === 200) {
      this.insertScript(data);
      const pkgJson = await this.getPkgInfo(extName, version);
      const pkgObj = typeof pkgJson === 'object' ? pkgJson : JSON.parse(pkgJson);
      const oldIndex = this.installedList.findIndex(n => n.name === extName);
      this.installedList.splice(oldIndex, oldIndex === -1 ? 0 : 1, {
        name: extName,
        disable: false,
        version: pkgObj.version,
        url: res.url,
        pkgInfo: pkgObj
      });
      StorageUtil.set(extKey, this.installedList);
      this.emitLocalExtensionsChangeEvent();
      return true;
    } else {
      this.message.info(data);
      return false;
    }
  }

  unInstallExtension(extName: string) {
    this.installedList = this.installedList.filter(n => n.name !== extName);
    this.emitLocalExtensionsChangeEvent();
    StorageUtil.set(extKey, this.installedList);
  }

  getExtensionByName(extName: string) {
    return this.installedList.find(n => n.name === extName);
  }

  isEnable(name: string) {
    return !this.getDisabledExtensionNames().includes(name);
  }

  getDisabledExtensionNames() {
    try {
      return (this.disabledExtensionNames = JSON.parse(localStorage.getItem(DISABLE_EXTENSION_NAMES) || '[]'));
    } catch (error) {
      return [];
    }
  }

  insertScript(scriptText) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    const text = `
    (() => {
      const __define = global.define;
      global.define = undefined;
      ${scriptText}

      ;global.define = __define;
    })()
    `;
    script.text = text;
    document.head.appendChild(script);
  }

  async getPkgInfo(extName: string, version = 'latest') {
    const res = await fetch(`https://unpkg.com/${extName}@${version}/package.json`);
    return res.json();
  }

  importModule = async (extName: string) => {
    if (!window[extName]) {
      await this.installExtension(extName);
    }
    return window[extName];
  };

  getFeatures<T = FeatureInfo>(featureName: string): Map<string, T> {
    if (window.eo?.getFeature) {
      return window.eo.getFeature(featureName);
    }
    const featureMap = new Map<string, T>([]);
    this.installedList.forEach(item => {
      const feature: T = item.pkgInfo?.features?.[featureName];
      if (feature) {
        featureMap.set(item.name, {
          extensionID: item.name,
          ...feature
        });
      }
    });
    return featureMap;
  }

  private emitLocalExtensionsChangeEvent() {
    this.messageService.send({ type: 'localExtensionsChange', data: this.installedList });
  }
}
