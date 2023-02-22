import { Component } from '@angular/core';
import { categoriesTipsMap } from 'eo/workbench/browser/src/app/pages/extension/extension.model';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';

import { ThemeService } from '../../../../core/services/theme/theme.service';

@Component({
  selector: 'eo-select-theme',
  template: `<div class="grid grid-cols-4 gap-2.5	rounded">
      <div
        class="cursor-pointer theme-container"
        [ngClass]="{ 'theme-container-active': theme.currentThemeID === option.id }"
        (click)="theme.changeTheme(option)"
        *ngFor="let option of theme.themes"
      >
        <div class="border-all theme-block" [style.background]="option.colors.background">
          <header
            class="navbar h-[15px]"
            [style.background]="option.colors.layoutHeaderBackground"
            [style.borderColor]="option.colors.border"
          ></header>
          <section class="flex h-[35px]">
            <div
              class="sidebar w-[15px]"
              [style.background]="option.colors.layoutSidebarBackground"
              [style.borderColor]="option.colors.border"
            ></div>
            <div class="tree w-[30px]" [style.background]="option.colors.treeBackground" [style.borderColor]="option.colors.border"></div>
            <div class="content flex-1 flex items-center justify-center" [style.background]="option.colors.background">
              <div class="text-primary w-[30px]  h-[15px]" [style.background]="option.colors.primary"></div>
            </div>
          </section>
          <div
            class="footer h-[10px]"
            [style.borderColor]="option.colors.border"
            [style.background]="option.colors.layoutFooterBackground"
          ></div>
        </div>
        <div class="flex items-center justify-center mt-[10px]">
          <p class="truncate">{{ option.label }}</p>
        </div>
      </div>
    </div>
    <eo-ng-feedback-alert class="block mt-[15px]" nzType="default" [nzMessage]="templateRefMsg" nzShowIcon></eo-ng-feedback-alert>
    <ng-template #templateRefMsg>
      <div class="text" i18n
        >Couldn't find the {{ categoriesTipsMap.Themes.name }} you were looking for?
        <a (click)="openExtension()">find more...</a>
      </div>
    </ng-template> `,
  styleUrls: ['./select-theme.component.scss']
})
export class SelectThemeComponent {
  categoriesTipsMap = categoriesTipsMap;
  constructor(public theme: ThemeService, private messageService: MessageService) {}

  openExtension() {
    this.messageService.send({ type: 'open-extension', data: { suggest: this.categoriesTipsMap.Themes.suggest } });
  }
}
