import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiBodyType, BASIC_TABS_INFO, TabsConfig } from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { ApiTestUtilService } from 'pc/browser/src/app/pages/workspace/project/api/service/api-test-util.service';
import { syncUrlAndQuery } from 'pc/browser/src/app/pages/workspace/project/api/utils/api.utils';
import { ApiService } from 'pc/browser/src/app/services/storage/api.service';
import { ApiData } from 'pc/browser/src/app/services/storage/db/models/apiData';
import { StoreService } from 'pc/browser/src/app/shared/store/state.service';
import { json2xml, table2json } from 'pc/browser/src/app/shared/utils/data-transfer/data-transfer.utils';

@Injectable({
  providedIn: 'root'
})
export class ApiMockService {
  constructor(
    private api: ApiService,
    private globalStore: StoreService,
    private testUtils: ApiTestUtilService,
    private router: Router,
    @Inject(BASIC_TABS_INFO) public tabsConfig: TabsConfig
  ) {
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
  toDetail(mockID) {
    this.router.navigate([this.tabsConfig.basic_tabs.find(val => val.uniqueName === 'api-http-mock-edit').pathname], {
      queryParams: { uuid: mockID, pageID: Date.now() }
    });
  }
  toEdit(mockID) {
    this.router.navigate([this.tabsConfig.basic_tabs.find(val => val.uniqueName === 'api-http-mock-edit').pathname], {
      queryParams: { uuid: mockID }
    });
  }
  toAdd(apiID?) {
    this.router.navigate([this.tabsConfig.basic_tabs.find(val => val.uniqueName === 'api-http-mock-edit').pathname], {
      queryParams: { apiUuid: apiID, pageID: Date.now() }
    });
  }
  toDelete(apiInfo: ApiData) {
    // this.modalService.confirm({
    //   nzTitle: $localize`Deletion Confirmation?`,
    //   nzContent: $localize`Are you sure you want to delete the data <strong title="${apiInfo.name}">${
    //     apiInfo.name.length > 50 ? `${apiInfo.name.slice(0, 50)}...` : apiInfo.name
    //   }</strong> ? You cannot restore it once deleted!`,
    //   nzOnOk: () => {
    //     this.delete(apiInfo.apiUuid);
    //   }
    // });
  }
  async copy(inMockUuid: string) {
    // const { apiUuid, id, ...apiData } = await this.get(inMockUuid);
    // apiData.name += ' Copy';
    // const [result, err] = await this.add(apiData);
    // if (err) {
    //   console.log(err);
    //   this.feedback.error($localize`Copy API failed`);
    //   return;
    // }
    // this.router.navigate(['/home/workspace/project/api/http/edit'], {
    //   queryParams: { pageID: Date.now(), uuid: result[0].apiUuid }
    // });
    // this.effect.getGroupList();
  }
}
