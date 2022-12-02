import { Component, OnInit } from '@angular/core';
import { getGlobals } from 'eo/workbench/browser/src/app/pages/api/service/api-test/api-test.utils';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
import { Environment } from '../../../shared/services/storage/index.model';
import { computed } from 'mobx';

@Component({
  selector: 'env-list',
  template: ` <div style="width:300px">
    <span class="text-gray-400" i18n>Global variable</span>
    <div *ngFor="let it of gloablParams" class="flex items-center justify-between h-8">
      <span class="px-1 w-1/3 text-gray-500 text-ellipsis overflow-hidden" [title]="it.name">{{ it.name }}</span>
      <span class="px-1 w-2/3 text-gray-500 text-ellipsis overflow-hidden" [title]="it.value">{{ it.value }}</span>
    </div>
    <p *ngIf="!gloablParams.length" class="text-gray-500" i18n>No Global variables</p>
    <div class="pt-2.5" *ngIf="getEnv?.uuid">
      <div *ngIf="getEnv.hostUri">
        <span class="text-gray-400" i18n>Environment Host</span>
        <div>
          <p class="text-gray-500 text-ellipsis overflow-hidden" class="h-8">{{ getEnv.hostUri }}</p>
        </div>
      </div>
      <span class="text-gray-400" *ngIf="getEnv.parameters?.length" i18n>Environment Global variable</span>
      <div *ngFor="let it of getEnv.parameters" class="flex items-center justify-between h-8">
        <span class="px-1 w-1/3 text-gray-500 text-ellipsis overflow-hidden" [title]="it.name">{{ it.name }}</span>
        <span class="px-1 w-2/3 text-gray-500 text-ellipsis overflow-hidden" [title]="it.value">{{ it.value }}</span>
      </div>
    </div>
  </div>`,
  styleUrls: [],
})
export class EnvListComponent implements OnInit {
  gloablParams: any = [];
  @computed get getEnv(): Environment {
    return this.store.getEnvList
      .map((it) => ({
        ...it,
        parameters: it.parameters.filter((item) => item.name || item.value),
      }))
      .find((it: any) => it.uuid === this.store.getCurrentEnv?.uuid);
  }
  constructor(private store: StoreService, private http: RemoteService) {}
  async ngOnInit() {
    this.gloablParams = this.getGlobalParams();
  }
  getGlobalParams() {
    return Object.entries(getGlobals() || {}).map((it) => {
      const [key, value] = it;
      return { name: key, value };
    });
  }
}
