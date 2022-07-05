import { Injectable } from '@angular/core';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services/electron/electron.service';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/remote/remote.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  languages = [
    {
      name: 'English',
      value: 'en-US',
      path: 'en',
    },
    {
      name: '简体中文',
      value: 'zh-Hans',
      path: 'zh',
    },
  ];
  //If the user does not set it, the system default language is used
  // Web from nginx setting and App from computer system setting
  currentLanguage =(this.languages.find((val) => window.location.href.includes(`/${val.path}`))?.value) ||(navigator.language.includes('zh') ? 'zh-Hans' : 'en-US');

  constructor(private remote: RemoteService, private electron: ElectronService) {}

  init() {
    console.log(
      `currentLangaue:${this.currentLanguage},systemLangaue:${this.remote.getSettings()?.['eoapi-language']}`
    );
    this.changeLanguage(this.remote.getSettings()?.['eoapi-language']);
  }
  changeLanguage(localeID) {
    if (!localeID || localeID === this.currentLanguage) {
      console.warn(`current language has already ${localeID}`);
      return;
    }
    this.currentLanguage = localeID;
    const localePath = (this.languages.find((val) => val.value === localeID) || this.languages[0]).path;
    if (this.electron.isElectron) {
      this.electron.ipcRenderer.send('message', {
        action: 'changeLanguage',
        data: this.currentLanguage,
      });
    } else {
      window.location.href = `/${localePath}`;
    }
  }
}
