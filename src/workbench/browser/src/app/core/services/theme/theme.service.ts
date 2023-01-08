import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ExtensionService } from 'eo/workbench/browser/src/app/shared/services/extensions/extension.service';
import { kebabCase } from 'lodash-es';

import { SettingService } from '../../../modules/system-setting/settings.service';
import StorageUtil from '../../../utils/storage/Storage';
import { ThemeVariableService } from './theme-variable.service';
import { SYSTEM_THEME, SystemUIThemeType } from './theme.constant';
import { ThemeColors, ThemeItems } from './theme.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  themes: ThemeItems[] = [];
  private module = {
    baseTheme: {
      path: '',
      injectDirection: 'prepend',
      key: 'theme_base' //for storage and id prefix
    },
    theme: {
      path: './assets/theme/',
      injectDirection: 'append',
      key: 'theme_core',
      default: 'pc'
    }
  };
  coreThemes: Array<Partial<ThemeItems>>;
  /**
   * @description user select color theme
   */
  currentThemeID: SystemUIThemeType;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private extension: ExtensionService,
    private themeVariable: ThemeVariableService,
    private setting: SettingService
  ) {
    this.currentThemeID = this.setting.get('workbench.colorTheme') || this.module.theme.default;
  }
  async initTheme() {
    await this.querySystemThemes();
    this.queryExtensionThemes();
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
    this.addBodyClass(theme);
    this.injectVaribale(theme.colors);
    this.changeEditorTheme();
  }
  private async querySystemThemes() {
    const systemThemes = SYSTEM_THEME;
    //Init Core theme
    const coreThemes = systemThemes.filter(val => val.core);
    coreThemes.forEach(theme => {
      const themeColors: Partial<ThemeColors> = theme.customColors;
      //Colors defalut value rule
      theme.colors = this.themeVariable.getColors(themeColors);
    });
    this.coreThemes = coreThemes;

    //Init custom theme
    const themeCache = {};
    for (var i = 0; i < systemThemes.length; i++) {
      const theme = systemThemes[i];
      let result;
      if (!theme.core) {
        if (themeCache[theme.path]) {
          //Same path use cache
          result = themeCache[theme.path];
        } else {
          const path = new URL(theme.path, `${window.location.origin}/extensions/core-themes/`).href;
          result = await fetch(path)
            .then(res => res.json())
            .catch(e => {
              result = null;
            });
        }

        //* Request theme error
        if (!result) continue;

        themeCache[theme.path] = result;
      } else {
        result = coreThemes.find(val => val.id === theme.id);
      }

      this.themes.push({
        label: theme.label,
        id: theme.id,
        baseTheme: theme.baseTheme,
        ...result,
        colors: this.themeVariable.getColors(
          result.colors,
          coreThemes.find(val => val.id === theme.baseTheme || val.id === theme.id).colors
        )
      });
    }
  }
  private queryExtensionThemes() {
    this.extension.getValidExtensionsByFature('theme').forEach(feature => {
      feature.theme.forEach(theme => {
        console.log(theme);
        this.themes.push({
          label: theme.label,
          id: theme.id,
          baseTheme: theme.baseTheme,
          colors: this.themeVariable.getColors(
            theme.colors,
            this.coreThemes.find(val => val.id === theme.baseTheme || val.id === theme.id).colors
          )
        });
      });
    });
  }
  changeEditorTheme() {
    let currentTheme = this.themes.find(theme => theme.id === this.currentThemeID);
    const baseTheme = currentTheme.baseTheme || currentTheme.id;
    const editorTheme = baseTheme === 'pc-dark' ? 'vs-dark' : 'vs';
    if (window.monaco?.editor) {
      window.monaco?.editor.setTheme(editorTheme);
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
  private addBodyClass(theme) {
    //remove origin theme
    const removes = [];
    this.document.documentElement.classList.forEach(name => {
      console.log(name);
      if (name.includes('pc-theme-') || name.includes('pc-base-theme-')) {
        removes.push(name);
      }
    });
    removes.forEach(name => this.document.documentElement.classList.remove(name));

    //add pc-theme
    this.document.documentElement.classList.add(`theme-${theme.id}`);

    //pc-base-theme
    if (theme.baseTheme) {
      this.document.documentElement.classList.add(`theme-${theme.baseTheme}`);
    }
  }
}
