import { Component } from '@angular/core';

import { ThemeService } from '../../../../core/services/theme/theme.service';

@Component({
  selector: 'eo-select-theme',
  template: `<div class="grid grid-cols-4 gap-2.5	rounded">
    <div
      class="cursor-pointer theme-container"
      [ngClass]="{ 'theme-container-active': theme.currentTheme === option.value }"
      (click)="theme.changeTheme(option)"
      *ngFor="let option of theme.themes"
    >
      <div class="border-all theme-block">
        <header class="navbar h-[15px]" [style.background]="option.previewColors.layoutHeaderBackground"></header>
        <section class="flex h-[35px]">
          <div
            class="sidebar w-[35px]"
            [style.background]="option.previewColors.layoutSiderBackground"
            [style.borderColor]="option.previewColors.border"
          ></div>
          <div class="content flex-1 flex items-center justify-center" [style.background]="option.previewColors.bodyBackground">
            <div class="main-color w-[30px]  h-[15px]" [style.background]="option.previewColors.primary"></div>
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
  constructor(public theme: ThemeService) {}
}
