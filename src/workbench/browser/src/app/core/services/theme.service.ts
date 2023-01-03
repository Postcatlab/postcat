import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { AppearanceType, MainColorType } from '../../modules/system-setting/common/select-theme/theme.model';
import StorageUtil from '../../utils/storage/Storage';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  module = {
    appearance: {
      id: 'appearance',
      path: '',
      injectDirection: 'prepend',
      storageKey: 'theme_appearance',
      default: 'light' as AppearanceType
    },
    mainColor: {
      id: 'mainColor',
      path: './assets/theme/',
      injectDirection: 'append',
      storageKey: 'theme_mainColor',
      default: 'default' as MainColorType
    }
  };
  appearance: AppearanceType = StorageUtil.get(this.module.appearance.storageKey) || this.module.appearance.default;
  mainColor: MainColorType = StorageUtil.get(this.module.mainColor.storageKey) || this.module.mainColor.default;
  constructor(@Inject(DOCUMENT) private document: Document) {}
  initTheme() {
    this.changeAppearance(this.appearance, true);
    this.changeColor(this.mainColor, true);
  }
  changeTheme(name) {
    this.changeAppearance(name.includes('dark') ? 'dark' : 'light');
    this.changeColor(name.replace('dark-', ''));
  }
  private getEditorTheme(appearance) {
    //Default Theme: https://microsoft.github.io/monaco-editor/index.html
    //'vs', 'vs-dark' or 'hc-black'
    return appearance === 'dark' ? 'vs-dark' : 'vs';
  }
  changeEditorTheme(theme?) {
    theme = theme || this.getEditorTheme(this.appearance);
    if (monaco?.editor) {
      monaco?.editor.setTheme(theme);
    }
  }
  changeAppearance(name: AppearanceType, firstLoad = false) {
    this.changeModule('appearance', name, firstLoad);
  }

  changeColor(name: MainColorType, firstLoad = false) {
    this.changeModule('mainColor', name, firstLoad);
  }
  changeModule(mid: 'appearance' | 'mainColor', name, firstLoad) {
    if (!firstLoad && (!name || name === this[mid])) {
      return;
    }
    const module = this.module[mid];
    const href = `${module.path}${name}.css`;
    const className = `eo-theme-${name}`;
    if (mid === 'mainColor' && name === 'default') {
      this.removeCss(this[mid]);
      //@ts-ignore
      this[mid] = name;
      this.document.documentElement.classList.add(className);
      StorageUtil.set(module.storageKey, name);
      return;
    }
    this.loadCss(href, name, module.injectDirection)
      .then(() => {
        if (!firstLoad) {
          this.removeCss(this[mid]);
          //@ts-ignore
          this[mid] = name;
        }
        if (mid === 'appearance') {
          this.changeEditorTheme(this.getEditorTheme(name));
        }
        this.document.documentElement.classList.add(className);
        StorageUtil.set(module.storageKey, name);
      })
      .catch(e => {});
  }
  private removeCss(theme): void {
    const removedThemeStyle = this.document.querySelectorAll(`[id=${theme}]`);
    this.document.documentElement.classList.remove(`eo-theme-${theme}`);
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
      dom.id = id;
      this.document.head[injectDirection](dom);
      dom.onload = resolve;
      dom.onerror = e => {
        console.log('theme change error:', e);
        reject();
      };
    });
  }
}
