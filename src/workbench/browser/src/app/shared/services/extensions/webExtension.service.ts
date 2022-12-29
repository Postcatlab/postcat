import { Injectable } from '@angular/core';
import { DISABLE_EXTENSION_NAMES } from 'eo/workbench/browser/src/app/shared/constants/storageKeys';
import StorageUtil from 'eo/workbench/browser/src/app/utils/storage/Storage';

type ExtensionItem = {
  name: string;
  version: string;
  url: string;
  disable: boolean;
  pkgInfo: Record<string, any>;
};

const extKey = 'ext_installed_list';

//* Web Extension manage service
//! Can't import by other component,please use ExtensionService
@Injectable({
  providedIn: 'root'
})
export class WebExtensionService {
  installedList: ExtensionItem[] = StorageUtil.get(extKey, []);
  disabledExtensionNames = [];

  constructor() {}
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
      return true;
    } else {
      pcConsole.error(`[Install package] ${data}`);
      // this.message.info(data);
      return false;
    }
  }
  getExtensions() {
    return this.installedList.map(n => [n.name, n.pkgInfo]);
  }
  unInstallExtension(extName: string): boolean {
    this.installedList = this.installedList.filter(n => n.name !== extName);
    StorageUtil.set(extKey, this.installedList);
    return true;
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
}
