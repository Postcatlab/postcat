import { Component } from '@angular/core';

import { ThemeService } from '../../../../core/services/theme.service';
import { APPEARANCE, THEMES } from './theme.model';

@Component({
  selector: 'eo-select-theme',
  template: `<div class="grid grid-cols-4 gap-2.5	rounded">
    <div
      class="cursor-pointer theme-container"
      [ngClass]="{ 'theme-container-active': (theme.appearance === 'dark' ? 'dark-' : '') + theme.mainColor === option.value }"
      (click)="theme.changeTheme(option.value)"
      *ngFor="let option of THEMES"
    >
      <div class="border-all theme-block">
        <header class="navbar h-[15px]" [style.background]="option.navBackgroud"></header>
        <section class="flex h-[35px]">
          <div class="sidebar w-[35px]" [style.background]="option.sidebarBackground" [style.borderColor]="option.borderColor"></div>
          <div class="content flex-1 flex items-center justify-center" [style.background]="option.contentBackground">
            <div class="main-color w-[30px]  h-[15px]" [style.background]="option.primaryColor"></div>
          </div>
        </section>
      </div>
      <div class="flex items-center justify-center mt-[10px]">
        <p class="">{{ option.title }}</p>
      </div>
    </div>
  </div>`,
  styleUrls: ['./select-theme.component.scss']
})
export class SelectThemeComponent {
  THEMES = THEMES;
  APPEARANCE = APPEARANCE;
  constructor(public theme: ThemeService) {}
}
