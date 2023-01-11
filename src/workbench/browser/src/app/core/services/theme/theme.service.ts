import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ExtensionService } from 'eo/workbench/browser/src/app/shared/services/extensions/extension.service';
import { kebabCase } from 'lodash-es';

import { SettingService } from '../../../modules/system-setting/settings.service';
import { ExtensionInfo } from '../../../shared/models/extension-manager';
import { Message, MessageService } from '../../../shared/services/message';
import StorageUtil from '../../../utils/storage/Storage';
import { ThemeVariableService } from './theme-variable.service';
import { SYSTEM_THEME, SystemUIThemeType, SystemThemeItems } from './theme.constant';
import { ThemeColors } from './theme.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  themes: SystemThemeItems[] = [];
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
  coreThemes: SystemThemeItems[];
  /**
   * @description user select color theme
   */
  currentThemeID: SystemUIThemeType;
  subscribe;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private extension: ExtensionService,
    private themeVariable: ThemeVariableService,
    private setting: SettingService,
    private message: MessageService
  ) {
    this.currentThemeID = this.setting.get('workbench.colorTheme') || this.module.theme.default;
    this.coreThemes = this.getCoreThemes();
  }
  async initTheme() {
    await this.querySystemThemes();
    let currentTheme = StorageUtil.get('pc_theme') || this.themes.find(val => val.id === this.module.theme.default);
    this.changeTheme(currentTheme);
    if (currentTheme.id === 'pc-debug') {
      this.fixedThemeIfNotValid();
    }
  }
  /**
   * Sort theme or fixed invalid theme after query all theme
   * */
  afterAllThemeLoad() {
    this.fixedThemeIfNotValid();
    this.sortThemes();
    this.watchInstalledExtensionsChange();
  }

  changeTheme(theme) {
    this.currentThemeID = theme.id;
    StorageUtil.set('pc_theme', theme);
    this.setting.set('workbench.colorTheme', theme.id);
    this.addBodyClass(theme);
    this.injectVaribale(theme.colors);
    this.changeEditorTheme(theme);
  }
  queryExtensionThemes() {
    const extensions = this.getExtensionThemes();
    this.themes.push(...extensions);
  }
  private getExtensionThemes() {
    const result = [];
    const features = this.extension.getValidExtensionsByFature('theme');
    features.forEach((feature, extensionID) => {
      feature.theme.forEach(theme => {
        result.push({
          label: theme.label,
          id: this.getExtensionID(extensionID, theme.id),
          isExtension: true,
          baseTheme: theme.baseTheme,
          colors: this.themeVariable.getColors(
            theme.colors,
            this.coreThemes.find(val => val.id === theme.baseTheme || val.id === theme.id) || this.coreThemes[0]
          )
        });
      });
    });
    return result;
  }
  changeEditorTheme(currentTheme = StorageUtil.get('pc_theme')) {
    const baseTheme = currentTheme.baseTheme || currentTheme.id;
    const editorTheme = baseTheme === 'pc-dark' ? 'vs-dark' : 'vs';
    if (window.monaco?.editor) {
      window.monaco?.editor.setTheme(editorTheme);
    }
  }
  private getCoreThemes() {
    const systemThemes = SYSTEM_THEME;
    //Init Core theme
    const coreThemes = systemThemes.filter(val => val.core);
    coreThemes.forEach(theme => {
      const themeColors: Partial<ThemeColors> = theme.customColors;
      //Colors defalut value rule
      theme.colors = this.themeVariable.getColors(themeColors);
    });
    return coreThemes;
  }
  private sortThemes() {
    this.themes.sort((a: SystemThemeItems, b: SystemThemeItems) => {
      if (a.core) return -1;
      if (a.isExtension) return -1;
      return 1;
    });
  }
  private async querySystemThemes() {
    const systemThemes = SYSTEM_THEME;
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
          try {
            const path = new URL(theme.path, `${window.location.origin}/extensions/core-themes/`).href.replace(
              `${window.location.origin}/`,
              ''
            );
            result = await fetch(path)
              .then(res => res.json())
              .catch(e => {
                result = null;
              });
          } catch (e) {}
        }

        //* Request theme error
        if (!result) continue;

        themeCache[theme.path] = result;
      } else {
        result = this.coreThemes.find(val => val.id === theme.id);
      }

      this.themes.push({
        label: theme.label,
        id: theme.id,
        baseTheme: theme.baseTheme,
        ...result,
        colors: this.themeVariable.getColors(
          result.colors,
          this.coreThemes.find(val => val.id === theme.baseTheme || val.id === theme.id) || this.coreThemes[0]
        )
      });
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
      if (name.includes('theme-')) {
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
  private fixedThemeIfNotValid() {
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
      this.changeTheme(currentTheme);
    }
  }
  private watchInstalledExtensionsChange() {
    if (this.subscribe) return;
    this.subscribe = this.message.get().subscribe((inArg: Message) => {
      if (inArg.type === 'installedExtensionsChange') {
        //Get the newest theme list
        this.themes = this.themes.filter(val => !val.isExtension);
        this.queryExtensionThemes();
        this.afterAllThemeLoad();
        switch (inArg.data.action) {
          case 'enable':
          case 'install': {
            const name = inArg.data.name;
            const extension: ExtensionInfo = inArg.data.installedMap.get(name);
            if (!extension?.features?.theme?.length) break;

            //Change theme after install/enable extension
            const themeID = extension.features.theme[0].id;
            const id = this.getExtensionID(name, themeID);
            const theme = this.themes.find(val => val.id === id);
            if (!theme) return;
            this.changeTheme(theme);
            break;
          }
          default: {
            break;
          }
        }
      }
    });
  }
  getExtensionID(name, themeID) {
    return `${name}_${themeID}`;
  }
}
