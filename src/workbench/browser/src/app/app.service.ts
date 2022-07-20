import { tree2obj } from './utils/tree/tree.utils';
import { Injectable } from '@angular/core';
import type { IpcRenderer } from 'electron';
import { ApiData, ApiMockEntity } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { IndexedDBStorage } from 'eo/workbench/browser/src/app/shared/services/storage/IndexedDB/lib/';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/remote/remote.service';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private ipcRenderer: IpcRenderer = window.require?.('electron')?.ipcRenderer;

  constructor(private indexedDBStorage: IndexedDBStorage, private remoteService: RemoteService) {
    if (this.ipcRenderer) {
      this.ipcRenderer.on('getMockApiList', async (event, req = {}) => {
        const sender = event.sender;
        console.log('req', req);
        const isEnabledMatchType = window.eo?.getModuleSettings?.('eoapi-features.mock.matchType') !== false;
        // console.log('wo接收到了哇', event, message);
        const { mockID } = req.query;
        if (Number.isInteger(Number(mockID))) {
          try {
            const mock = await this.getMockByMockID(Number(mockID));
            const apiData = await this.getApiData(Number(mock.apiDataID));
            if (!mock && isEnabledMatchType) {
              const result = await this.matchApiData(1, req);
              return sender.send('getMockApiList', result);
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
   * @returns
   */
  generateResponse(responseBody: ApiData['responseBody']) {
    return tree2obj([].concat(responseBody), { key: 'name', valueKey: 'description' });
  }
  /**
   * match apiData by method and url
   * @param {Number} projectID
   * @param {Object} req
   * @returns {Object}
   */
  async matchApiData(projectID = 1, req) {
    const apiList = await this.getAllApi(projectID);
    const { pathname } = new URL(req.url, this.remoteService.mockUrl);
    const apiData = apiList.find((n) => {
      let uri = n.uri.trim();
      if (Array.isArray(n.restParams) && n.restParams.length > 0) {
        const restMap = n.restParams.reduce((p, c) => ((p[c.name] = c.example), p), {});
        uri = uri.replace(/\{(.+?)\}/g, (match, p) => restMap[p] ?? match);
        // console.log('restMap', restMap, n.uri, uri);
      }
      const uriReg = new RegExp(`/?${uri}/?`);
      return n.method === req.method && uriReg.test(pathname);
    });
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
  getApiData(apiDataID: number): Promise<ApiData> {
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
      this.indexedDBStorage.apiDataLoadAllByProjectID(projectID).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }
}
