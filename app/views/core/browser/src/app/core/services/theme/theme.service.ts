import { Injectable, Inject } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { share } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { THEMES } from './theme.model';
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  currentTheme = 'classic_forest';
  private themeChanges$ = new ReplaySubject(1);
  constructor(@Inject(DOCUMENT) private document: Document) {
  }
  changeTheme(name?: string): void {
    if(name){
      this.themeChanges$.next({ name, previous: this.currentTheme });
      this.currentTheme = name;
    }
    this.insertCss(`${this.currentTheme}.css`);
  }
  getThemes() {
    return THEMES;
  }
  onThemeChange = function() {
    return this.themeChanges$.pipe(share());
  };

  private insertCss(address: string) {
    const head = this.document.getElementsByTagName('head')[0];
    const themeLink = this.document.getElementById('eoapi_theme') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = address;
    } else {
      const style = this.document.createElement('link');
      style.id = 'eoapi_theme';
      style.rel = 'stylesheet';
      style.href = address;

      head.appendChild(style);
    }
  }
}
