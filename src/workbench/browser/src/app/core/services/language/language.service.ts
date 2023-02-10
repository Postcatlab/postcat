import { Injectable } from '@angular/core';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services/electron/electron.service';
import { LANGUAGES } from 'eo/workbench/browser/src/app/core/services/language/language.model';
import { SettingService } from 'eo/workbench/browser/src/app/modules/system-setting/settings.service';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';

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
    //Curent language
    this.systemLanguage =
      this.languages.find(val => window.location.pathname.includes(`/${val.path}/`))?.value ||
      this.setting.settings?.['system.language'] ||
      (navigator.language.includes('zh') ? 'zh-Hans' : 'en-US');
  }
  get langHash() {
    return this.langHashMap.get(this.systemLanguage);
  }
  init() {
    //System language First
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
      this.setting.set('system.language', localeID);

      return;
    }
    const url = window.location.href;
    const targetUrl = url.replace(/\/(zh|en)\/home\//, `/${this.langHashMap.get(localeID)}/home/`);
    this.setting.set('system.language', localeID);
    if (APP_CONFIG.production && url === targetUrl) return;
    window.location.replace(targetUrl);
  }
}
