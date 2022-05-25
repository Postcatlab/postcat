import { Injectable, Injector } from '@angular/core';
import { StorageResStatus } from './index.model';
import { IndexedDBStorage } from './IndexedDB/lib';
import { HttpStorage } from './http/lib';
/**
 * @description
 * A storage service
 */
@Injectable()
export class StorageService {
  instance;
  constructor(private injector: Injector) {
    console.log('StorageService init');
    this.setStorage('http');
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
  setStorage(type = 'local') {
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
  }
}
