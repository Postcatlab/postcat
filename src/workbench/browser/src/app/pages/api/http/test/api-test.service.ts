import { Injectable } from '@angular/core';
import { ApiService } from 'eo/workbench/browser/src/app/pages/api/api.service';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import {
  ApiTestData,
  ApiTestHistoryFrame,
  RequestMethod,
  RequestProtocol,
  StorageRes,
  StorageResStatus,
} from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { ApiTestHistory } from '../../../../shared/services/storage/index.model';
import { ApiTestUtilService } from 'eo/workbench/browser/src/app/modules/api-shared/api-test-util.service';
@Injectable()
export class ApiTestService {
  constructor(
    private apiService: ApiService,
    private apiTestUtils: ApiTestUtilService,
    private storage: StorageService
  ) {}
  async getApi({ id }): Promise<ApiTestData> {
    let result: ApiTestData = Object.assign(
      {
        projectID: 1,
        groupID: 0,
        uri: '',
        protocol: RequestProtocol.HTTP,
        method: RequestMethod.POST,
      },
      {
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
            // editable:false,
            required: true,
            name: 'content-type',
            value:'application/json',
          },
        ],
      }
    );
    if (id) {
      const apiData = await this.apiService.get(id);
      if (apiData) {
        result = this.apiTestUtils.getTestDataFromApi(apiData);
      }
    }
    return result;
  }
  getHistory(id): Promise<ApiTestHistory> {
    return new Promise((resolve) => {
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
    return new Promise((resolve) => {
      this.storage.run(
        'apiTestHistoryCreate',
        [
          {
            projectID: 1,
            apiDataID: apiID,
            ...history,
          },
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
