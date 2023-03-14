import { Injectable } from '@angular/core';
import { SettingService } from 'pc/browser/src/app/components/system-setting/settings.service';
import { ElectronService } from 'pc/browser/src/app/core/services/electron/electron.service';
import { LANGUAGES } from 'pc/browser/src/app/core/services/language/language.model';
import { TraceService } from 'pc/browser/src/app/services/trace.service';
import { APP_CONFIG } from 'pc/browser/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  languages = LANGUAGES;
  //If the user does not set it, the system default language is used
  // Web from nginx setting and App from computer system setting
  systemLanguage;
  langHashMap = new Map().set('zh-Hans', 'zh').set('en-US', 'en');
  constructor(private electron: ElectronService, private setting: SettingService, private trace: TraceService) {
    //Curent language
    this.systemLanguage =
      this.languages.find(val => window.location.pathname.includes(`/${val.path}/`))?.value ||
      this.setting.settings?.['system.language'] ||
      (navigator.language.includes('zh') ? 'zh-Hans' : 'en-US');
    this.trace.setUser({ app_language: this.systemLanguage });
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
