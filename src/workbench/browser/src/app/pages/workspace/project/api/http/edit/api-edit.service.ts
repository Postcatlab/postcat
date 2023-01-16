import { Injectable } from '@angular/core';
import { ProjectApiService } from 'eo/workbench/browser/src/app/pages/workspace/project/api/api.service';
import { ApiBodyType, ProtocolEnum, RequestMethodEnum } from 'eo/workbench/browser/src/app/shared/services/storage/db/enums/api.enum';
import { ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { StorageRes } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';

import { ApiEditUtilService } from './api-edit-util.service';
@Injectable()
export class ApiEditService {
  constructor(
    private storage: StorageService,
    private effect: EffectService,
    private apiEditUtil: ApiEditUtilService,
    private apiService: ProjectApiService
  ) {}
  getPureApi({ groupId }): ApiData {
    return {
      name: '',
      uri: '/',
      groupId,
      protocol: ProtocolEnum.HTTP,
      apiAttrInfo: {
        requestMethod: RequestMethodEnum.POST,
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
          name: $localize`default`,
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
    let result = {} as ApiData;
    if (!id) {
      // From test page/copy api data;
      let tmpApiData = window.sessionStorage.getItem('apiDataWillbeSave');
      const pureApi = this.getPureApi({ groupId });
      if (tmpApiData) {
        //Add From Test
        window.sessionStorage.removeItem('apiDataWillbeSave');
        tmpApiData = JSON.parse(tmpApiData);
        Object.keys(pureApi).forEach(keyName => {
          //Filter useless keyName
          result[keyName] = tmpApiData[keyName];
        });
      } else {
        //Add directly
        result = pureApi;
      }
    } else {
      //@ts-ignore
      result = await this.effect.getAPI(id);
    }
    return this.apiEditUtil.parseApiStorage2UI(result);
  }
  editApi(apiData): Promise<StorageRes> {
    const busEvent = apiData.uuid ? 'editApi' : 'addApi';
    if (busEvent === 'editApi') {
      return new Promise(resolve => {
        this.storage.run('apiDataUpdate', [apiData, apiData.uuid], resolve);
      });
    } else {
      return this.apiService.add(apiData);
    }
  }
}
