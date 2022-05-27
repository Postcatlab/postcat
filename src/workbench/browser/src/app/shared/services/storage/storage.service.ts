import { Injectable, Injector } from '@angular/core';
import { StorageResStatus } from './index.model';
import { IndexedDBStorage } from './IndexedDB/lib';
import { HttpStorage } from './http/lib';
import { MessageService } from '../../../shared/services/message';

export type DataSourceType = 'local' | 'http';

/**
 * @description
 * A storage service
 */
@Injectable()
export class StorageService {
  instance;
  dataSourceType: DataSourceType = 'http';
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
    this.instance[action](...params).subscribe(
      (res: any) => {
        console.log('res', res, handleResult);
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
    this.messageService.send({ type: 'onDataSourceChange', data: { ...options, dataSourceType: this.dataSourceType } });
  }
  toggleDataSource(options = {}) {
    this.dataSourceType = this.dataSourceType === 'http' ? 'local' : 'http';
    this.setStorage(this.dataSourceType, options);
    console.log('this.dataSourceType', this.dataSourceType);
    console.log('this.instance', this.instance);
  }
}
