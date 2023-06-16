import { Injectable } from '@angular/core';
import { ApiBodyType, Protocol, RequestMethod } from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { ProjectApiService } from 'pc/browser/src/app/pages/workspace/project/api/service/project-api.service';
import { ApiEffectService } from 'pc/browser/src/app/pages/workspace/project/api/store/api-effect.service';
import { ApiData } from 'pc/browser/src/app/services/storage/db/models/apiData';
import StorageUtil from 'pc/browser/src/app/shared/utils/storage/storage.utils';

import { ApiEditUtilService } from './api-edit-util.service';

@Injectable({
  providedIn: 'root'
})
export class ApiEditService {
  constructor(private apiEditUtil: ApiEditUtilService, private projectApi: ProjectApiService, private effect: ApiEffectService) {}
  getPureApi(): ApiData {
    return {
      name: '',
      uri: '/',
      groupId: 0,
      protocol: Protocol.HTTP,
      apiAttrInfo: {
        requestMethod: RequestMethod.POST,
        contentType: ApiBodyType.JSON
      },
      scriptList: [
        { scriptType: 1, data: '' },
        { scriptType: 2, data: '' }
      ],
      requestParams: {
        headerParams: [],
        bodyParams: [],
        queryParams: [],
        restParams: []
      },
      responseList: [
        {
          name: $localize`Default`,
          isDefault: 1,
          httpCode: '200',
          contentType: ApiBodyType.JSON,
          responseParams: {
            headerParams: [],
            bodyParams: []
          }
        }
      ]
    };
  }
  async getApi({ id }): Promise<ApiData> {
    let result;
    const tmpApiData = StorageUtil.get('api_data_will_be_save');
    const addType = !id || StorageUtil.get('openAIToAPI') ? (tmpApiData ? 'from_test' : 'blank') : 'edit';
    switch (addType) {
      case 'from_test': {
        //Add From Test
        const pureApi = this.getPureApi();
        Object.keys(pureApi).forEach(keyName => {
          //Filter useless keyName
          pureApi[keyName] = tmpApiData[keyName];
        });
        result = pureApi;
        StorageUtil.remove('api_data_will_be_save');
        break;
      }
      case 'blank': {
        //Add directly
        const pureApi = this.getPureApi();
        result = pureApi;
        break;
      }
      case 'edit': {
        const pureApi = this.getPureApi() as ApiData;
        result = await this.projectApi.get(id);
        Object.keys(pureApi).forEach(keyName => {
          //Filter useless keyName
          result[keyName] ??= pureApi[keyName];
        });
        break;
      }
    }
    return this.apiEditUtil.formatStorageApiDataToUI(result);
  }
  async editApi(apiData) {
    apiData.updateApiAttr = 1;
    apiData.updateRequestParams = 1;
    apiData.updateResponseList = 1;
    return await this.effect.updateAPI(apiData);
  }
}
