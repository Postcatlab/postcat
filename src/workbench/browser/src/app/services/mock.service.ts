import { Injectable } from '@angular/core';
import { SettingService } from 'eo/workbench/browser/src/app/modules/system-setting/settings.service';
import { IndexedDBStorage } from 'eo/workbench/browser/src/app/shared/services/storage/IndexedDB/lib';
import { ApiData, ApiMockEntity, StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { uniqueSlash } from 'eo/workbench/browser/src/app/utils/api';

import { ElectronService } from '../core/services';
import { tree2obj } from '../utils/tree/tree.utils';

const mockReg = /\/mock-(\d+)/;

@Injectable({ providedIn: 'root' })
export class MockService {
  constructor(
    private indexedDBStorage: IndexedDBStorage,
    private storageService: StorageService,
    private settingService: SettingService,
    private electron: ElectronService
  ) {}
  init() {
    if (this.electron.isElectron) {
      this.electron.ipcRenderer.on('getMockApiList', async (event, req: any = {}) => {
        const sender = event.sender;
        const isRemoteMock = mockReg.test(req.url);
        const { mockID } = req.query;

        if (isRemoteMock) {
          const [_, projectID] = req.url.match(mockReg);
          const url = this.settingService.getConfiguration('backend.url') || '';
          const response = await fetch(uniqueSlash(`${url}/mock/match`), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
              projectID,
              mockID,
              req: {
                ...req,
                url: req.url.replace(/^\/mock-\d+/, '')
              }
            })
          });

          const { data } = await response.json();
          return sender.send('getMockApiList', data);
        }

        if (!Number.isNaN(Number(mockID))) {
          try {
            const mock = await this.getMockByMockID(Number(mockID));
            if (mock === null) {
              return {
                statusCode: 404,
                response: {
                  message: `mockID为${mockID}的mock不存在`
                }
              };
            }
            const apiData = await this.getApiData(Number(mock.apiDataID));
            if (apiData === null) {
              return { statusCode: 404 };
            }
            if (mock?.createWay === 'system') {
              console.log('apiData.responseBody', apiData.responseBody);
              return sender.send('getMockApiList', this.matchApiData(apiData, req));
            } else {
              const result = await this.matchApiData(apiData, req);
              if (result.statusCode === 404) {
                return result;
              }
              mock.response ??= this.generateResponse(apiData.responseBody);
            }
            sender.send('getMockApiList', mock);
          } catch (error) {
            sender.send('getMockApiList', {
              response: {
                message: error
              }
            });
          }
          // Whether the matching request mode is enabled
        } else {
          const response = await this.batchMatchApiData(1, req);
          sender.send('getMockApiList', response);
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
  async matchApiData(apiData: ApiData, req?) {
    const { restParams, queryParams, method } = apiData;
    const { pathname } = new URL(req.url, 'http://localhost:3040');
    let uri = apiData.uri.trim();
    let isQueryMatch = true;
    if (Array.isArray(restParams) && restParams.length > 0) {
      const restMap = restParams.reduce((p, c) => ((p[c.name] = c.example), p), {});
      uri = uri.replace(/\{(.+?)\}/g, (match, p) => restMap[p] ?? match);
      console.log('restMap', restMap);
    }
    if (Array.isArray(queryParams) && queryParams.length > 0) {
      const query = req.query;
      isQueryMatch = queryParams.every(n => n.example === query[n.name]);
    }
    const uriReg = new RegExp(`^/?${uri}/?$`);
    const isMatch = method === req.method && uriReg.test(pathname) && isQueryMatch;
    return isMatch ? { response: this.generateResponse(apiData.responseBody) } : { statusCode: 404 };
  }

  async batchMatchApiData(projectID = 1, req) {
    const apiDatas = await this.getAllApi(projectID);
    let result;
    for (const api of apiDatas) {
      result = await this.matchApiData(api, req);
      if (result?.statusCode !== 404) {
        return result;
      }
    }
    return result;
  }

  /**
   * get mock by mockID
   *
   * @param mockID
   * @returns
   */
  getMockByMockID(mockID: number): Promise<ApiMockEntity> {
    return new Promise((resolve, reject) => {
      this.indexedDBStorage.mockLoad(mockID).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }
  /**
   * get api data
   *
   * @param apiDataID
   * @returns
   */
  getApiData(apiDataID: number, isRemoteMock = false): Promise<ApiData> {
    return new Promise((resolve, reject) => {
      this.indexedDBStorage.apiDataLoad(apiDataID).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (error: any) => {
          reject(error);
        }
      );
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
