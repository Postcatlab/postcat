import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'eo/workbench/browser/src/app/layouts/sidebar/sidebar.service';
import { ApiTestUtilService } from 'eo/workbench/browser/src/app/pages/workspace/project/api/service/api-test-util.service';
import { Environment } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { autorun, makeObservable, observable, reaction } from 'mobx';

import { ApiEffectService } from '../../service/store/api-effect.service';
import { ApiStoreService } from '../../service/store/api-state.service';

@Component({
  selector: 'eo-env-select',
  template: `
    <div class="env-select">
      <button
        eo-ng-button
        nzType="text"
        class="flex items-center justify-center ml-2 cursor-pointer"
        i18n-nzTooltipTitle
        eoNgFeedbackTooltip
        [nzTooltipMouseLeaveDelay]="0"
        nzTooltipTitle="Environment Quick Look"
        nz-popover
        nzPopoverOverlayClassName="background-popover preview-env"
        [nzPopoverContent]="envParams"
        nzTooltipPlacement="left"
        nzPopoverPlacement="bottomRight"
        nzPopoverTrigger="click"
      >
        <eo-iconpark-icon name="preview-open"></eo-iconpark-icon>
      </button>
      <ng-template #envParams>
        <div style="width:400px" class="preview pb-4">
          <span class="flex items-center px-6 h-12 title" i18n>Global variable</span>
          <div *ngIf="gloablParams.length" class="flex items-center justify-between px-6 h-8 content">
            <span class="px-1 w-1/3 text-tips" i18n>Name</span>
            <span class="px-1 w-2/3 text-tips" i18n>Value</span>
          </div>
          <div *ngFor="let it of gloablParams" class="flex items-center justify-between px-6 h-8">
            <span class="px-1 w-1/3  text-ellipsis overflow-hidden" [title]="it.name">{{ it.name }}</span>
            <span class="px-1 w-2/3  text-ellipsis overflow-hidden" [title]="it.value">{{ it.value }}</span>
          </div>
          <span *ngIf="!gloablParams.length" class="flex items-center px-6 h-12 text-tips" i18n>No Global variables</span>
          <div *ngIf="renderEnv?.id">
            <div *ngIf="renderEnv.hostUri">
              <span class="flex items-center px-6 h-12 title" i18n>Environment Host</span>
              <div>
                <span class="text-ellipsis overflow-hidden flex items-center px-6 h-12 content">{{ renderEnv.hostUri }}</span>
              </div>
            </div>
            <span class="flex items-center px-6 h-12 title" *ngIf="renderEnv.parameters?.length" i18n>Environment Global variable</span>
            <div class="flex items-center justify-between px-6 h-8">
              <span class="px-1 w-1/3 text-tips" i18n>Name</span>
              <span class="px-1 w-2/3 text-tips" i18n>Value</span>
            </div>
            <div *ngFor="let it of renderEnv.parameters" class="flex items-center justify-between px-6 h-8 content">
              <span class="px-1 w-1/3 text-ellipsis overflow-hidden" [title]="it.name">{{ it.name }}</span>
              <span class="px-1 w-2/3 text-ellipsis overflow-hidden" [title]="it.value">{{ it.value }}</span>
            </div>
          </div>
        </div>
      </ng-template>
      <eo-ng-select
        [nzDropdownMatchSelectWidth]="false"
        [(ngModel)]="envUuid"
        nzDropdownClassName="env-selector-dropdown"
        [(nzOpen)]="isOpen"
        nzPlacement="bottomRight"
        [nzDropdownRender]="renderTemplate"
        nzAllowClear
        i18n-nzPlaceHolder="Environment Dropdown placeholder"
        [nzOptions]="renderEnvList"
        nzPlaceHolder="Environment"
      >
      </eo-ng-select>
      <ng-template #renderTemplate>
        <nz-divider *ngIf="!isShare"></nz-divider>
        <a *ngIf="!isShare" class="!flex text-sx manager-env" eo-ng-button nzType="link" (click)="gotoEnvManager()" i18n
          >Manage Environment</a
        >
      </ng-template>
    </div>
  `,
  styleUrls: ['./env-select.component.scss']
})
export class EnvSelectComponent implements OnInit {
  @observable envUuid = '';
  isOpen = false;
  gloablParams: any = [];
  isShare = false;
  renderEnv: Partial<Environment> = {
    name: '',
    hostUri: '',
    parameters: []
  };
  renderEnvList = [];
  constructor(
    private store: ApiStoreService,
    private globalStore: StoreService,
    private sidebar: SidebarService,
    private effect: ApiEffectService,
    private testUtils: ApiTestUtilService
  ) {}
  ngOnInit() {
    makeObservable(this);
    autorun(() => {
      this.renderEnvList = this.store.getEnvList.map(it => ({ label: it.name, value: it.id }));
      this.renderEnv = this.store.getEnvList
        .map(it => ({
          ...it,
          parameters: it.parameters.filter(item => item.name || item.value)
        }))
        .find((it: any) => it.id === this.store.getCurrentEnv?.id);
    });
    autorun(() => {
      this.isShare = this.globalStore.isShare;
    });
    reaction(
      () => this.envUuid,
      data => {
        this.store.setEnvUuid(data);
      }
    );
    this.envUuid = this.store.getEnvUuid;
    this.effect.updateEnvList();
    this.gloablParams = this.getGlobalParams();
  }
  gotoEnvManager() {
    // * close select
    this.isOpen = false;
    this.sidebar.setModule('@eo-core-env');
  }
  getGlobalParams() {
    return Object.entries(this.testUtils.getGlobals() || {}).map(it => {
      const [key, value] = it;
      return { name: key, value };
    });
  }
}
