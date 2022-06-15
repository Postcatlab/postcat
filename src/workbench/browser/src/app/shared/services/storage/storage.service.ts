import { Injectable, Injector } from '@angular/core';
import { StorageResStatus } from './index.model';
import { IndexedDBStorage } from './IndexedDB/lib';
import { HttpStorage } from './http/lib';
import { MessageService } from '../../../shared/services/message';

export type DataSourceType = 'local' | 'http';
export const DATA_SOURCE_TYPE_KEY = 'DATA_SOURCE_TYPE_KEY';

/**
 * @description
 * A storage service
 */
@Injectable()
export class StorageService {
  instance;
  dataSourceType: DataSourceType = (localStorage.getItem(DATA_SOURCE_TYPE_KEY) as DataSourceType) || 'local';
  constructor(private injector: Injector, private messageService: MessageService) {
    console.log('StorageService init');
    this.setStorage(this.dataSourceType);
  }
  /**
   * Handle data from IndexedDB
   *
   * @param args
   */
  run(action: string, params: Array<any>, callback): void {
    const handleResult = {
      status: StorageResStatus.invalid,
      data: undefined,
      callback: callback,
    };
    if (!this.instance[action]) {
      throw Error(`Lack request API: ${action}`);
    }
    this.instance[action](...params).subscribe(
      (res: any) => {
        handleResult.status = res.status;
        handleResult.data = res.data;
        callback(handleResult);
      },
      (error: any) => {
        console.log('error', error);
        handleResult.status = StorageResStatus.error;
        callback(handleResult);
      }
    );
  }
  setStorage(type: DataSourceType = 'local', options = {}) {
    switch (type) {
      case 'local': {
        this.instance = new IndexedDBStorage();
        break;
      }
      case 'http': {
        this.instance = this.injector.get(HttpStorage);
        break;
      }
    }
    console.log('instance', this.instance);
    localStorage.setItem(DATA_SOURCE_TYPE_KEY, type);
    this.messageService.send({
      type: 'onDataSourceChange',
      data: { ...options, dataSourceType: this.dataSourceType },
    });
  }
  toggleDataSource(options: any = {}) {
    const { dataSourceType } = options;
    this.dataSourceType = dataSourceType ?? (this.dataSourceType === 'http' ? 'local' : 'http');
    this.setStorage(this.dataSourceType, options);
    localStorage.setItem('IS_SHOW_REMOTE_SERVER_NOTIFICATION', this.dataSourceType === 'local' ? 'true' : 'false');
  }
}
