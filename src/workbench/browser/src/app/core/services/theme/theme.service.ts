import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import lightDefault from '../../../../extensions/core-themes/themes/light-default.json';
import { BaseUIThemeType, FEATURES_THEME } from '../../../modules/system-setting/common/select-theme/theme.model';
import StorageUtil from '../../../utils/storage/Storage';

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
      default: 'pc-theme-default'
    }
  };
  baseThemes = [
    {
      id: 'pc',
      colors: {},
      baseColors: lightDefault.colors
    },
    {
      id: 'pc-dark',
      colors: {},
      baseColors: lightDefault.colors
    }
  ];
  themes = [];
  baseTheme: BaseUIThemeType = StorageUtil.get(this.module.baseTheme.key) || this.module.baseTheme.default;
  coreTheme = StorageUtil.get(this.module.coreTheme.key) || this.module.coreTheme.default;
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.initBaseThemes();
    this.querySystemTheme();
  }
  initBaseThemes() {
    this.baseThemes.forEach(theme => {
      const baseColors = theme.baseColors;
      theme.colors = {
        primary: baseColors.primary,
        text: baseColors.text,
        textSecondary: '#606266',
        primaryHover: '#40a9ff',
        primaryActive: '#096dd9',
        primaryShadow: 'xxxx',
        success: '#67C23A',
        successHover: '',
        successActive: '',
        successShadow: '',
        warning: '#E6A23C',
        warningHover: '',
        warningActive: '',
        warningShadow: '',
        danger: '#F56C6C',
        dangerHover: '',
        dangerActive: '',
        dangerShadow: '',
        info: '#F56C6C',
        infoHover: '',
        infoActive: '',
        infoShadow: '',
        border: '#DCDFE6',
        shadow: '',
        bodyBackground: '#F5F7FA',
        barBackground: '',
        componentBackground: '#F5F7FA',
        itemActiveBackground: '#F5F7FA',
        itemHoverBackground: '#F5F7FA',
        disabledText: '',
        disabledBackground: '',
        layoutHeaderBackground: '#fff',
        layoutSiderText: '',
        layoutSiderBackground: '',
        layoutSiderActiveText: '',
        layoutSiderActive: '',
        layoutFooterText: '',
        layoutFooterBackground: '',
        iconText: '',
        buttonText: '',
        buttonShadow: '',
        buttonPrimaryText: '',
        buttonPrimaryBackground: '#1890ff',
        buttonPrimaryShadow: '',
        buttonDefaultText: '',
        buttonDefaultBackground: '#1890ff',
        buttonDefaultShadow: '',
        textLink: '',
        textLinkHover: '',
        textLinkActive: '',
        divider: '#000',
        tabsText: '',
        tabsActive: '',
        tabsActiveText: '',
        tabsCardBarBackground: '',
        tabsCardText: '',
        tabsCardBackground: '',
        tabsCardActive: '',
        tabsCardActiveText: '',
        tabsCardActiveBackground: '',
        tableBackground: '',
        tableHeaderText: '',
        tableHeaderBackground: '',
        tableRowHoverBackground: '',
        tableFooterBackground: '',
        tableFooterText: '',
        treeHeaderBackground: '',
        treeText: '',
        treeBackground: '',
        treeSelectedText: '',
        treeSelectedBackground: '',
        treeHoverText: '',
        treeHoverBackground: '',
        dropdownMenuBackground: '',
        dropdownItemHoverBackground: '',
        selectBorder: '',
        selectBackground: '',
        selectDropdownBackground: '',
        selectItemSelectedText: '',
        selectItemSelectedBackground: '',
        inputText: '',
        inputBackground: '',
        inputIcon: '',
        inputBorder: '',
        inputPlaceholder: '',
        modalHeaderBackground: '',
        modalHeaderText: '',
        modalContentBackground: '',
        modalFooterBackground: '',
        modalMaskBackground: '',
        paginationItemBackground: '',
        paginationItemActiveBackground: '',
        paginationButtonBackground: '',
        toastSuccessText: '',
        toastSuccessBackground: '',
        toastSuccessBorer: '',
        toastWarningText: '',
        toastWarningBackground: '',
        toastWarningBorer: '',
        toastInfoText: '',
        toastInfoBackground: '',
        toastInfoBorer: '',
        toastErrorText: '',
        toastErrorBackground: '',
        toastErrorBorer: '',
        alertDefaultText: '',
        alertDefaultBorder: '',
        alertDefaultBackground: '',
        alertSuccessText: '',
        alertSuccessBorder: '',
        alertSuccessBackground: '',
        alertErrorText: '',
        alertErrorBorder: '',
        alertErrorBackground: '',
        alertWarningText: '',
        alertWarningBorder: '',
        alertWarningBackground: '',
        checkboxText: '',
        checkboxBorder: '',
        checkboxBackground: '',
        checkboxCheckedBackground: '',
        checkboxCheckedBorder: '',
        checkboxCheckedText: '',
        radioText: '',
        radioBorder: '',
        radioBackground: '',
        radioCheckedBackground: '',
        radioCheckedBorder: '',
        radioCheckedText: '',
        switch: '',
        switchBakcground: '',
        switchText: '',
        collapseHeaderBackground: '',
        collapseContentbackground: ''
      };
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
    const defaultTheme = FEATURES_THEME;
    for (var i = 0; i < defaultTheme.length; i++) {
      const theme = defaultTheme[i];
      let result;
      const baseTheme = this.baseThemes.find(val => val.id === theme.id);
      if (baseTheme) {
        //* Support Offiline,Base theme inject code in index.html
        result = {
          colors: baseTheme.colors
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
    this.changeCoreTheme(this.coreTheme, true);
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
  changeBaseTheme(name: BaseUIThemeType, firstLoad = false) {
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
    if (!firstLoad && (!name || name === this.coreTheme)) {
      return;
    }
    const module = this.module.coreTheme;
    const href = `${module.path}${name}.css`;
    const className = `pc-theme-${name}`;
    if (name === 'default') {
      this.removeCss(this.coreTheme);
      this.coreTheme = name;
      this.document.documentElement.classList.add(className);
      StorageUtil.set(module.key, name);
      return;
    }
    this.loadCss(href, name, module.injectDirection)
      .then(() => {
        if (!firstLoad) {
          this.removeCss(this.coreTheme);
          this.coreTheme = name;
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
