import { Injectable } from '@angular/core';
import { ApiBodyType } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { formatUri } from 'eo/workbench/browser/src/app/pages/workspace/project/api/service/api-test/api-test.utils';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { transferUrlAndQuery } from 'eo/workbench/browser/src/app/utils/api';
import { table2json } from 'eo/workbench/browser/src/app/utils/data-transfer/data-transfer.utils';
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
  async getMocks(apiUuid: string) {
    const [data, err] = await this.api.api_mockList({
      apiUuid,
      page: 1,
      pageSize: 200
    });
    return data?.items || [];
  }
  /**
   * create mock
   *
   * @param mock
   * @returns
   */
  async createMock(mock) {
    return await this.api.api_mockCreate(mock);
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
    console.log(id);
    const [data, err] = await this.api.api_mockDelete({ id });
    return data;
  }
  getMockResponseByAPI(apiData: ApiData) {
    const body = [ApiBodyType.Raw, ApiBodyType.Binary].includes(apiData.responseList?.[0].contentType)
      ? apiData.responseList?.[0]?.responseParams?.bodyParams?.[0].binaryRawData
      : apiData.responseList?.[0]?.responseParams?.bodyParams;
    return typeof body === 'string' ? body : JSON.stringify(table2json(body));
  }
}
