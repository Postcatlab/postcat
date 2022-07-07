import { LANGUAGES } from '../..//workbench/browser/src/app/core/services/language/language.model';
export const I18N = {
  getSystemLanguage: () => {
    let deafultLanguage =
      LANGUAGES.find((val) => window.location.href.includes(`/${val.path}`))?.value ||
      (navigator.language.includes('zh') ? 'zh-Hans' : 'en-US');
    return window.eo.getSettings()['eoapi-language'] || deafultLanguage;
  },
  locale(id: string, originText: string, ...args) {
    console.log('i18n locale:', arguments);
  },
};
