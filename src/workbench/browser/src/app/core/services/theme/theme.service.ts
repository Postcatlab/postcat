import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import lightDefault from '../../../../extensions/core-themes/themes/light-default.json';
import StorageUtil from '../../../utils/storage/Storage';
import { ThemeVariableService } from './theme-variable.service';
import { SsystemUIThemeType, SYSTEM_THEME, ThemeColors } from './theme.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  themes = [];
  /**
   * @description system inject theme,provide baseTheme for extension themes
   */
  private coreThemes = [
    {
      id: 'pc',
      colors: {},
      customColors: lightDefault.colors
    },
    {
      id: 'pc-dark',
      colors: {},
      customColors: lightDefault.colors
    }
  ];
  private module = {
    baseTheme: {
      path: '',
      injectDirection: 'prepend',
      key: 'theme_base', //for storage and id prefix
      default: 'light' as SsystemUIThemeType
    },
    theme: {
      path: './assets/theme/',
      injectDirection: 'append',
      key: 'theme_core',
      default: 'pc-theme-default'
    }
  };
  /**
   * @description system inject theme
   */
  baseTheme: SsystemUIThemeType = StorageUtil.get(this.module.baseTheme.key) || this.module.baseTheme.default;
  /**
   * @description user select color theme
   */
  currentTheme = StorageUtil.get(this.module.theme.key) || this.module.theme.default;
  constructor(@Inject(DOCUMENT) private document: Document, private themeVariable: ThemeVariableService) {
    this.initCoreThemes();
    this.querySystemTheme();
  }
  initCoreThemes() {
    this.coreThemes.forEach(theme => {
      const themeColors: ThemeColors = theme.customColors;
      //Colors defalut value rule
      theme.colors = this.themeVariable.getColors(themeColors);
    });
  }
  initCssConfig() {
    let variables = '--MAIN_THEME_COLOR: #000;\n';
    for (var i = 0; i < 1000; i++) {
      variables += `--MAIN_THEME_COLOR_${i}:#000;\n`;
    }
    const content = `
    :root{
       ${variables}
    }
    `;
    this.injectCss(content);
  }
  async querySystemTheme() {
    const defaultTheme = SYSTEM_THEME;
    for (var i = 0; i < defaultTheme.length; i++) {
      const theme = defaultTheme[i];
      let result;
      const systemTheme = this.coreThemes.find(val => val.id === theme.id);
      if (systemTheme) {
        //* Support Offiline,Base theme inject code in index.html
        result = {
          colors: systemTheme.colors
        };
      } else {
        const path = new URL(theme.path, `${window.location.origin}/extensions/core-themes/`).href;
        result = await fetch(path).then(res => res.json());
      }

      this.themes.push({
        title: theme.label,
        id: theme.id,
        baseTheme: theme.baseTheme,
        previewColors: {
          layoutHeaderBackground: '#f8f8fa',
          layoutSiderBackground: '#ffffff',
          bodyBackground: 'rgb(255, 255, 255)',
          border: '#e8e8e8',
          primary: '#00785a'
        },
        ...result
      });
    }
    console.log(this.themes);
  }
  initTheme() {
    this.changeBaseTheme(this.baseTheme, true);
    this.changeCoreTheme(this.currentTheme, true);
  }
  changeTheme(theme) {
    this.changeBaseTheme(theme.baseTheme);
    this.changeCoreTheme(theme.name);
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
  changeBaseTheme(name: SsystemUIThemeType, firstLoad = false) {
    if (!firstLoad && (!name || name === this.baseTheme)) {
      return;
    }
    const module = this.module.baseTheme;
    const href = `${module.path}${name}.css`;
    const className = `pc-base-theme-${name}`;
    this.loadCss(href, name, module.injectDirection)
      .then(() => {
        if (!firstLoad) {
          this.removeCss(this.baseTheme);
          this.baseTheme = name;
        }
        this.changeEditorTheme(this.getEditorTheme(name));
        this.document.documentElement.classList.add(className);
        StorageUtil.set(module.key, name);
      })
      .catch(e => {});
  }

  changeCoreTheme(name, firstLoad = false) {
    if (!firstLoad && (!name || name === this.currentTheme)) {
      return;
    }
    const module = this.module.theme;
    const href = `${module.path}${name}.css`;
    const className = `pc-theme-${name}`;
    if (name === 'default') {
      this.removeCss(this.currentTheme);
      this.currentTheme = name;
      this.document.documentElement.classList.add(className);
      StorageUtil.set(module.key, name);
      return;
    }
    this.loadCss(href, name, module.injectDirection)
      .then(() => {
        if (!firstLoad) {
          this.removeCss(this.currentTheme);
          this.currentTheme = name;
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
  private injectCss(content) {
    let style = document.createElement('style');
    style.innerHTML = content;
    document.getElementsByTagName('head')[0].appendChild(style);
  }
}
