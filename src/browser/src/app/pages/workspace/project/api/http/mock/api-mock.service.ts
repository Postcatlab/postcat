import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import {
  ApiBodyType,
  ApiTabsUniqueName,
  BASIC_TABS_INFO,
  TabsConfig
} from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { ApiTestUtilService } from 'pc/browser/src/app/pages/workspace/project/api/service/api-test-util.service';
import { ProjectApiService } from 'pc/browser/src/app/pages/workspace/project/api/service/project-api.service';
import { ApiEffectService } from 'pc/browser/src/app/pages/workspace/project/api/store/api-effect.service';
import { syncUrlAndQuery } from 'pc/browser/src/app/pages/workspace/project/api/utils/api.utils';
import { ApiService } from 'pc/browser/src/app/services/storage/api.service';
import { ApiData } from 'pc/browser/src/app/services/storage/db/models/apiData';
import { StoreService } from 'pc/browser/src/app/shared/store/state.service';
import { json2xml, table2json } from 'pc/browser/src/app/shared/utils/data-transfer/data-transfer.utils';
import storageUtils from 'pc/browser/src/app/shared/utils/storage/storage.utils';

@Injectable({
  providedIn: 'root'
})
export class ApiMockService {
  mockOperateUrl;
  constructor(
    private api: ApiService,
    private globalStore: StoreService,
    private testUtils: ApiTestUtilService,
    private router: Router,
    private message: EoNgFeedbackMessageService,
    private apiEffect: ApiEffectService,
    private projectApi: ProjectApiService,
    @Inject(BASIC_TABS_INFO) public tabsConfig: TabsConfig
  ) {
    this.mockOperateUrl = this.tabsConfig.pathByName[ApiTabsUniqueName.HttpMock];
    console.log('init api mock service');
  }
  getMockPrefix(apiData) {
    const uri = syncUrlAndQuery(this.testUtils.formatUri(apiData.uri, apiData.restParams), apiData.queryParams).url;
    return `${this.globalStore.mockUrl}/${uri}`;
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
    switch (apiData.responseList?.[0].contentType) {
      case ApiBodyType.Raw:
      case ApiBodyType.Binary: {
        return apiData.responseList?.[0]?.responseParams?.bodyParams?.[0]?.binaryRawData || '';
      }
      case ApiBodyType.JSON:
      case ApiBodyType.JSONArray: {
        const body = apiData.responseList?.[0]?.responseParams?.bodyParams;
        return JSON.stringify(table2json(body));
      }
      case ApiBodyType.XML: {
        const body = apiData.responseList?.[0]?.responseParams?.bodyParams;
        return json2xml(table2json(body));
      }
    }
  }
  toDetail(model) {
    console.log(model);
    this.router.navigate([this.mockOperateUrl], {
      queryParams: { uuid: model.id, apiUuid: model.apiUuid, pageID: Date.now() }
    });
  }
  toEdit(mockID) {
    storageUtils.set('mock-edit', true);
    this.router.navigate([this.mockOperateUrl], {
      queryParams: { uuid: mockID }
    });
  }
  async toAdd(apiUuid?) {
    // this.router.navigate([this.mockOperateUrl], {
    //   queryParams: { apiUuid: apiID, pageID: Date.now() }
    // });
    const apiData = await this.projectApi.get(apiUuid);
    const data = {
      name: 'NEW MOCK',
      response: this.getMockResponseByAPI(apiData),
      apiUuid: apiUuid
    };
    this.addNewMock(data);
  }

  async addNewMock(mockItem) {
    mockItem.createWay = 'custom';
    const [data, err] = await this.createMock(mockItem);
    if (err) {
      this.message.error($localize`Failed to add`);
      return;
    }
    this.message.success($localize`Added successfully`);
    storageUtils.set('mock-edit', true);
    this.apiEffect.createMock();
    this.router.navigate([this.mockOperateUrl], {
      queryParams: { uuid: data.id, pageID: Date.now().toString() }
    });
  }
  async toDelete(id: number) {
    const data = await this.deleteMock(id);
    if (!data) {
      this.message.error($localize`Failed to delete`);
      return;
    }
    this.message.success($localize`Delete Succeeded`);
    this.apiEffect.deleteMockDetail();
  }
  async copy(mock_id: string) {
    const [res] = await this.api.api_mockDetail({ id: mock_id });
    const data = {
      name: res.name,
      response: res.response,
      apiUuid: res.apiUuid
    };
    this.addNewMock(data);
  }
}
