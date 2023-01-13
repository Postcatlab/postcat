import { Injectable } from '@angular/core';
import { formatUri } from 'eo/workbench/browser/src/app/pages/workspace/project/api/service/api-test/api-test.utils';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { transferUrlAndQuery } from 'eo/workbench/browser/src/app/utils/api';
import { tree2obj } from 'eo/workbench/browser/src/app/utils/tree/tree.utils';

@Injectable()
export class ApiMockService {
  constructor(private api: ApiService, private store: StoreService) {
    console.log('init api mock service');
  }
  getMockPrefix(apiData) {
    const uri = transferUrlAndQuery(formatUri(apiData.uri, apiData.restParams), apiData.queryParams, {
      base: 'query'
    }).url;
    return `${this.store.mockUrl}/${uri}`;
  }

  /**
   * get mock list
   *
   * @param apiUuid
   * @returns
   */
  async getMocks(apiUuid: number) {
    const [data, err] = await this.api.api_mockList({
      apiUuid
    });
    return data;
  }
  /**
   * create mock
   *
   * @param mock
   * @returns
   */
  async createMock(mock) {
    const [data, err] = await this.api.api_mockCreate(mock);
    return data;
  }
  /**
   * update mock
   *
   * @param mock
   * @returns
   */
  async updateMock(mockData) {
    const [data, err] = await this.api.api_mockUpdate(mockData);
    return data;
  }
  async deleteMock(id: number) {
    const [data, err] = await this.api.api_mockDelete({ id });
    return data;
  }
  getMockResponseByAPI(responseBody) {
    return JSON.stringify(tree2obj(responseBody));
  }
}
