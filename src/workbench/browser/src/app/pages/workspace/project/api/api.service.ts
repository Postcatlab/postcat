import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';

import { ApiService } from '../../../../shared/services/storage/api.service';
import { ApiData, StorageRes } from '../../../../shared/services/storage/index.model';
import { EffectService } from '../../../../shared/store/effect.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectApiService {
  constructor(
    private message: EoNgFeedbackMessageService,
    private router: Router,
    private effect: EffectService,
    private api: ApiService,
    private storage: StorageService
  ) {}
  async get(uuid): Promise<ApiData> {
    const [result, err] = await this.api.api_apiDataDetail({ apiUuids: [uuid] });
    if (err) {
      this.message.error($localize`Can't find this Api`);
    }
    return result;
  }
  getAll(projectID): Promise<StorageRes> {
    return new Promise(resolve => {
      this.storage.run('apiDataLoadAllByProjectID', [projectID], resolve);
    });
  }
  async edit(apiData: ApiData) {
    return await this.api.api_apiDataUpdate({ api: apiData });
  }
  async add(apiData: ApiData) {
    return await this.api.api_apiDataCreate({ apiList: [apiData] });
  }
  async copy(apiData: ApiData) {
    apiData.name += ' Copy';
    const [result, err] = await this.add(apiData);
    this.router.navigate(['/home/workspace/project/api/http/edit'], {
      queryParams: { pageID: Date.now(), uuid: result.uuid }
    });
  }
  async delete(uuid) {
    // * delete API
    const [result, err] = await this.api.api_apiDataDelete({
      apiUuids: [uuid]
    });
    if (err) return;
    this.effect.getGroupList();
  }
  bulkDelete(apis) {
    this.storage.run('apiDataBulkRemove', [apis], (result: StorageRes) => {});
  }
}
