import { Injectable } from '@angular/core';
import { ApiService } from 'eo/workbench/browser/src/app/pages/api/api.service';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage';
import { ApiData, StorageRes } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { treeToListHasLevel } from 'eo/workbench/browser/src/app/utils/tree/tree.utils';
import { RequestMethod, RequestProtocol } from '../../../shared/services/storage/index.model';
import { ApiEditUtilService } from './api-edit-util.service';
@Injectable()
export class ApiEditService {
  constructor(
    private storage: StorageService,
    private apiEditUtil: ApiEditUtilService,
    private apiService: ApiService
  ) {}
  async getApi({ id, groupID }): Promise<ApiData> {
    let result: ApiData = {} as ApiData;
    if (!id) {
      // From test page/copy api data;
      const tmpApiData = window.sessionStorage.getItem('apiDataWillbeSave');
      if (tmpApiData) {
        console.log('apiDataWillbeSave',tmpApiData);
        //Add From Test
        window.sessionStorage.removeItem('apiDataWillbeSave');
        Object.assign(result, JSON.parse(tmpApiData));
      } else {
        //Add directly
        result = Object.assign(
          {
            name: '',
            projectID: 1,
            uri: '/',
            groupID,
            protocol: RequestProtocol.HTTP,
            method: RequestMethod.POST,
          },
          {
            requestBodyType: 'json',
            requestBodyJsonType: 'object',
            requestBody: [],
            queryParams: [],
            restParams: [],
            requestHeaders: [],
            responseHeaders: [],
            responseBodyType: 'json',
            responseBodyJsonType: 'object',
            responseBody: [],
          }
        );
      }
    } else {
      result = (await this.apiService.get(id)) as ApiData;
    }
    return result;
  }
  editApi(apiData): Promise<StorageRes> {
    const busEvent = apiData.uuid ? 'editApi' : 'addApi';
    if (busEvent === 'editApi') {
      return new Promise((resolve) => {
        this.storage.run('apiDataUpdate', [apiData, apiData.uuid], resolve);
      });
    } else {
      return this.apiService.add(apiData);
    }
  }
}
