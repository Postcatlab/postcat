import { Injectable } from '@angular/core';
import { ApiService } from 'eo/workbench/browser/src/app/pages/api/api.service';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage';
import { ApiData, StorageRes } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { RequestMethod, RequestProtocol } from '../../../shared/services/storage/index.model';
@Injectable()
export class ApiEditService {
  constructor(private storage: StorageService, private apiService: ApiService) {}
  getPureApi({ groupID }) {
    return Object.assign(
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
  async getApi({ id, groupID }): Promise<ApiData> {
    let result: ApiData = {} as ApiData;
    if (!id) {
      // From test page/copy api data;
      let tmpApiData = window.sessionStorage.getItem('apiDataWillbeSave');
      const pureApi = this.getPureApi({ groupID });
      if (tmpApiData) {
        //Add From Test
        console.log('apiDataWillbeSave', tmpApiData);
        window.sessionStorage.removeItem('apiDataWillbeSave');
        tmpApiData = JSON.parse(tmpApiData);
        Object.keys(pureApi).forEach((keyName) => {
          //Filter useless keyName
          result[keyName] = tmpApiData[keyName];
        });
      } else {
        //Add directly
        result = pureApi;
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
