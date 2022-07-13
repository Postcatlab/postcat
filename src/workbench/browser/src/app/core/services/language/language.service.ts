import { Injectable } from '@angular/core';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services/electron/electron.service';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/remote/remote.service';
import { LANGUAGES } from 'eo/workbench/browser/src/app/core/services/language/language.model';
import { SettingService } from 'eo/workbench/browser/src/app/core/services/settings/settings.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  languages = LANGUAGES;
  //If the user does not set it, the system default language is used
  // Web from nginx setting and App from computer system setting
  systemLanguage =
    this.languages.find((val) => window.location.href.includes(`/${val.path}`))?.value ||
    (navigator.language.includes('zh') ? 'zh-Hans' : 'en-US');

  constructor(private remote: RemoteService, private electron: ElectronService,private setting:SettingService) {}

  init() {
    this.changeLanguage(this.setting.getSettings()?.['eoapi-language']);
  }
  changeLanguage(localeID) {
    if (!localeID || localeID === this.systemLanguage) {
      console.warn(`current language has already ${localeID}`);
      return;
    }
    this.systemLanguage = localeID;
    const localePath = (this.languages.find((val) => val.value === localeID) || this.languages[0]).path;
    if (this.electron.isElectron) {
      this.electron.ipcRenderer.send('message', {
        action: 'changeLanguage',
        data: this.systemLanguage,
      });
    } else {
      window.location.href = `/${localePath}`;
    }
  }
}
