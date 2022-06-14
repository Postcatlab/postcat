import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  DataSourceType,
  DATA_SOURCE_TYPE_KEY,
} from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';

/**
 * @description
 * A message queue global send and get message
 */
@Injectable({
  providedIn: 'root',
})
export class RemoteService {
  /** data source type @type { DataSourceType }  */
  dataSourceType: DataSourceType = (localStorage.getItem(DATA_SOURCE_TYPE_KEY) as DataSourceType) || 'local';
  /** Is it a remote data source */
  get isRemote() {
    return this.dataSourceType === 'http';
  }
  /** Text corresponding to the current data source */
  get dataSourceText() {
    return this.isRemote ? '远程' : '本地';
  }
  private subject = new Subject<any>();

  constructor() {}

  /**
   * send message
   *
   * @param message
   */
  send(message: any): void {
    this.subject.next(message);
  }

  /**
   * get message
   *
   * @returns message mutation observer
   */
  get(): Observable<any> {
    return this.subject.asObservable();
  }

  /**
   * 测试远程服务器地址是否可用
   */
  async pingRmoteServerUrl() {
    const { url: remoteUrl, token } = window.eo.getModuleSettings('eoapi-common.remoteServer');

    const url = `${remoteUrl}/system/status`.replace(/(?<!:)\/{2,}/g, '/');
    const response = await fetch(url, {
      headers: {
        'x-api-key': token,
      },
    });
    const result = await response.json();

    if (result.statusCode !== 200) {
      return Promise.reject(result);
    }

    return result;
  }
}
