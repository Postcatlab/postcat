import { Component } from '@angular/core';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

import { DataSourceService } from '../../../../shared/services/data-source/data-source.service';
import { MessageService } from '../../../../shared/services/message';
import { ModalService } from '../../../../shared/services/modal.service';

@Component({
  selector: 'eo-select-workspace',
  template: ` <button
      nzTrigger="click"
      eo-ng-button
      nzType="text"
      nzOverlayClassName="select-workspace-class"
      eo-ng-dropdown
      [nzDropdownMenu]="workspaceMenu"
    >
      {{ store.getCurrentWorkspace?.title }}
      <eo-iconpark-icon name="down"></eo-iconpark-icon>
    </button>
    <eo-ng-dropdown-menu #workspaceMenu>
      <ul nz-menu>
        <!-- <div class="flex py-[5px] px-[12px]">
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
            <eo-iconpark-icon name="add"></eo-iconpark-icon>
          </button>
        </div> -->
        <div class="mt-[10px]" *ngIf="localWorkspace" (click)="changeWorkspace(localWorkspace.id)">
          <p class="workspace-title text-tips" i18n>LOCAL</p>
          <li
            class="workspace-item flex items-center"
            [ngClass]="{ 'active-item': store.getCurrentWorkspace?.id === localWorkspace.id }"
            nz-menu-item
          >
            <eo-iconpark-icon class="mr-[5px]" name="home"> </eo-iconpark-icon>{{ localWorkspace.title }}</li
          >
        </div>
        <!-- <nz-divider class="mt-[10px]"></nz-divider> -->
        <!-- <div class="my-[10px]">
          <p class="workspace-title text-tips" i18n>CLOUD</p>
          <p i18n *ngIf="!cloudWorkspaces.length" class="text-tips px-base mt-[10px] mx-[5px] text-[12px]">No cloud workspace</p>
          <li
            class="workspace-item flex justify-between"
            nz-menu-item
            (click)="changeWorkspace(item.id)"
            [ngClass]="{ 'active-item': store.getCurrentWorkspace?.id === item.id }"
            *ngFor="let item of cloudWorkspaces"
          >
            <div class="flex h-full items-center">
              <eo-iconpark-icon class="mr-[5px]" name="link-cloud-sucess"> </eo-iconpark-icon>
              <span class="truncate mw-[250px]"> {{ item.title }}</span>
            </div>
          </li>
        </div> -->
      </ul>
    </eo-ng-dropdown-menu>`,
  styleUrls: ['./select-workspace.component.scss']
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
  changeWorkspace(workspaceID) {
    this.effect.changeWorkspace(workspaceID);
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
