import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { rest } from 'lodash-es';

import { ApiService } from '../../../../shared/services/storage/api.service';
import { ApiData } from '../../../../shared/services/storage/db/models/apiData';
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
    return result[0];
  }
  async edit(apiData: ApiData) {
    return await this.api.api_apiDataUpdate({ api: apiData });
  }
  async add(apiData: ApiData) {
    const [result, err] = await this.api.api_apiDataCreate({ apiList: [apiData] });
    return result[0];
  }
  async copy(apiID: string) {
    const apiData = await this.get(apiID);
    apiData.name += ' Copy';
    delete apiData.uuid;
    delete apiData.id;
    const [result, err] = await await this.api.api_apiDataCreate({ apiList: [apiData] });
    if (err) {
      console.error(err);
      this.message.error($localize`Copy API failed`);
      return;
    }
    this.router.navigate(['/home/workspace/project/api/http/edit'], {
      queryParams: { pageID: Date.now(), uuid: result[0].uuid }
    });
    this.effect.getGroupList();
  }
  async delete(uuid) {
    // * delete API
    const [result, err] = await this.api.api_apiDataDelete({
      apiUuids: [uuid]
    });
    if (err) return;
    this.effect.getGroupList();
  }
}
