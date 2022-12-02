import { Injectable } from '@angular/core';
import { formatUri } from 'eo/workbench/browser/src/app/pages/api/service/api-test/api-test.utils';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';
import {
  ApiMockEntity,
  StorageRes,
  StorageResStatus,
} from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { transferUrlAndQuery } from 'eo/workbench/browser/src/app/utils/api';
import { tree2obj } from 'eo/workbench/browser/src/app/utils/tree/tree.utils';

@Injectable()
export class ApiMockService {
  constructor(
    private storageService: StorageService,
    private dataSource: DataSourceService,
    private effect: EffectService,
    private store: StoreService
  ) {
    console.log('init api mock service');
  }
  getMockPrefix(apiData) {
    const mockUrl = this.store.isLocal
      ? this.dataSource.mockUrl
      : `${this.dataSource.mockUrl}/mock-${this.store.getCurrentProjectID}`;
    const uri = transferUrlAndQuery(formatUri(apiData.uri, apiData.restParams), apiData.queryParams, {
      base: 'query',
      replaceType: 'replace',
    }).url;
    return `${mockUrl}/${uri}`;
  }

  /**
   * get mock list
   *
   * @param apiDataID
   * @returns
   */
  getMocks(apiDataID: number): Promise<any> {
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
   *
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
   * update mock
   *
   * @param mock
   * @returns
   */
  updateMock(mock, uuid: number) {
    return new Promise((resolve, reject) => {
      this.storageService.run('mockUpdate', [mock, uuid], (res: StorageRes) => {
        if (res.status === StorageResStatus.success) {
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  }
  deleteMock(uuid: number) {
    return new Promise((resolve, reject) => {
      this.storageService.run('mockRemove', [uuid], (res: StorageRes) => {
        if (res.status === StorageResStatus.success) {
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  }
  getMockResponseByAPI(apiData) {
    return JSON.stringify(tree2obj(apiData.responseBody));
  }
}
