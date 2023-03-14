import { Injectable } from '@angular/core';
import { TranslateService } from 'pc/platform/common/i18n';

import { LanguageService } from '../../core/services/language/language.service';
import { ExtensionInfo } from '../../shared/models/extension-manager';
@Injectable({
  providedIn: 'root'
})
export class ExtensionCommonService {
  private extensionList: ExtensionInfo[];
  constructor(private language: LanguageService) {}
  setExtensionList(list) {
    this.extensionList = list;
  }
  get getExtensionList() {
    return this.extensionList;
  }
  private translateModule(module: ExtensionInfo) {
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
  /**
   * Parse extension info for ui show
   * such as: author, translate ...
   *
   * @param pkg
   * @returns
   */
  parseExtensionInfo(pkg): ExtensionInfo {
    pkg = this.translateModule(pkg);
    if (typeof pkg.author === 'object') {
      pkg.author = pkg.author['name'] || '';
    }
    return pkg;
  }
}
