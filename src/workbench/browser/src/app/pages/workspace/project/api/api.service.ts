import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';

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
    private api: ApiService
  ) {}
  async get(uuid): Promise<ApiData> {
    const [result, err] = await this.api.api_apiDataDetail({ apiUuids: [uuid] });
    if (err) {
      this.message.error($localize`Can't find this Api`);
      return;
    }
    const apiData = result[0];
    apiData.apiAttrInfo ??= {};
    apiData.responseList ??= [
      {
        responseParams: {
          headerParams: [],
          bodyParams: []
        }
      }
    ];
    return apiData;
  }
  async edit(apiData: ApiData) {
    return await this.api.api_apiDataUpdate({ api: apiData });
  }
  async add(apiData: ApiData) {
    return await this.api.api_apiDataCreate({ apiList: [apiData] });
  }
  async copy(apiID: string) {
    const apiData = await this.get(apiID);
    apiData.name += ' Copy';
    delete apiData.apiUuid;
    delete apiData.id;
    const [result, err] = await await this.api.api_apiDataCreate({ apiList: [apiData] });
    if (err) {
      this.message.error($localize`Copy API failed`);
      return;
    }
    this.router.navigate(['/home/workspace/project/api/http/edit'], {
      queryParams: { pageID: Date.now(), uuid: result[0].apiUuid }
    });
    this.effect.getGroupList();
  }
  async delete(apiUuid) {
    // * delete API
    const [result, err] = await this.api.api_apiDataDelete({
      apiUuids: [apiUuid]
    });
    if (err) {
      this.message.error($localize`Delete API failed`);
      return;
    }
    this.message.success($localize`Deleted API Successfully`);
    this.effect.getGroupList();
  }
}
