import { Injectable } from '@angular/core';
import { ApiTestUtilService } from 'eo/workbench/browser/src/app/modules/api-shared/api-test-util.service';
import { ProjectApiService } from 'eo/workbench/browser/src/app/pages/workspace/project/api/api.service';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';

import { ApiBodyType, Protocol, RequestMethod } from '../../../../../../modules/api-shared/api.model';
import { ApiTestHistory } from '../../../../../../shared/services/storage/index.model';
import { ApiTestData, ApiTestHistoryFrame } from './api-test.model';
@Injectable()
export class ApiTestService {
  constructor(
    private apiService: ProjectApiService,
    private apiTestUtils: ApiTestUtilService,
    private storage: StorageService,
    private effectService: EffectService
  ) {}
  async getApi({ id }): Promise<ApiTestData> {
    let result: ApiTestData = {
      projectID: -1,
      groupID: 0,
      uri: '',
      protocol: Protocol.HTTP,
      method: RequestMethod.POST,
      uuid: 0,
      requestBodyType: ApiBodyType.Raw,
      requestBodyJsonType: 'object',
      requestBody: '',
      beforeScript: '',
      afterScript: '',
      queryParams: [],
      restParams: [],
      requestHeaders: [
        {
          required: true,
          name: 'content-type',
          value: 'text/plain'
        }
      ]
    };
    if (id) {
      const apiData = await this.apiService.get(id);
      if (apiData) {
        result = this.apiTestUtils.getTestDataFromApi(apiData);
      }
    }
    return result;
  }
  getHistory(id): Promise<ApiTestHistory> {
    return this.effectService.getHistory(id);
  }
  addHistory(history: ApiTestHistoryFrame | any, apiUuid): Promise<any> {
    return this.effectService.createApiTestHistory({
      ...history,
      apiUuid
    });
  }
}
