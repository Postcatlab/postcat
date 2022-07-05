import { app } from 'electron';
import Store from 'electron-store';
const store = new Store();
class LanguageInstance {
  private static _instance: LanguageInstance;
  language = [
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
  constructor() {}
  public static get Instance(): LanguageInstance {
    return this._instance || (this._instance = new this());
  }
  get() {
    return store.get('language') || (app.getLocale().includes('zh') ? 'zh-Hans' : 'en-US');
  }
  getPath() {
    const currentLanguage = this.get();
    return this.language.find((val) => val.value === currentLanguage).path;
  }
  set(localeID) {
    store.set('language', localeID);
  }
}
export const LanguageService = LanguageInstance.Instance;
