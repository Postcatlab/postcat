import { app } from 'electron';
import { LANGUAGES } from '../../workbench/browser/src/app/core/services/language/language.model';
import Store from 'electron-store';
const store = new Store();
class LanguageInstance {
  private static _instance: LanguageInstance;
  constructor() {}
  public static get Instance(): LanguageInstance {
    return this._instance || (this._instance = new this());
  }
  get() {
    return store.get('language') || (app.getLocale().includes('zh') ? 'zh-Hans' : 'en-US');
  }
  getPath() {
    const currentLanguage = this.get();
    return LANGUAGES.find((val) => val.value === currentLanguage).path;
  }
  set(localeID) {
    store.set('language', localeID);
  }
}
export const LanguageService = LanguageInstance.Instance;
