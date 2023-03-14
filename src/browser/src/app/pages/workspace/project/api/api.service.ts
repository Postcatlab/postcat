import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';

import { MessageService } from '../../../../services/message';
import { ApiService } from '../../../../services/storage/api.service';
import { ApiData } from '../../../../services/storage/db/models/apiData';
import { StoreService } from '../../../../store/state.service';
import { ApiEffectService } from './store/api-effect.service';

@Injectable()
export class ProjectApiService {
  constructor(
    private message: EoNgFeedbackMessageService,
    private messageService: MessageService,
    private router: Router,
    private effect: ApiEffectService,
    private api: ApiService,
    private globalStore: StoreService
  ) {}
  async get(uuid): Promise<ApiData> {
    const [result, err] = await (this.globalStore.isShare
      ? this.api.api_shareApiDataDetail({ apiUuids: [uuid], withParams: 1, sharedUuid: this.globalStore.getShareID })
      : this.api.api_apiDataDetail({ apiUuids: [uuid], withParams: 1 }));
    if (err || !result?.[0]) {
      this.message.error($localize`Can't find this API`);
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
    apiData.responseList[0].responseParams ??= {
      responseParams: {
        headerParams: [],
        bodyParams: []
      }
    };
    return apiData;
  }
  async edit(apiData: ApiData) {
    return await this.api.api_apiDataUpdate({ api: apiData });
  }
  async add(apiData: ApiData) {
    return await this.api.api_apiDataCreate({ apiList: [].concat([apiData]) });
  }
  async copy(apiID: string) {
    const { apiUuid, id, ...apiData } = await this.get(apiID);
    apiData.name += ' Copy';
    const [result, err] = await this.add(apiData);
    if (err) {
      console.log(err);
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
    const [, err] = await this.api.api_apiDataDelete({
      apiUuids: [apiUuid]
    });
    if (err) {
      this.message.error($localize`Delete API failed`);
      return;
    }
    this.messageService.send({ type: 'deleteApiSuccess', data: { uuids: [apiUuid] } });
    this.message.success($localize`Deleted API Successfully`);
    this.effect.getGroupList();
  }
}
