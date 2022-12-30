import { Injectable, Injector } from '@angular/core';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

import { IndexedDBStorage } from './IndexedDB/lib';
import { HttpStorage } from './http/lib';
import { StorageResStatus } from './index.model';

/** is show local data source tips */
export const IS_SHOW_REMOTE_SERVER_NOTIFICATION = 'IS_SHOW_REMOTE_SERVER_NOTIFICATION';

/**
 * @description
 * A storage service
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private localInstance;
  private httpInstance;
  constructor(private injector: Injector, private store: StoreService, private indexedDBStorage: IndexedDBStorage) {
    this.localInstance = this.indexedDBStorage;
    this.httpInstance = this.injector.get(HttpStorage);
  }
  /**
   * Handle data from IndexedDB
   *
   * @param args
   */
  run(action: string, params: any[], callback): void {
    const handleResult = {
      status: StorageResStatus.invalid,
      data: undefined,
      error: null,
      callback
    };
    const instance = this.store.isLocal ? this.localInstance : this.httpInstance;
    // console.log('this.instance', instance, action);
    if (!instance[action]) {
      throw Error(`Lack request API: ${action}`);
    }
    instance[action](...params).subscribe(
      (res: any) => {
        handleResult.status = res.status;
        handleResult.data = res.data;
        handleResult.error = res.error;
        callback(handleResult);
      },
      (error: any) => {
        console.log('EOERROR:', action);
        handleResult.status = StorageResStatus.error;
        handleResult.error = error;
        callback(handleResult);
      }
    );
  }
}
