import { Component, OnInit, OnDestroy } from '@angular/core';

import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'eo-select-theme',
  template: `<p class="font-bold">Appearance</p>
    <eo-ng-card-switch
      class="cursor-pointer border-none mt-[10px] block"
      ngDefaultControl
      [(ngModel)]="theme.appearance"
      (ngModelChange)="theme.changeAppearance($event)"
    ></eo-ng-card-switch>

    <!-- theme -->
    <p class="mb-[5px] mt-[10px]" nzTypography>Accept color</p>
    <eo-ng-radio-group
      nzBorderless
      class="w-full flex"
      [(ngModel)]="theme.mainColor"
      (ngModelChange)="theme.changeColor($event)"
    >
      <label
        class="theme-box mx-[5px]"
        *ngFor="let option of THEMES"
        eo-ng-radio
        [style.background]="option.value"
        [nzValue]="option.title"
      >
        <svg *ngIf="theme.mainColor === option.label" class="theme-box-checked iconpark-icon !h-[24px] !w-[24px]">
          <use href="#check"></use>
        </svg>
      </label>
    </eo-ng-radio-group>`,
  providers: [ThemeService],
})
export class SelectThemeComponent implements OnInit, OnDestroy {
  THEMES: any;

  constructor(public theme: ThemeService) {
    this.getThemes();
  }
  private getThemes() {
    this.THEMES = this.theme.getThemes();
  }
  ngOnInit(): void {}

  ngOnDestroy() {}
}
