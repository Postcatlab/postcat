import { tree2obj } from './utils/tree/tree.utils';
import { Injectable } from '@angular/core';
import type { IpcRenderer } from 'electron';
import {
  ApiData,
  ApiMockEntity,
  StorageRes,
  StorageResStatus,
} from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';

@Injectable()
export class AppService {
  private ipcRenderer: IpcRenderer = window.require?.('electron')?.ipcRenderer;

  constructor(private storageService: StorageService) {}

  init() {
    if (this.ipcRenderer) {
      this.ipcRenderer.on('getMockApiList', async (event, req = {}) => {
        const sender = event.sender;
        const isEnabledMatchType = window.eo?.getExtensionSettings?.('eoapi-features.mock.matchType') !== false;
        const { mockID } = req.params;
        if (Number.isInteger(Number(mockID))) {
          try {
            const mock = await this.getMockByMockID(Number(mockID));
            const apiData = await this.getApiData(Number(mock.apiDataID));
            if (mock?.createWay === 'system' && isEnabledMatchType) {
              console.log('apiData.responseBody', apiData.responseBody);
              return sender.send('getMockApiList', this.matchApiData(apiData));
            } else {
              mock.response = mock?.response ?? this.generateResponse(apiData.responseBody);
            }
            sender.send('getMockApiList', mock);
          } catch (error) {
            sender.send('getMockApiList', {
              response: {
                message: error,
              },
            });
          }
          // Whether the matching request mode is enabled
        } else if (isEnabledMatchType) {
          const response = await this.matchApiData(1, req);
          sender.send('getMockApiList', response);
        } else {
          sender.send('getMockApiList', {
            response: { message: $localize`No mock found with ID ${mockID}` },
            url: req.url,
          });
        }
      });
    }
  }

  /**
   * generate response data
   *
   * @returns
   */
  generateResponse(responseBody: ApiData['responseBody']) {
    return tree2obj([].concat(responseBody), { key: 'name', valueKey: 'description' });
  }
  /**
   * match apiData by method and url
   *
   * @param projectID
   * @param req
   * @returns
   */
  async matchApiData(apiData, req?) {
    // const { restParams, method } = apiData;
    // const { pathname } = new URL(req.params[0], this.dataSource.mockUrl);
    // let uri = apiData.uri.trim();
    // if (Array.isArray(restParams) && restParams.length > 0) {
    //   const restMap = restParams.reduce((p, c) => ((p[c.name] = c.example), p), {});
    //   uri = uri.replace(/\{(.+?)\}/g, (match, p) => restMap[p] ?? match);
    //   console.log('restMap', restMap);
    // }
    // const uriReg = new RegExp(`^/?${uri}/?$`);
    // const isMatch = method === req.method && uriReg.test(pathname);
    return apiData ? { response: this.generateResponse(apiData.responseBody) } : { statusCode: 404 };
  }

  /**
   * get mock by mockID
   *
   * @param mockID
   * @returns
   */
  getMockByMockID(mockID: number): Promise<ApiMockEntity> {
    return new Promise((resolve, reject) => {
      this.storageService.run('mockLoad', [mockID], async (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          return resolve(result.data);
        }
        return reject(result);
      });
    });
  }
  /**
   * get api data
   *
   * @param apiDataID
   * @returns
   */
  getApiData(apiDataID: number): Promise<ApiData> {
    return new Promise((resolve, reject) => {
      this.storageService.run('apiDataLoad', [apiDataID], async (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          return resolve(result.data);
        }
        return reject(result);
      });
    });
  }
  /**
   * get all api
   */
  getAllApi(projectID = 1): Promise<ApiData[]> {
    return new Promise((resolve, reject) => {
      this.storageService.run('apiDataLoadAllByProjectID', [projectID], async (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          return resolve(result.data);
        }
        return reject(result);
      });
    });
  }
}
