import { app } from 'electron';
import Store from 'electron-store';

import { LANGUAGES } from '../../workbench/browser/src/app/core/services/language/language.model';
const store = new Store();
class LanguageInstance {
  private static _instance: LanguageInstance;
  constructor() {}
  public static get Instance(): LanguageInstance {
    return this._instance || (this._instance = new this());
  }
  get(): string {
    let lang = store.get('language') || (app.getLocale().includes('zh') ? 'zh-Hans' : 'en-US');
    return lang as string;
  }
  getPath() {
    const systemLanguage = this.get();
    return LANGUAGES.find(val => val.value === systemLanguage).path;
  }
  set(localeID) {
    store.set('language', localeID);
  }
}
export const LanguageService = LanguageInstance.Instance;
