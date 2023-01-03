import { Injectable } from '@angular/core';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services/electron/electron.service';
import { LANGUAGES } from 'eo/workbench/browser/src/app/core/services/language/language.model';
import { SettingService } from 'eo/workbench/browser/src/app/modules/system-setting/settings.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  languages = LANGUAGES;
  //If the user does not set it, the system default language is used
  // Web from nginx setting and App from computer system setting
  systemLanguage;

  langHashMap = new Map().set('zh-Hans', 'zh').set('en-US', 'en');
  constructor(private electron: ElectronService, private setting: SettingService) {
    this.systemLanguage =
      this.setting.settings?.['system.language'] ||
      this.languages.find(val => window.location.href.includes(`/${val.path}`))?.value ||
      (navigator.language.includes('zh') ? 'zh-Hans' : 'en-US');
  }
  get langHash() {
    return this.langHashMap.get(this.systemLanguage);
  }
  init() {
    this.changeLanguage(this.setting.settings?.['system.language']);
  }
  changeLanguage(localeID) {
    if (!localeID || localeID === this.systemLanguage) {
      pcConsole.warn(`[languageService]: current language has already ${localeID}`);
      return;
    }
    this.systemLanguage = localeID;
    // const localePath = (this.languages.find((val) => val.value === localeID) || this.languages[0]).path;
    if (this.electron.isElectron) {
      this.electron.ipcRenderer.send('message', {
        action: 'changeLanguage',
        data: this.systemLanguage
      });
    } else {
      const url = window.location.href;
      window.location.replace(url.replace(/\/(zh|en)\/home\//, `/${this.langHashMap.get(localeID)}/home/`));
    }
  }
}
