import { Injectable } from '@angular/core';
import { TranslateService } from 'eo/platform/common/i18n';
import { DISABLE_EXTENSION_NAMES } from 'eo/workbench/browser/src/app/shared/constants/storageKeys';
import { eoDeepCopy } from 'eo/workbench/browser/src/app/utils/index.utils';
import StorageUtil from 'eo/workbench/browser/src/app/utils/storage/Storage';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';

import { WebService } from '../../../core/services';
import { LanguageService } from '../../../core/services/language/language.service';
import { ExtensionInfo } from '../../models/extension-manager';

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
  debugExtensions = [];
  debugExtensionNames;
  resourceUrl = 'https://unpkg.com';
  constructor(private web: WebService, private language: LanguageService) {
    this.debugExtensionNames =
      !APP_CONFIG.production || this.web.isVercel || 'http://54.255.141.14:8080'.includes(window.location.hostname) ? [] : [];
  }
  async installExtension(extName: string, { version = 'latest', entry = '', i18n = [] }) {
    const url = `${extName}@${version}${entry ? `/${entry}` : entry}`;
    const fullPath = new URL(url, this.resourceUrl);
    const install = async pkgJson => {
      let pkgObj: ExtensionInfo = typeof pkgJson === 'object' ? pkgJson : JSON.parse(pkgJson);
      if (pkgObj.features instanceof Object) {
        for (let featureKey in pkgObj.features) {
          const featureVal = pkgObj.features[featureKey];
          switch (featureKey) {
            case 'theme': {
              if (!(featureVal instanceof Array)) {
                return;
              }
              try {
                for (var i = 0; i < featureVal.length; i++) {
                  const theme = featureVal[i];
                  const path = new URL(theme.path, `${this.resourceUrl}/${pkgObj.name}/package.json`).href.replace(
                    `${window.location.origin}/`,
                    ''
                  );
                  let colors = await fetch(path)
                    .then(res => res.json())
                    .catch(e => {
                      colors = {};
                    });
                  if (!colors) {
                    pcConsole.error('theme load error', theme.label);
                    return;
                  }
                  Object.assign(theme, colors);
                }
                pkgObj.features[featureKey] = featureVal;
              } catch (e) {
                console.error(e);
              }
              break;
            }
            default: {
              break;
            }
          }
        }
      }
      const oldIndex = this.installedList.findIndex(n => n.name === extName);
      pkgJson.i18n = i18n;
      pkgObj = this.translateModule(pkgObj);
      this.installedList.splice(oldIndex, oldIndex === -1 ? 0 : 1, {
        name: extName,
        disable: false,
        version: pkgObj.version,
        url: res.url,
        pkgInfo: pkgObj
      });
      StorageUtil.set(extKey, this.installedList);
    };

    const res = await fetch(fullPath);
    let pkgJson;
    if (!this.debugExtensionNames.includes(extName)) {
      pkgJson = await this.getPkgInfo(extName, version);
    } else {
      pkgJson = await this.getDebugExtensionsPkgInfo(extName, version);
    }
    if (res.status === 200) {
      const data = await res.text();
      this.insertScript(data);
      await install(pkgJson);
      return true;
    } else {
      if (!pkgJson) {
        pcConsole.error(`[Install package] ${extName} error`);
        // this.message.info(data);
        return false;
      }
      await install(pkgJson);
      return true;
    }
  }
  getExtensionsByFeature(featureKey, installedList) {
    let extensions = new Map();
    installedList.forEach(item => {
      let feature = eoDeepCopy(item.features?.[featureKey]);
      if (!feature) return;
      switch (featureKey) {
        case 'theme': {
          extensions.set(item.name, {
            extensionID: item.name,
            theme: feature
          });
          break;
        }
        default: {
          extensions.set(item.name, {
            extensionID: item.name,
            ...feature
          });
        }
      }
    });
    return extensions;
  }
  getExtensions() {
    return this.installedList.map(n => [n.name, n.pkgInfo]);
  }
  async getDebugExtensionsPkgInfo(extName, version = 'latest') {
    let result = await this.getPkgInfo(extName, version);
    //Transalte debug module
    try {
      const lang = this.language.systemLanguage;
      const path = new URL(`${this.resourceUrl}/${result.name}/i18n/${lang}.json`);
      let localePackage = await fetch(path)
        .then(res => res.json())
        .catch(e => {});
      if (!result) return result;
      result.i18n = [
        {
          locale: lang,
          package: localePackage
        }
      ];
      result.isDebug = true;
    } catch (e) {
      console.error(e);
    }
    return result;
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
    const res = await fetch(`${this.resourceUrl}/${extName}@${version}/package.json`);
    return res.status === 200 ? res.json() : '';
  }
  translateModule(module: ExtensionInfo) {
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
