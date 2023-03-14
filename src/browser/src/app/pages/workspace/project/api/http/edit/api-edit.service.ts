import { Injectable } from '@angular/core';
import { ApiBodyType, Protocol, RequestMethod } from 'pc/browser/src/app/pages/workspace/project/api/api.model';
import { ProjectApiService } from 'pc/browser/src/app/pages/workspace/project/api/api.service';
import { ApiData } from 'pc/browser/src/app/services/storage/db/models';
import StorageUtil from 'pc/browser/src/app/shared/utils/storage/storage.utils';

import { ApiEditUtilService } from './api-edit-util.service';

@Injectable()
export class ApiEditService {
  constructor(private apiEditUtil: ApiEditUtilService, private projectApi: ProjectApiService) {}
  getPureApi({ groupId }): ApiData {
    return {
      name: '',
      uri: '/',
      groupId,
      protocol: Protocol.HTTP,
      apiAttrInfo: {
        requestMethod: RequestMethod.POST,
        contentType: ApiBodyType.JSON
      },
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
  async getApi({ id, groupId }): Promise<ApiData> {
    let result = this.getPureApi({ groupId }) as ApiData;
    if (!id) {
      // From test page/copy api data;
      let tmpApiData = StorageUtil.get('apiDataWillbeSave');
      const pureApi = this.getPureApi({ groupId });
      if (tmpApiData) {
        //Add From Test
        StorageUtil.remove('apiDataWillbeSave');
        Object.keys(pureApi).forEach(keyName => {
          //Filter useless keyName
          result[keyName] = tmpApiData[keyName];
        });
      } else {
        //Add directly
        result = pureApi;
      }
    } else {
      result = await this.projectApi.get(id);
    }
    return this.apiEditUtil.formatStorageApiDataToUI(result);
  }
  async addApi(apiData): Promise<[ApiData, any]> {
    const [result, err] = await this.projectApi.add(apiData);
    if (err) {
      return [result, err];
    }
    return [result[0], err];
  }
  async editApi(apiData) {
    apiData.updateApiAttr = 1;
    apiData.updateRequestParams = 1;
    apiData.updateResponseList = 1;
    return await this.projectApi.edit(apiData);
  }
}
