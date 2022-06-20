import { tree2obj } from './utils/tree/tree.utils';
import { Injectable } from '@angular/core';
import type { IpcRenderer } from 'electron';
import { ApiData, ApiMockEntity } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { IndexedDBStorage } from 'eo/workbench/browser/src/app/shared/services/storage/IndexedDB/lib/';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private ipcRenderer: IpcRenderer = window.require?.('electron')?.ipcRenderer;

  constructor(private indexedDBStorage: IndexedDBStorage) {
    if (this.ipcRenderer) {
      this.ipcRenderer.on('getMockApiList', async (event, req = {}) => {
        // console.log('wo接收到了哇', event, message);
        const { mockID } = req.query;
        if (Number.isInteger(Number(mockID))) {
          try {
            const mock = await this.getMockByMockID(Number(mockID));
            if (mock.createWay === 'system' && mock.apiDataID) {
              const apiData = await this.getApiData(Number(mock.apiDataID));
              mock.response =
                tree2obj([].concat(apiData.responseBody), { key: 'name', valueKey: 'description' }) || mock.response;
            }
            event.sender.send('getMockApiList', mock);
          } catch (error) {
            event.sender.send('getMockApiList', {
              response: {
                message: error,
              },
            });
          }
          // 是否开启了匹配请求方式
        } else if (window.eo?.getModuleSettings?.('eoapi-features.mock.matchType')) {
          const apiList = await this.getAllApi(1);
          const apiData = apiList.find((n) => n.method === req.method && n.uri.trim() === req.url);
          event.sender.send(
            'getMockApiList',
            apiData
              ? { response: tree2obj([].concat(apiData.responseBody), { key: 'name', valueKey: 'description' }) }
              : { statusCode: 404 }
          );
        } else {
          event.sender.send('getMockApiList', { response: { message: `没有找到ID为${mockID}的mock！` }, url: req.url });
        }
      });
    }
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
