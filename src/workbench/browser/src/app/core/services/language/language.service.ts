import { Injectable } from '@angular/core';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/remote/remote.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  currentLanguage = navigator.language.includes('zh') ? 'zh-Hans' : 'en-US';
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
  constructor(private remote: RemoteService) {}
  init() {
    const configLanguage = this.remote.getSettings()?.['eoapi-language'] || this.currentLanguage;
    this.changeLanguage(configLanguage);
  }
  changeLanguage(localeID) {
    if (localeID === this.currentLanguage) {
      console.warn(`current language has already ${localeID}`);
      return;
    }
    this.currentLanguage = localeID;
    window.location.href = `/${(this.languages.find((val) => val.value === localeID) || this.languages[0]).path}`;
  }
}
