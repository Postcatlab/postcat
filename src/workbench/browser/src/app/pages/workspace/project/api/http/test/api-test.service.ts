import { Injectable } from '@angular/core';
import { ApiTestUtilService } from 'eo/workbench/browser/src/app/modules/api-shared/api-test-util.service';
import { ProjectApiService } from 'eo/workbench/browser/src/app/pages/workspace/project/api/api.service';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';

import { RequestMethod, RequestProtocol } from '../../../../../../modules/api-shared/api.model';
import { ApiTestHistory } from '../../../../../../shared/services/storage/index.model';
import { ApiTestData, ApiTestHistoryFrame } from './api-test.model';
@Injectable()
export class ApiTestService {
  constructor(private apiService: ProjectApiService, private apiTestUtils: ApiTestUtilService, private storage: StorageService) {}
  async getApi({ id }): Promise<ApiTestData> {
    let result: ApiTestData = {
      projectID: -1,
      groupID: 0,
      uri: '',
      protocol: RequestProtocol.HTTP,
      method: RequestMethod.POST,
      uuid: 0,
      requestBodyType: 'raw',
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
    return new Promise(resolve => {
      this.storage.run('apiTestHistoryLoad', [id], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          resolve(result.data);
        } else {
          console.error(result.data);
        }
      });
    });
  }
  addHistory(history: ApiTestHistoryFrame | any, apiID): Promise<any> {
    return new Promise(resolve => {
      this.storage.run(
        'apiTestHistoryCreate',
        [
          {
            apiDataID: apiID,
            ...history
          }
        ],
        (result: StorageRes) => {
          if (result.status === StorageResStatus.success) {
            resolve(result.data);
          } else {
            console.error(result.data);
          }
        }
      );
    });
  }
}
