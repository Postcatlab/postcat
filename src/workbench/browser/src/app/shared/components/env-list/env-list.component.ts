import { Component, OnInit } from '@angular/core';
import { it_IT } from 'ng-zorro-antd/i18n';
import { StorageRes, StorageResStatus } from '../../../shared/services/storage/index.model';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'env-list',
  template: ` <nz-card style="width:300px">
    <span class="text-gray-400">Environment variable</span>
    <!-- <span class="my-2">{{ item.name }}</span> -->
    <div *ngFor="let it of envParams" class="flex items-center justify-between h-8">
      <span class="w-1/3 text-gray-500">{{ it.name }}</span>
      <span class="w-2/3 text-gray-500">{{ it.description }}</span>
    </div>
  </nz-card>`,
  styleUrls: [],
})
export class EnvListComponent implements OnInit {
  envParams: any = [];
  constructor(private storage: StorageService) {}
  async ngOnInit() {
    const uuid = Number(localStorage.getItem('env:selected')) || null;
    if (uuid == null) {
      this.envParams = [];
      return;
    }
    const envList = (await this.getAllEnv()) as [];
    const [env]: any[] = envList.filter((it: any) => it.uuid === uuid);
    console.log(env, envList);
    this.envParams = env.parameters.filter((it: any) => it.name && it.value);
  }
  getAllEnv(uuid?: number) {
    const projectID = 1;
    return new Promise((resolve) => {
      this.storage.run('environmentLoadAllByProjectID', [projectID], async (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          return resolve(result.data || []);
        }
        return resolve([]);
      });
    });
  }
}
