import { ExtensionInfo } from 'pc/browser/src/app/shared/models/extension-manager';
/**
 * Single extension i18 service,chain call
 */
export class TranslateService {
  // Default key in package.json translate replace directly
  defaultKeys = ['title', 'description', 'author', 'logo'];
  constructor(private module: ExtensionInfo, private locale) {}
  translate() {
    return this.translateDefaultKey().translateVariableKey().get();
  }
  get() {
    return this.module;
  }
  translateDefaultKey() {
    this.defaultKeys.forEach(defaultKey => {
      if (!this.module[defaultKey] || !this.locale[defaultKey]) return;
      this.module[defaultKey] = this.locale[defaultKey];
    });
    return this;
  }
  /**
   * Transalte package.json variable ${} to locale text
   */
  translateVariableKey() {
    this.translateObject(this.locale, this.module.features, {
      currentLevel: 0,
      maxLevel: 4
    });
    return this;
  }
  /**
   * Loop translate object
   *
   * @param locale
   * @param origin
   * @param opts.maxLevel loop object level
   */
  private translateObject(locale, origin, opts) {
    if (opts.currentLevel >= opts.maxLevel) return;
    Object.keys(origin).forEach(name => {
      if (typeof origin[name] !== 'string') {
        let newOpts = { maxLevel: opts.maxLevel, currentLevel: opts.currentLevel + 1 };
        this.translateObject(locale, origin[name], newOpts);
        return;
      }
      origin[name] = this.translateString(locale, origin[name]);
    });
  }
  /**
   * Translate primitive data types(string/numebr/..)
   *
   * @param locale
   * @param variable
   */
  private translateString(locale, variable) {
    return variable.replace(/\$\{(.+)\}/g, (match, rest) => {
      let replacement = match;
      replacement = locale[rest] || replacement;
      return replacement;
    });
  }
}
