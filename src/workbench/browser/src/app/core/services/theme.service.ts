import { Inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { share } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { THEMES } from '../../layout/toolbar/select-theme/theme.model';

@Injectable()
export class ThemeService {
  currentTheme = 'blue';
  private themeChanges$ = new ReplaySubject(1);
  constructor(@Inject(DOCUMENT) private document: Document) {}
  changeTheme(name?: string): void {
    if (name) {
      this.themeChanges$.next({ name, previous: this.currentTheme });
      this.currentTheme = name;
    }
    this.loadCss(`${this.currentTheme}.css`);
    this.loadCss(`light.css`,'eoapi_theme_bg');
  }
  getThemes() {
    return THEMES;
  }
  onThemeChange = function() {
    return this.themeChanges$.pipe(share());
  };
  private loadCss(href: string, id: string='eoapi_theme_main'): Promise<Event> {
    return new Promise((resolve, reject) => {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = href;
      style.id = id;
      style.onload = resolve;
      style.onerror = reject;
      document.head.append(style);
    });
  }
}
