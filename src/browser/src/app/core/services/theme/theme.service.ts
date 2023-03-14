import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { kebabCase } from 'lodash-es';

import { SettingService } from '../../../components/system-setting/settings.service';
import { Message, MessageService } from '../../../services/message';
import { ExtensionInfo } from '../../../shared/models/extension-manager';
import StorageUtil from '../../../shared/utils/storage/storage.utils';
import { ThemeExtensionService } from './theme-extension.service';
import { ThemeVariableService } from './theme-variable.service';
import { SYSTEM_THEME, SystemUIThemeType, SystemThemeItems } from './theme.constant';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  themes: SystemThemeItems[] = [];
  coreThemes: SystemThemeItems[];
  /**
   * @description user select color theme
   */
  currentThemeID: SystemUIThemeType;
  private systemThemePath = '/extensions/themes/';
  private defaultTheme = 'pc';
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private themeExtension: ThemeExtensionService,
    private themeVariable: ThemeVariableService,
    private setting: SettingService,
    private message: MessageService
  ) {
    this.currentThemeID = this.setting.get('workbench.colorTheme') || this.defaultTheme;
    this.coreThemes = this.getCoreThemes();
    this.watchInstalledExtensionsChange();
  }
  async initTheme() {
    await this.querySystemThemes();
    let currentTheme = StorageUtil.get('pc_theme') || this.themes.find(val => val.id === this.defaultTheme);
    this.changeTheme(currentTheme);

    //Quick directly change theme color if debug color change
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
  }

  changeTheme(theme) {
    this.currentThemeID = theme.id;
    StorageUtil.set('pc_theme', theme);
    this.setting.set('workbench.colorTheme', theme.id);
    this.addBodyClass(theme);
    this.injectVaribale(theme.colors);
    this.changeEditorTheme(theme);
  }

  changeCurrentThemeColorForDebug(colors) {
    this.injectVaribale(colors);
  }

  queryExtensionThemes() {
    const extensions = this.themeExtension.getExtensionThemes(this.coreThemes);
    this.themes.push(...extensions);
  }
  changeEditorTheme(currentTheme = StorageUtil.get('pc_theme')) {
    const editorTheme = this.getEditorTheme(currentTheme);
    if (window.monaco?.editor) {
      window.monaco?.editor.setTheme(editorTheme);
    }
  }
  getEditorTheme(currentTheme = StorageUtil.get('pc_theme')) {
    const baseTheme = currentTheme.baseTheme || currentTheme.id;
    const editorTheme = baseTheme === 'pc-dark' ? 'vs-dark' : 'vs';
    return editorTheme;
  }
  private getCoreThemes() {
    const systemThemes = SYSTEM_THEME;
    //Init Core theme
    const coreThemes = systemThemes.filter(val => val.core);
    coreThemes.forEach(theme => {
      //Colors defalut value rule
      theme.colors = this.themeVariable.getColors(theme);
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
      let theme = systemThemes[i];
      let result;
      if (!theme.core) {
        if (themeCache[theme.path]) {
          //Same path use cache
          result = themeCache[theme.path];
        } else {
          try {
            const path = new URL(theme.path, `${window.location.origin}${this.systemThemePath}`).href.replace(
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
      theme = { label: theme.label, id: theme.id, baseTheme: theme.baseTheme, ...result };
      this.themes.push({
        ...theme,
        colors: this.themeVariable.getColors(
          theme,
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
      validTheme = this.themes.find(theme => theme.id === this.defaultTheme);
    }

    //Current theme storage is not equal to the current theme id
    const themeStorageError = validTheme.id !== currentTheme.id;
    const themeHasUpdate = JSON.stringify(currentTheme) !== JSON.stringify(validTheme);
    if (themeStorageError || themeHasUpdate) {
      currentTheme = validTheme;
      this.changeTheme(currentTheme);
    }
  }
  watchInstalledExtensionsChange() {
    this.message.get().subscribe((inArg: Message) => {
      if (inArg.type !== 'extensionsChange') return;
      //Rest newest theme list
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
          const id = this.themeExtension.getExtensionID(name, themeID);
          const theme = this.themes.find(val => val.id === id);
          if (!theme) return;
          this.changeTheme(theme);
          break;
        }
        default: {
          break;
        }
      }
    });
  }
}
