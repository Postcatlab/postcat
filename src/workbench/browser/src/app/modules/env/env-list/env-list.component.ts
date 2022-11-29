import { Component, OnInit } from '@angular/core';
import { getGlobals } from 'eo/workbench/browser/src/app/pages/api/service/api-test/api-test.utils';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
import { Environment, StorageRes, StorageResStatus } from '../../../shared/services/storage/index.model';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';

@Component({
  selector: 'env-list',
  template: ` <div style="width:300px">
    <span class="text-gray-400" i18n>Global variable</span>
    <div *ngFor="let it of gloablParams" class="flex items-center justify-between h-8">
      <span class="px-1 w-1/3 text-gray-500 text-ellipsis overflow-hidden" [title]="it.name">{{ it.name }}</span>
      <span class="px-1 w-2/3 text-gray-500 text-ellipsis overflow-hidden" [title]="it.value">{{ it.value }}</span>
    </div>
    <p *ngIf="!gloablParams.length" class="text-gray-500" i18n>No Global variables</p>
    <div class="pt-2.5" *ngIf="env?.uuid">
      <div *ngIf="env.hostUri">
        <span class="text-gray-400" i18n>Environment Host</span>
        <div>
          <p class="text-gray-500 text-ellipsis overflow-hidden" class="h-8">{{ env.hostUri }}</p>
        </div>
      </div>
      <span class="text-gray-400" *ngIf="env.parameters?.length" i18n>Environment Global variable</span>
      <div *ngFor="let it of env.parameters" class="flex items-center justify-between h-8">
        <span class="px-1 w-1/3 text-gray-500 text-ellipsis overflow-hidden" [title]="it.name">{{ it.name }}</span>
        <span class="px-1 w-2/3 text-gray-500 text-ellipsis overflow-hidden" [title]="it.value">{{ it.value }}</span>
      </div>
    </div>
  </div>`,
  styleUrls: [],
})
export class EnvListComponent implements OnInit {
  env: Environment | any = {};
  gloablParams: any = [];
  constructor(private storage: StorageService, private store: StoreService, private http: RemoteService) {}
  async ngOnInit() {
    this.gloablParams = this.getGlobalParams();
    const uuid = Number(localStorage.getItem('env:selected')) || null;
    if (uuid == null) {
      return;
    }
    const envList: any = await this.getAllEnv();
    this.env = envList
      .map((it) => ({
        ...it,
        parameters: it.parameters.filter((item) => item.name || item.value),
      }))
      .find((it: any) => it.uuid === uuid);
  }
  getAllEnv(uuid?: number) {
    const projectID = 1;
    return new Promise((resolve) => {
      if (this.store.isShare) {
        this.http
          .api_shareDocGetEnv({
            uniqueID: this.store.shareId,
          })
          .then(([data, err]) => {
            if (err) {
              return resolve([]);
            }
            return resolve(data || []);
          });
        return;
      }
      this.storage.run('environmentLoadAllByProjectID', [projectID], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          return resolve(result.data || []);
        }
        return resolve([]);
      });
    });
  }
  getGlobalParams() {
    return Object.entries(getGlobals() || {}).map((it) => {
      const [key, value] = it;
      return { name: key, value };
    });
  }
}
