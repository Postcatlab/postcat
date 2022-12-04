import { Component, OnInit, OnDestroy } from '@angular/core';

import { ThemeService } from '../../../../core/services/theme.service';
import { APPEARANCE, THEMES } from './theme.model';

@Component({
  selector: 'eo-select-theme',
  template: `<p class="mb-[5px] mt-[15px] font-bold">Appearance</p>
    <button eo-ng-button nzType="text" *ngFor="let option of this.APPEARANCE"  (click)="theme.changeAppearance(option.value)">
      <eo-iconpark-icon [name]="option.icon"></eo-iconpark-icon>
    </button>
    <!-- theme -->
    <p class="mb-[5px] mt-[15px] font-bold" nzTypography>Accept color</p>
    <eo-ng-radio-group
      nzBorderless
      class="w-full flex"
      [ngModel]="theme.mainColor"
      (ngModelChange)="theme.changeColor($event)"
    >
      <label
        [style.border]="'0px solid' + option.color"
        class="mx-[5px]"
        *ngFor="let option of this.THEMES"
        eo-ng-radio
        [nzValue]="option.value"
      >
      </label>
    </eo-ng-radio-group>`,
  styleUrls: ['./select-theme.component.scss'],
})
export class SelectThemeComponent implements OnInit, OnDestroy {
  THEMES = THEMES;
  APPEARANCE = APPEARANCE;
  constructor(public theme: ThemeService) {}
  ngOnInit(): void {}

  ngOnDestroy() {}
}
