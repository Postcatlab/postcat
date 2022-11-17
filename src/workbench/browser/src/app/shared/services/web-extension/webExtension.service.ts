import { Injectable } from '@angular/core';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StorageUtil } from '../../../utils/storage/Storage';
import { FeatureInfo } from 'eo/platform/node/extension-manager/types';
import { ConsoleSqlOutline } from '@ant-design/icons-angular/icons';

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
  providedIn: 'root',
})
export class WebExtensionService {
  installedList: ExtensionItem[] = StorageUtil.get(extKey, []);

  constructor(private message: NzMessageService, private webService: WebService) {}

  init() {
    if (this.webService.isWeb) {
      defaultExtensions.forEach((n) => {
        const isInstall = this.getExtensionByName(n);
        isInstall || this.installedList.push({ name: n } as any);
      });
      this.installedList.forEach((n) => {
        this.installExtension(n.name);
      });
    }
  }

  async installExtension(extName: string) {
    const res = await fetch(`https://unpkg.com/${extName}`);
    const data = await res.text();
    if (res.status === 200) {
      this.insertScript(data);
      const pkgJson = await this.getPkgInfo(extName);
      const pkgObj = typeof pkgJson === 'object' ? pkgJson : JSON.parse(pkgJson);
      const oldIndex = this.installedList.findIndex((n) => n.name === extName);
      this.installedList.splice(oldIndex, oldIndex === -1 ? 0 : 1, {
        name: extName,
        disable: false,
        version: pkgObj.version,
        url: res.url,
        pkgInfo: pkgObj,
      });
      StorageUtil.set(extKey, this.installedList);
      return true;
    } else {
      this.message.info(data);
      return false;
    }
  }

  unInstallExtension(extName: string) {
    this.installedList = this.installedList.filter((n) => n.name !== extName);
    StorageUtil.set(extKey, this.installedList);
  }

  getExtensionByName(extName: string) {
    return this.installedList.find((n) => n.name === extName);
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

  async getPkgInfo(extName: string) {
    const res = await fetch(`https://unpkg.com/${extName}/package.json`);
    return res.json();
  }

  importModule = async (extName: string) => {
    if (!window[extName]) {
      await this.installExtension(extName);
    }
    return window[extName];
  };

  getFeatures(featureName: string): Map<string, FeatureInfo> {
    if (window?.eo?.getFeature) {
      return window.eo.getFeature(featureName);
    }
    const featureMap = new Map<string, FeatureInfo>([]);
    this.installedList.forEach((item) => {
      const feature: FeatureInfo = item.pkgInfo?.features?.[featureName];
      if (feature) {
        featureMap.set(item.name, feature);
      }
    });
    if (featureMap.size === 0) {
      return;
    }
    return featureMap;
  }
}
