import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ExtensionService } from 'eo/workbench/browser/src/app/shared/services/extensions/extension.service';
import { kebabCase } from 'lodash-es';

import { SettingService } from '../../../modules/system-setting/settings.service';
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
    this.initCoreThemes();
  }
  async initTheme() {
    await this.querySystemThemes();
    let currentTheme = StorageUtil.get('pc_theme') || this.themes.find(val => val.id === this.module.theme.default);
    this.changeTheme(currentTheme);
    if (currentTheme.id === 'pc-debug') {
      this.fixedThemeIfNotValid();
    }
  }
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
    const features = this.extension.getValidExtensionsByFature('theme');
    features.forEach((feature, extensionID) => {
      feature.themes.forEach(theme => {
        this.themes.push({
          label: theme.label,
          id: `${extensionID}_${theme.id}`,
          isExtension: true,
          baseTheme: theme.baseTheme,
          colors: this.themeVariable.getColors(
            theme.colors,
            this.coreThemes.find(val => val.id === theme.baseTheme || val.id === theme.id) || this.coreThemes[0]
          )
        });
      });
    });
  }
  changeEditorTheme(currentTheme = StorageUtil.get('pc_theme')) {
    const baseTheme = currentTheme.baseTheme || currentTheme.id;
    const editorTheme = baseTheme === 'pc-dark' ? 'vs-dark' : 'vs';
    if (window.monaco?.editor) {
      window.monaco?.editor.setTheme(editorTheme);
    }
  }
  private initCoreThemes() {
    const systemThemes = SYSTEM_THEME;
    //Init Core theme
    const coreThemes = systemThemes.filter(val => val.core);
    coreThemes.forEach(theme => {
      const themeColors: Partial<ThemeColors> = theme.customColors;
      //Colors defalut value rule
      theme.colors = this.themeVariable.getColors(themeColors);
    });
    this.coreThemes = coreThemes;
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
        //Select valid theme while extension disabled
        this.themes = this.themes.filter(val => !val.isExtension);
        this.queryExtensionThemes();
        this.afterAllThemeLoad();
      }
    });
  }
}
