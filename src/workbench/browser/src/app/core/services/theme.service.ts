import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MainColor, THEMES } from '../../modules/setting/common/select-theme/theme.model';
import { Theme } from 'ng-zorro-antd/core/config';

@Injectable()
export class ThemeService {
  appearance: 'light' | 'dark' = 'light';
  mainColor: MainColor;
  DESIGN_TOKEN: Theme = {
    primaryColor: getComputedStyle(this.document.documentElement)
      .getPropertyValue('--MAIN_THEME_COLOR')
      .replace(' ', ''),
  };
  constructor(@Inject(DOCUMENT) private document: Document) {}
  initTheme() {
    this.changeAppearance('light');
    this.changeColor('purple');
  }
  getEditorTheme() {
    //Default Theme: https://microsoft.github.io/monaco-editor/index.html
    //'vs', 'vs-dark' or 'hc-black'
    return this.appearance==='dark'?'vs-dark':'vs';
  }
  getThemes() {
    return THEMES;
  }
  changeAppearance(appearance) {
    document.documentElement.classList.add(appearance);
    this.loadCss(`${appearance}.css`, 'eo_theme_bg');
    this.appearance = appearance;
  }

  changeColor(name: MainColor) {
    this.loadCss(`/assets/theme/${name}.css`);
    this.mainColor = name;
  }
  private loadCss(href: string, id: string = 'eo_theme_main'): Promise<Event> {
    return new Promise((resolve, reject) => {
      let dom = this.document.getElementById(id) as HTMLLinkElement;
      if (dom) {
        dom.href = href;
      } else {
        dom = document.createElement('link');
        dom.rel = 'stylesheet';
        dom.href = href;
        dom.id = id;
        document.head[id === 'eo_theme_bg' ? 'prepend' : 'append'](dom);
      }
      dom.onload = resolve;
      dom.onerror = reject;
    });
  }
}
