import { Injectable, Injector } from '@angular/core';
import { StorageHandleStatus } from './index.model';
import { IndexedDBStorage } from './IndexedDB/lib';
import { HttpStorage } from './http/lib';
import { isNotEmpty } from '../../../../../../../shared/common/common';
/**
 * @description
 * A storage service
 */
 @Injectable()
export class StorageService {
  instance;
  constructor(private injector: Injector) {
    console.log('StorageService init');
    // this.instance=new IndexedDBStorage();
    this.instance = this.injector.get(HttpStorage);
  }
  /**
   * Handle data from IndexedDB
   *
   * @param args
   */
  run(action: string, params: Array<any>, callback): void {
    const handleResult = {
      status: StorageHandleStatus.invalid,
      data: undefined,
      callback: callback,
    };
    this.instance[action](...params).subscribe(
      (result: any) => {
        console.log('success',action,result)
        handleResult.data = result;
        if (isNotEmpty(result)) {
          handleResult.status = StorageHandleStatus.success;
        } else {
          handleResult.status = StorageHandleStatus.empty;
        }
        callback(handleResult);
      },
      (error: any) => {
        console.log('error',error)
        handleResult.status = StorageHandleStatus.error;
        callback(handleResult);
      }
    );
  }
}
