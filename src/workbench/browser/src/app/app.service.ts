import { Injectable } from '@angular/core';
import type { IpcRenderer } from 'electron';
import {
  ApiData,
  ApiMockEntity,
  StorageRes,
  StorageResStatus,
} from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { StorageService } from './shared/services/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private ipcRenderer: IpcRenderer = window.require?.('electron')?.ipcRenderer;

  constructor(private storageService: StorageService) {
    if (this.ipcRenderer) {
      this.ipcRenderer.on('getMockApiList', async (event, req = {}) => {
        // console.log('接收到了哇', event, message);
        const { mockID } = req.query;
        if (Number.isInteger(Number(mockID))) {
          try {
            const mock = await this.getMockByMockID(Number(mockID));
            if (mock.isDefault && mock.apiDataID) {
              const apiData = await this.getApiData(Number(mock.apiDataID));
              mock.response = (apiData.responseBody as string) || mock.response;
            }
            event.sender.send('getMockApiList', mock);
          } catch (error) {
            event.sender.send('getMockApiList', error);
          }
        } else {
          event.sender.send('getMockApiList', { message: `没有找到ID为${mockID}的mock！`, url: req.url });
        }
      });
    }
  }
  /**
   * get mock by mockID
   * @param mockID
   * @returns
   */
  getMockByMockID(mockID: number): Promise<ApiMockEntity> {
    return new Promise((resolve, reject) => {
      this.storageService.run('mockLoad', [mockID], (res: StorageRes) => {
        if (res.status === StorageResStatus.success) {
          resolve(res.data);
        } else {
          reject(res);
        }
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
      this.storageService.run('apiDataLoad', [apiDataID], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          resolve(result.data);
        } else {
          reject(result);
        }
      });
    });
  }
}
