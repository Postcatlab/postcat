import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { kebabCase } from 'lodash-es';

import { SettingService } from '../../../modules/system-setting/settings.service';
import StorageUtil from '../../../utils/storage/Storage';
import { ThemeVariableService } from './theme-variable.service';
import { SsystemUIThemeType, SYSTEM_THEME, ThemeColors, ThemeItems } from './theme.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  themes: ThemeItems[] = [];
  /**
   * @description core inject theme,provide baseTheme for extension themes
   */
  private baseThemes = SYSTEM_THEME.filter(val => val.core);
  private module = {
    baseTheme: {
      path: '',
      injectDirection: 'prepend',
      key: 'theme_base', //for storage and id prefix
      default: 'pc' as SsystemUIThemeType
    },
    theme: {
      path: './assets/theme/',
      injectDirection: 'append',
      key: 'theme_core',
      default: 'pc-theme-default'
    }
  };
  currentTheme;
  /**
   * @description user select color theme
   */
  currentThemeID: string;
  constructor(@Inject(DOCUMENT) private document: Document, private themeVariable: ThemeVariableService, private setting: SettingService) {
    this.currentThemeID = this.setting.get('workbench.colorTheme') || this.module.theme.default;
  }
  async initTheme() {
    await this.querySystemTheme();
    let currentTheme = StorageUtil.get('pc_theme') || this.themes[0];
    //check currentThemeID valid
    let validTheme = this.themes.find(theme => theme.id === this.currentThemeID);
    if (!validTheme) {
      validTheme = this.themes.find(theme => theme.id === this.module.theme.default);
    }
    //Current theme storage is not equal to the current theme id
    const themeStorageError = validTheme.id !== currentTheme.id;
    const themeHasUpdate = JSON.stringify(currentTheme) !== JSON.stringify(validTheme);
    if (themeStorageError || themeHasUpdate) {
      currentTheme = validTheme;
    }
    this.changeTheme(currentTheme);
  }
  changeTheme(theme) {
    this.currentThemeID = theme.id;
    StorageUtil.set('pc_theme', theme);
    this.setting.set('workbench.colorTheme', theme.id);
    this.injectVaribale(theme.colors);
  }
  private getEditorTheme(baseTheme) {
    //Default Theme: https://microsoft.github.io/monaco-editor/index.html
    //'vs', 'vs-dark' or 'hc-black'
    return baseTheme === 'dark' ? 'vs-dark' : 'vs';
  }
  private async querySystemTheme() {
    this.initBaseThemes();
    const defaultTheme = SYSTEM_THEME;
    for (var i = 0; i < defaultTheme.length; i++) {
      const theme = defaultTheme[i];
      let result;
      const systemTheme = this.baseThemes.find(val => val.id === theme.id);
      if (systemTheme) {
        //* Support Offiline,Base theme inject code in index.html
        result = {
          colors: systemTheme.colors
        };
      } else {
        const path = new URL(theme.path, `${window.location.origin}/extensions/core-themes/`).href;
        result = await fetch(path).then(res => res.json());
      }
      const baseTheme = this.baseThemes.find(val => val.id === theme.baseTheme || val.id === theme.id);
      this.themes.push({
        title: theme.label,
        id: theme.id,
        baseTheme: theme.baseTheme,
        ...result,
        colors: this.themeVariable.getColors(result.colors, baseTheme.colors)
      });
      console.log(this.themes);
    }
  }
  private initBaseThemes() {
    this.baseThemes.forEach(theme => {
      const themeColors: Partial<ThemeColors> = theme.customColors;
      //Colors defalut value rule
      theme.colors = this.themeVariable.getColors(themeColors);
    });
  }
  changeEditorTheme(theme?) {
    // theme = theme || this.getEditorTheme(this.baseTheme);
    if (window.monaco?.editor) {
      window.monaco?.editor.setTheme(theme);
    }
  }
  private injectVaribale(colors) {
    let variables = '';
    Object.keys(colors).forEach(colorKey => {
      variables += `--${kebabCase(colorKey)}-color:${colors[colorKey]};\n`;
    });
    const content = `
    :root{
       ${variables}
    }
    `;
    const domID = 'pc-theme-variable';
    let dom = document.getElementById(domID);
    if (dom) {
      dom.innerHTML = content;
    } else {
      dom = document.createElement('style');
      dom.id = domID;
      dom.innerHTML = content;
      document.getElementsByTagName('head')[0].appendChild(dom);
    }
  }
}
