import { ModuleInfo } from 'eo/platform/node/extension-manager';
/**
 * Single extension i18 service,chain call
 */
export class TranslateService {
  // Default key in package.json translate replace directly
  defaultKeys = ['moduleName', 'description', 'author', 'logo'];
  constructor(private module: ModuleInfo, private locale) {}
  translate() {
    return this.translateDefaultKey().translateVariableKey().get();
  }
  get() {
    return this.module;
  }
  translateDefaultKey() {
    this.defaultKeys.forEach((defaultKey) => {
      if (!this.module[defaultKey] || !this.locale[defaultKey]) return;
      this.module[defaultKey] = this.locale[defaultKey];
    });
    return this;
  }
  /**
   * Transalte package.json variable ${} to locale text
   */
  translateVariableKey() {
    let that = this;
    Object.keys(this.module.features).forEach((name) => {
      let feature = that.module.features[name];
      Object.keys(feature).forEach((childName) => {
        if (typeof feature[childName] !== 'string') return;
        that.module.features[name][childName] = feature[childName].replace(/\$\{(.+)\}/g, (match, rest) => {
          let replacement = match;
          replacement = that.locale[rest] || replacement;
          return replacement;
        });
      });
    });
    return this;
  }
}
