import { Injectable } from '@angular/core';
import { FeatureType } from 'eo/workbench/browser/src/app/shared/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StorageUtil } from '../../../utils/storage/Storage';

type ExtensionItem = {
  name: string;
  version: string;
  url: string;
  disable: boolean;
  pkgInfo: Record<string, any>;
};

const extKey = 'ext_installed_list';

@Injectable({
  providedIn: 'root',
})
export class WebExtensionService {
  installedList: ExtensionItem[] = StorageUtil.get(extKey, []);

  constructor(private message: NzMessageService) {
    this.installedList.forEach((n) => {
      this.installExtension(n.name);
    });
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
    script.text = scriptText;
    document.head.appendChild(script);
  }

  async getPkgInfo(extName: string) {
    const res = await fetch(`https://unpkg.com/${extName}/package.json`);
    return res.json();
  }

  getFeatures(featureName: string): Map<string, FeatureType> {
    const featureMap = new Map<string, FeatureType>([]);
    this.installedList.forEach((item) => {
      const feature: FeatureType = item.pkgInfo?.features?.[featureName];
      if (feature) {
        featureMap.set(item.name, feature);
      }
    });
    return featureMap;
  }
}
