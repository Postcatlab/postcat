import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { BaseUIThemeType, MainColorType } from '../../../modules/system-setting/common/select-theme/theme.model';
import StorageUtil from '../../../utils/storage/Storage';
import coreThemeJSON from './../../../../extensions/core-themes/package.json';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  module = {
    baseTheme: {
      id: 'baseTheme',
      path: '',
      injectDirection: 'prepend',
      key: 'theme_base', //for storage and id prefix
      default: 'light' as BaseUIThemeType
    },
    coreTheme: {
      id: 'coreTheme',
      path: './assets/theme/',
      injectDirection: 'append',
      key: 'theme_core',
      default: 'default' as MainColorType
    }
  };
  baseTheme: BaseUIThemeType = StorageUtil.get(this.module.baseTheme.key) || this.module.baseTheme.default;
  coreTheme: MainColorType = StorageUtil.get(this.module.coreTheme.key) || this.module.coreTheme.default;
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.queryCoreTheme();
  }
  initConfig() {}
  async queryCoreTheme() {
    const defaultTheme = coreThemeJSON.features.theme;
    const themes = [];
    for (var i = 0; i < defaultTheme.length; i++) {
      const theme = defaultTheme[i];
      const path = new URL(theme.path, `${window.location.origin}/extensions/core-themes/`).href;
      const result = await fetch(path).then(res => res.json());
      themes.push(result);
    }
    console.log(themes);
  }
  initTheme() {
    this.changeBaseTheme(this.baseTheme, true);
    this.changeColor(this.coreTheme, true);
  }
  changeTheme(name) {
    this.changeBaseTheme(name.includes('dark') ? 'dark' : 'light');
    this.changeColor(name.replace('dark-', ''));
  }
  private getEditorTheme(baseTheme) {
    //Default Theme: https://microsoft.github.io/monaco-editor/index.html
    //'vs', 'vs-dark' or 'hc-black'
    return baseTheme === 'dark' ? 'vs-dark' : 'vs';
  }
  changeEditorTheme(theme?) {
    theme = theme || this.getEditorTheme(this.baseTheme);
    if (window.monaco?.editor) {
      window.monaco?.editor.setTheme(theme);
    }
  }
  changeBaseTheme(name: BaseUIThemeType, firstLoad = false) {
    this.changeModule('baseTheme', name, firstLoad);
  }

  changeColor(name: MainColorType, firstLoad = false) {
    this.changeModule('coreTheme', name, firstLoad);
  }
  changeModule(mid: 'baseTheme' | 'coreTheme', name, firstLoad) {
    if (!firstLoad && (!name || name === this[mid])) {
      return;
    }
    const module = this.module[mid];
    const href = `${module.path}${name}.css`;
    const className = `pc-theme-${name}`;
    if (mid === 'coreTheme' && name === 'default') {
      this.removeCss(this[mid]);
      //@ts-ignore
      this[mid] = name;
      this.document.documentElement.classList.add(className);
      StorageUtil.set(module.key, name);
      return;
    }
    this.loadCss(href, name, module.injectDirection)
      .then(() => {
        if (!firstLoad) {
          this.removeCss(this[mid]);
          //@ts-ignore
          this[mid] = name;
        }
        if (mid === 'baseTheme') {
          this.changeEditorTheme(this.getEditorTheme(name));
        }
        this.document.documentElement.classList.add(className);
        StorageUtil.set(module.key, name);
      })
      .catch(e => {});
  }
  private removeCss(theme): void {
    const removedThemeStyle = this.document.querySelectorAll(`[id=core_theme_${theme}]`);
    this.document.documentElement.classList.remove(`pc-theme-${theme}`);
    if (!removedThemeStyle?.length) {
      return;
    }
    removedThemeStyle.forEach(dom => {
      this.document.head.removeChild(dom);
    });
  }
  private loadCss(href, id: string, injectDirection): Promise<Event> {
    return new Promise((resolve, reject) => {
      const dom = this.document.createElement('link');
      dom.rel = 'stylesheet';
      dom.href = href;
      dom.id = `core_theme_${id}`;
      this.document.head[injectDirection](dom);
      dom.onload = resolve;
      dom.onerror = e => {
        console.log('theme change error:', e);
        reject();
      };
    });
  }
}
