import { Injectable } from '@angular/core';
import { ApiService } from 'eo/workbench/browser/src/app/pages/api/api.service';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage';
import { ApiBodyType, ApiData, ApiEditViewData, JsonRootType, StorageRes } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { RequestMethod, RequestProtocol } from '../../../shared/services/storage/index.model';
import { ApiEditUtilService } from './api-edit-util.service';
@Injectable()
export class ApiEditService {
  constructor(
    private storage: StorageService,
    private apiEditUtil: ApiEditUtilService,
    private apiService: ApiService
  ) {}
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
        requestBodyType: ApiBodyType.JSON,
        requestBodyJsonType: JsonRootType.Object,
        requestBody: [],
        queryParams: [],
        restParams: [],
        requestHeaders: [],
        responseHeaders: [],
        responseBodyType: ApiBodyType.JSON,
        responseBodyJsonType: JsonRootType.Object,
        responseBody: [],
      }
    );
  }
  async getApi({ id, groupID }): Promise<ApiEditViewData> {
    let result= {} as ApiData;
    if (!id) {
      // From test page/copy api data;
      let tmpApiData = window.sessionStorage.getItem('apiDataWillbeSave');
      const pureApi = this.getPureApi({ groupID });
      if (tmpApiData) {
        //Add From Test
        window.sessionStorage.removeItem('apiDataWillbeSave');
        tmpApiData = JSON.parse(tmpApiData);
        Object.keys(pureApi).forEach((keyName) => {
          //Filter useless keyName
          result[keyName] = tmpApiData[keyName];
        });
        result.projectID=pureApi.projectID;
      } else {
        //Add directly
        result = pureApi;
      }
    } else {
      result = (await this.apiService.get(id));
    }
    return this.apiEditUtil.getFormdataFromApiData(result);
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
