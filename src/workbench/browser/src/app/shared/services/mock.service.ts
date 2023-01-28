import { Injectable } from '@angular/core';
import { RequestMethod } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { SettingService } from 'eo/workbench/browser/src/app/modules/system-setting/settings.service';
import { IndexedDBStorage } from 'eo/workbench/browser/src/app/shared/services/storage/IndexedDB/lib';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import type { ApiData, Mock } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { BodyParam } from 'eo/workbench/browser/src/app/shared/services/storage/db/models/apiData';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { uniqueSlash } from 'eo/workbench/browser/src/app/utils/api';
import { toJS } from 'mobx';

import { ElectronService } from '../../core/services';
import { tree2obj } from '../../utils/tree/tree.utils';

const mockReg = /\/mock-(\d+)/;

@Injectable({ providedIn: 'root' })
export class MockService {
  constructor(
    private indexedDBStorage: IndexedDBStorage,
    private store: StoreService,
    private settingService: SettingService,
    private electron: ElectronService,
    private apiServiece: ApiService
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
            const apiData = await this.getApiData(String(mock.apiUuid));
            if (apiData === null) {
              return { statusCode: 404 };
            }
            if (mock?.createWay === 'system') {
              // console.log('apiData.responseBody', apiData.responseBody);
              return sender.send('getMockApiList', this.matchApiData(apiData, req));
            } else {
              const result = await this.matchApiData(apiData, req);
              if (result.statusCode === 404) {
                return sender.send('getMockApiList', result);
              }
              mock.response ??= this.generateResponse(apiData.responseList?.[0].responseParams.bodyParams);
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
  generateResponse(responseBody: BodyParam[]) {
    console.log('responseBody', responseBody);
    return tree2obj([].concat(responseBody), { key: 'name', valueKey: 'paramAttr.example' });
  }
  /**
   * match apiData by method and url
   *
   * @param projectID
   * @param req
   * @returns
   */
  async matchApiData(apiData: ApiData, req?) {
    const { requestParams, responseList, apiAttrInfo } = apiData;
    const { restParams, queryParams } = requestParams || {};
    const { requestMethod } = apiAttrInfo || {};
    const bodyParams = responseList?.[0]?.responseParams?.bodyParams;
    const { pathname } = new URL(req.url, 'http://localhost:3040');
    let uri = apiData.uri.trim();
    let isQueryMatch = true;
    // if (Array.isArray(restParams) && restParams.length > 0) {
    //   const restMap = restParams.reduce((p, c) => ((p[c.name] = c.paramAttr.example), p), {});
    //   uri = uri.replace(/\{(.+?)\}/g, (match, p) => restMap[p] ?? match);
    //   console.log('restMap', restMap);
    // }
    if (Array.isArray(queryParams) && queryParams.length > 0) {
      const query = req.query;
      isQueryMatch = queryParams.every(n => n.paramAttr.example === query[n.name]);
    }
    const uriReg = new RegExp(`^/?${uri}/?$`);
    // @ts-ignore
    const isMatch = requestMethod === RequestMethod[req.method] && uriReg.test(decodeURIComponent(pathname)) && isQueryMatch;
    return isMatch ? { response: this.generateResponse(bodyParams) } : { statusCode: 404 };
  }

  async batchMatchApiData(projectID = 1, req) {
    const apiDatas = toJS(this.store.getApiList);
    let result;
    console.log('req', req);
    console.log('apiDatas', apiDatas);
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
  async getMockByMockID(mockID: number): Promise<Mock> {
    const [mock] = await this.apiServiece.api_mockDetail({ id: mockID });
    return mock;
  }
  /**
   * get api data
   *
   * @param apiDataID
   * @returns
   */
  async getApiData(apiUuid: string, isRemoteMock = false): Promise<ApiData> {
    const [apiList] = await this.apiServiece.api_apiDataDetail({ apiUuids: [apiUuid] });
    return apiList?.[0];
    // return new Promise((resolve, reject) => {
    //   this.indexedDBStorage.apiDataLoad().subscribe(
    //     (res: any) => {
    //       resolve(res.data);
    //     },
    //     (error: any) => {
    //       reject(error);
    //     }
    //   );
    // });
  }
}
