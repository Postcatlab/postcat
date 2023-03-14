import { Injectable } from '@angular/core';
import { toJS } from 'mobx';
import { SettingService } from 'pc/browser/src/app/components/system-setting/settings.service';
import { RequestMethod } from 'pc/browser/src/app/pages/workspace/project/api/api.model';
import { uniqueSlash } from 'pc/browser/src/app/pages/workspace/project/api/utils/api.utils';
import { ApiService } from 'pc/browser/src/app/services/storage/api.service';
import type { ApiData, Mock } from 'pc/browser/src/app/services/storage/db/models';
import { BodyParam } from 'pc/browser/src/app/services/storage/db/models/apiData';

import { ElectronService } from '../core/services';
import { ApiStoreService } from '../pages/workspace/project/api/store/api-state.service';
import { tree2obj } from '../shared/utils/tree/tree.utils';

const mockReg = /\/mock-(\d+)/;

@Injectable({ providedIn: 'root' })
export class MockService {
  constructor(
    private store: ApiStoreService,
    private settingService: SettingService,
    private electron: ElectronService,
    private apiServiece: ApiService
  ) {}
  init() {
    if (this.electron.isElectron) {
      this.electron.ipcRenderer.on('getMockApiList', async (event, req: any = {}) => {
        const sender = event.sender;
        // this.isRemoteMock = mockReg.test(req.url);
        const { mockID } = req.query;
        const replyMsg = data => sender.send('getMockApiList', data);

        // if (isRemoteMock) {
        //   const [_, projectID] = req.url.match(mockReg);
        //   const url = this.settingService.getConfiguration('backend.url') || '';
        //   const response = await fetch(uniqueSlash(`${url}/mock/match`), {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json'
        //       // 'Content-Type': 'application/x-www-form-urlencoded',
        //     },
        //     body: JSON.stringify({
        //       projectID,
        //       mockID,
        //       req: {
        //         ...req,
        //         url: req.url.replace(/^\/mock-\d+/, '')
        //       }
        //     })
        //   });

        //   const { data } = await response.json();
        //   return sender.send('getMockApiList', data);
        // }

        if (!Number.isNaN(Number(mockID))) {
          try {
            const mock = await this.getMockByMockID(Number(mockID));
            if (mock === null) {
              return replyMsg({
                statusCode: 404,
                response: {
                  message: `mockID为${mockID}的mock不存在`
                }
              });
            }
            const apiData = await this.getApiData(String(mock.apiUuid));
            if (apiData === null) {
              return replyMsg({ statusCode: 404 });
            }
            if (mock?.createWay === 'system') {
              // console.log('apiData.responseBody', apiData.responseBody);
              return replyMsg(await this.matchApiData(apiData, req));
            } else {
              const result = await this.matchApiData(apiData, req);
              if (result.statusCode === 404) {
                return replyMsg(result);
              }
              mock.response ??= this.generateResponse(apiData.responseList?.[0]?.responseParams.bodyParams);
            }
            replyMsg(mock);
          } catch (error) {
            replyMsg({
              response: {
                message: error
              }
            });
          }
          // Whether the matching request mode is enabled
        } else {
          const response = await this.batchMatchApiData(1, req);
          replyMsg(response);
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
    const { requestMethod, apiUuid } = apiData;
    const { pathname } = new URL(req.url, 'http://localhost:3040');

    let uri = apiData.uri.trim().replace(/\{(.+?)\}/g, (match, p) => '[^/]+');
    let isQueryMatch = true;

    // if (Array.isArray(queryParams) && queryParams.length > 0) {
    //   const query = req.query;
    //   isQueryMatch = queryParams.filter(n => n.isRequired).every(n => Reflect.has(query, n.name));
    // }
    const uriReg = new RegExp(`^/?${uri}/?$`);
    // @ts-ignore
    const isMatch = requestMethod === RequestMethod[req.method] && uriReg.test(decodeURIComponent(pathname)) && isQueryMatch;

    if (isMatch) {
      const [apiDatas] = await this.apiServiece.api_apiDataDetail({ withParams: 1, apiUuids: [apiUuid] });
      const { responseList } = apiDatas.at(0);

      const bodyParams = responseList?.[0]?.responseParams?.bodyParams;

      return { response: this.generateResponse(bodyParams) };
    } else {
      return { statusCode: 404 };
    }
  }

  async batchMatchApiData(projectID = 1, req, page = 1) {
    const pageSize = 200;
    const [data] = await this.apiServiece.api_apiDataList({ page, pageSize, statuses: [0] });
    let result;
    for (const api of data.items) {
      result = await this.matchApiData(api, req);
      if (result?.statusCode !== 404) {
        return result;
      }
    }
    if (data.paginator?.total > page * pageSize && result?.statusCode === 404) {
      return this.batchMatchApiData(projectID, req, page + 1);
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
    const [apiList] = await this.apiServiece.api_apiDataDetail({ withParams: 1, apiUuids: [apiUuid] });
    const apiData = apiList?.[0];
    apiData.requestMethod = apiData.apiAttrInfo?.requestMethod;
    return apiData;
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
