import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { ApiTestService } from 'eo/workbench/browser/src/app/pages/api/test/api-test.service';
import { eoFormatRequestData } from 'eo/workbench/browser/src/app/shared/services/api-test/api-test.utils';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/remote/remote.service';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { tree2obj } from 'eo/workbench/browser/src/app/utils/tree/tree.utils';
import { ApiData, ApiMockEntity, StorageRes, StorageResStatus } from '../../../../shared/services/storage/index.model';

@Component({
  selector: 'eo-api-detail-mock',
  templateUrl: './api-detail-mock.component.html',
  styleUrls: ['./api-detail-mock.component.scss'],
})
export class ApiDetailMockComponent implements OnChanges {
  @Input() apiData: ApiData;
  get mockUrl() {
    return this.remoteService.mockUrl;
  }
  mocklList: ApiMockEntity[] = [];
  listConf: object = {};
  isVisible = false;
  createWayMap = {
    system: '系统自动创建',
    custom: '手动创建',
  };
  mockListColumns = [
    { title: '名称', key: 'name' },
    { title: '创建方式', slot: 'createWay' },
    { title: 'URL', slot: 'url' },
  ];
  constructor(
    private storageService: StorageService,
    private apiTest: ApiTestService,
    private remoteService: RemoteService
  ) {}

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    const { apiData } = changes;
    if (apiData.currentValue?.uuid) {
      const apiDataID = Number(this.apiData.uuid);
      console.log('apiDataID', this.apiData, apiDataID);
      const mockRes = await this.getMockByApiDataID(apiDataID);
      if (window.eo?.getMockUrl && Array.isArray(mockRes) && mockRes.length === 0) {
        const mock = this.createMockObj({ name: '系统默认期望', createType: 0 });
        const res = await this.createMock(mock);
        res.data.url = this.getApiUrl(res.data.uuid);
        this.mocklList = [res.data];
      } else {
        this.mocklList = mockRes.map((item) => {
          item.url = this.getApiUrl(item.uuid);
          return item;
        });
      }
    }
  }
  getApiUrl(uuid?: number) {
    const data = eoFormatRequestData(this.apiData, { env: {} }, 'en-US');
    const uri = this.apiTest.transferUrlAndQuery(data.URL, this.apiData.queryParams, {
      base: 'query',
      replaceType: 'replace',
    }).url;
    const url = new URL(`${this.mockUrl}/${uri}`.replace(/(?<!:)\/{2,}/g, '/'));
    uuid && url.searchParams.set('mockID', uuid + '');
    return decodeURIComponent(url.toString());
  }
  /**
   * get mock list
   *
   * @param apiDataID
   * @returns
   */
  getMockByApiDataID(apiDataID: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storageService.run('apiMockLoadAllByApiDataID', [apiDataID], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          resolve(result.data);
        } else {
          reject(result);
        }
      });
    });
  }

  /**
   * create mock
   * @param mock
   * @returns
   */
  createMock(mock): Promise<StorageRes> {
    return new Promise((resolve, reject) => {
      this.storageService.run('mockCreate', [mock], (res: StorageRes) => {
        if (res.status === StorageResStatus.success) {
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  }

  /**
   * create mock object data
   * @param options
   * @returns
   */
  createMockObj(options: Record<string, any> = {}) {
    const { name = '', createType = 1, ...rest } = options;
    return {
      name,
      url: this.getApiUrl(),
      apiDataID: this.apiData.uuid,
      projectID: 1,
      createType,
      response: JSON.stringify(tree2obj([].concat(this.apiData.responseBody))),
      ...rest,
    };
  }
}
