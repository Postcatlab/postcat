import { Component } from '@angular/core';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

import { SystemSettingComponent } from '../../../modules/system-setting/system-setting.component';
import { DataSourceService } from '../../../shared/services/data-source/data-source.service';
import { MessageService } from '../../../shared/services/message';
import { ModalService } from '../../../shared/services/modal.service';

@Component({
  selector: 'eo-select-workspace',
  template: ` <a eo-ng-dropdown [nzDropdownMenu]="workspaceMenu">
      {{ store.getCurrentWorkspace.title }}
      <eo-iconpark-icon name="down"></eo-iconpark-icon>
    </a>
    <eo-ng-dropdown-menu #workspaceMenu>
      <ul nz-menu>
        <div class="flex py-[5px] px-[12px]">
          <input eo-ng-input type="text" class="flex-1 px-3" i18n-placeholder placeholder="Search" [(ngModel)]="searchValue" />
          <button
            eoNgFeedbackTooltip
            i18n-nzTooltipTitle
            nzTooltipTitle="New Workspace"
            nzType="primary"
            eo-ng-button
            (click)="addWorkspace()"
            class="ml-3 flex items-center"
          >
            <eo-iconpark-icon name="plus"></eo-iconpark-icon>
          </button>
        </div>
        <div class="mt-[10px]" *ngIf="localWorkspace" (click)="changeWorkspace(localWorkspace)">
          <p class="text-tips px-base mb-[10px]" i18n>Local</p>
          <li class="px-[25px]" [ngClass]="{ 'active-item': store.getCurrentWorkspace?.id === localWorkspace.id }" nz-menu-item>
            <eo-iconpark-icon class="mr-[5px]" size="15px" name="home"> </eo-iconpark-icon>{{ localWorkspace.title }}</li
          >
        </div>
        <nz-divider class="m-0"></nz-divider>
        <div class="my-[10px]">
          <p class="text-tips px-base mb-[10px]" i18n>Cloud</p>
          <p i18n *ngIf="!cloudWorkspaces.length" class="text-tips px-base mx-[5px] text-[12px]">No cloud worspace</p>
          <li
            class="px-[25px] flex justify-between"
            nz-menu-item
            (click)="changeWorkspace(item)"
            [ngClass]="{ 'active-item': store.getCurrentWorkspace?.id === item.id }"
            *ngFor="let item of cloudWorkspaces"
          >
            <div class="flex items-center">
              <eo-iconpark-icon class="mr-[5px]" size="15px" name="link-cloud-sucess"> </eo-iconpark-icon>
              <span class="truncate mw-[250px]"> {{ item.title }}</span>
            </div>
            <div>
              <button eo-ng-button nzType="text" (click)="openSetting($event, item)"
                ><eo-iconpark-icon size="15px" name="setting"> </eo-iconpark-icon>
              </button>
            </div>
          </li>
        </div>
      </ul>
    </eo-ng-dropdown-menu>`,
  styles: [
    `
      .active-item {
        color: var(--MAIN_THEME_COLOR);
      }
    `
  ]
})
export class SelectWorkspaceComponent {
  searchValue: string;

  constructor(
    public store: StoreService,
    private effect: EffectService,
    private dataSourceService: DataSourceService,
    private message: MessageService,
    private modal: ModalService
  ) {}
  get localWorkspace() {
    const result = this.searchWorkspace(this.searchValue, [this.store.getLocalWorkspace]);
    return result[0];
  }
  get cloudWorkspaces() {
    return this.searchWorkspace(
      this.searchValue,
      this.store.getWorkspaceList.filter(val => val.id !== -1)
    );
  }
  openSetting($event, workspace) {
    $event.stopPropagation();
    const ref = this.modal.create({
      nzClassName: 'eo-setting-modal',
      nzTitle: $localize`Workspace Settings`,
      nzContent: SystemSettingComponent,
      withoutFooter: true
    });
  }
  changeWorkspace(item) {
    this.effect.updateWorkspace(item);
  }
  addWorkspace() {
    this.dataSourceService.checkRemoteCanOperate(() => {
      this.message.send({ type: 'addWorkspace', data: {} });
    });
  }

  private searchWorkspace(text, list) {
    if (!text) {
      return list;
    }
    const searchText = text.toLocaleLowerCase();
    return list.filter(val => val.title.toLocaleLowerCase().includes(searchText));
  }
}
