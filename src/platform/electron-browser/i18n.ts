import { LANGUAGES } from '../../browser/src/app/core/services/language/language.model';
import { getLocaleData } from '../node/i18n';
export class I18N {
  constructor() {}
  getSystemLanguage() {
    // let deafultLanguage =
    //   LANGUAGES.find(val => window.location.href.includes(`/${val.path}`))?.value ||
    //   (navigator.language.includes('zh') ? 'zh-Hans' : 'en-US');
    // return window.eo.getSettings()['eoapi-language'] || deafultLanguage;
  }
  localize(id: string, originText: string, ...args) {
    // let result = originText;
    // const locale: Object = getLocaleData(window.eo.getModule(window.eo._currentExtensionID), this.getSystemLanguage());
    // if (!locale) return result;
    // result ??= locale[id];
    // result = result.replace(/\{(\d+)\}/g, (match, rest) => {
    //   let index = rest[0];
    //   let arg = args[index];
    //   let replacement = match;
    //   if (typeof arg === 'string') {
    //     replacement = arg;
    //   } else if (typeof arg === 'number' || typeof arg === 'boolean' || arg === void 0 || arg === null) {
    //     replacement = String(arg);
    //   }
    //   return replacement;
    // });
    // return result;
  }
}
