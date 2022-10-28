import {ModuleInfo } from 'eo/platform/node/extension-manager';

interface LooseObject {
  [key: string]: any;
}
const localeStorage: LooseObject = {};
/**
 * Get locale file from extension i18 file dir
 * @param moduleID
 * @returns json
 */
function getLocaleFile(module: ModuleInfo, lang): Object {
  let result = {};
  try {
    result = require(`${module.baseDir}/i18n/${lang}.json`);
  } catch (e) {}
  return result;
}
function getSupportLang(module: ModuleInfo) {
  return [module.features.i18n.sourceLocale, ...module.features.i18n.locales].filter((val) => val);
}
/**
 * Get locale data from storage  or file
 * @returns json
 */
export function getLocaleData(module: ModuleInfo, lang): Object | null {
  let supportLang = getSupportLang(module);
  if (!supportLang.includes(lang)) {
    console.log(`Error: extenaion ${module.moduleID} can't find the i18n package ${lang}`);
    return null;
  }
  localeStorage[module.moduleID] = localeStorage[module.moduleID] || {};
  if (!localeStorage[module.moduleID][lang]) {
    localeStorage[module.moduleID][lang] = getLocaleFile(module, lang);
  }
  return localeStorage[module.moduleID][lang];
}
