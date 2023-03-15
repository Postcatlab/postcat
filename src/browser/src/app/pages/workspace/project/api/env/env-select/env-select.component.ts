import { Component, OnInit } from '@angular/core';
import { autorun, makeObservable, observable, reaction, action, toJS } from 'mobx';
import { SidebarService } from 'pc/browser/src/app/layouts/sidebar/sidebar.service';
import { ApiTestUtilService } from 'pc/browser/src/app/pages/workspace/project/api/service/api-test-util.service';
import { Environment } from 'pc/browser/src/app/services/storage/db/models';
import { TraceService } from 'pc/browser/src/app/services/trace.service';
import { StoreService } from 'pc/browser/src/app/store/state.service';

import { ApiEffectService } from '../../store/api-effect.service';
import { ApiStoreService } from '../../store/api-state.service';

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
        (nzTooltipVisibleChange)="onVisibleChange($event)"
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
            <span class="px-1 w-2/3" nz-typography nzEllipsis [nzContent]="it.value" [title]="it.value"></span>
          </div>
          <span *ngIf="!gloablParams.length" class="flex items-center px-6 h-12 text-tips" i18n>No Global variables</span>
          <div *ngIf="renderEnv?.id">
            <div *ngIf="renderEnv.hostUri">
              <span class="flex items-center px-6 h-12 title" i18n>Environment Host</span>
              <div>
                <span class="text-ellipsis overflow-hidden flex items-center px-6 h-12 content">{{ renderEnv.hostUri }}</span>
              </div>
            </div>
            <ng-container *ngIf="renderEnv.parameters?.length">
              <span class="flex items-center px-6 h-12 title" i18n>Environment Global variable</span>
              <div class="flex items-center justify-between px-6 h-8">
                <span class="px-1 w-1/3 text-tips" i18n>Name</span>
                <span class="px-1 w-2/3 text-tips" i18n>Value</span>
              </div>
            </ng-container>
            <div *ngFor="let it of renderEnv.parameters" class="flex items-center justify-between px-6 h-8 content">
              <span class="px-1 w-1/3 text-ellipsis overflow-hidden" [title]="it.name">{{ it.name }}</span>
              <span class="px-1 w-2/3" nz-typography nzEllipsis [nzContent]="it.value" [title]="it.value"></span>
            </div>
          </div>
        </div>
      </ng-template>
      <eo-ng-select
        [nzDropdownMatchSelectWidth]="false"
        [(ngModel)]="envUuid"
        class="env-select-componnet"
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
        <ng-container *ngIf="!globalStore.isShare">
          <nz-divider></nz-divider>
          <a class="!flex text-sx manager-env" eo-ng-button nzType="link" (click)="gotoEnvManager()" i18n>Manage Environment</a>
        </ng-container>
      </ng-template>
    </div>
  `,
  styleUrls: ['./env-select.component.scss']
})
export class EnvSelectComponent implements OnInit {
  @observable envUuid = '';
  isOpen = false;
  gloablParams: any = [];
  renderEnv: Partial<Environment> = {
    name: '',
    hostUri: '',
    parameters: []
  };
  renderEnvList = [];
  constructor(
    private store: ApiStoreService,
    public globalStore: StoreService,
    private sidebar: SidebarService,
    private effect: ApiEffectService,
    private testUtils: ApiTestUtilService,
    private trace: TraceService
  ) {}
  onVisibleChange($event) {
    if ($event) {
      this.gloablParams = this.getGlobalParams();
    }
  }
  ngOnInit() {
    makeObservable(this);
    this.effect.updateEnvList();

    reaction(
      () => this.store.getEnvList,
      list => {
        this.renderEnvList = list.map(it => ({ label: it.name, value: it.id }));
        this.setCurrentEnv();
      }
    );

    /**
     * Change Select env id
     */
    reaction(
      () => this.envUuid,
      data => {
        this.store.setEnvUuid(data);
        data && this.trace.report('select_environment');
      }
    );
    this.setEnvUuid(this.store.getEnvUuid);

    /**
     * Set current selected environment by id
     */
    reaction(
      () => this.store.getEnvUuid,
      data => {
        /**
         * From outside change env uuid
         * Such as add enviroment
         */
        this.setEnvUuid(data);
        this.setCurrentEnv();
      }
    );
  }
  @action setEnvUuid(uuid) {
    this.envUuid = uuid;
  }

  setCurrentEnv() {
    this.renderEnv = toJS(this.store.getEnvList.find((it: any) => it.id === this.store.getEnvUuid));
    if (!this.renderEnv) return;
    this.renderEnv.parameters = this.renderEnv.parameters.filter(item => item.name || item.value);
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
