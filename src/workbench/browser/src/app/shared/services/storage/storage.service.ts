import { Injectable, Injector } from '@angular/core';
import { getSettings, SettingService } from 'eo/workbench/browser/src/app/modules/setting/settings.service';

import { IndexedDBStorage } from './IndexedDB/lib';
import { HttpStorage } from './http/lib';
import { StorageResStatus } from './index.model';
import { autorun } from 'mobx';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

export type DataSourceType = 'local' | 'http';
/** is show local data source tips */
export const IS_SHOW_REMOTE_SERVER_NOTIFICATION = 'IS_SHOW_REMOTE_SERVER_NOTIFICATION';

/**
 * @description
 * A storage service
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private instance;
  get dataSourceType(): DataSourceType {
    return getSettings()['eoapi-common.dataStorage'] || 'local';
  }
  constructor(private injector: Injector, private store: StoreService, private indexedDBStorage: IndexedDBStorage) {
    autorun(() => {
      this.instance = this.store.isLocal ? this.indexedDBStorage : this.injector.get(HttpStorage);
    });
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
    // console.log('this.instance', this.instance, action);
    if (!this.instance[action]) {
      throw Error(`Lack request API: ${action}`);
    }
    // console.log(new Error());
    this.instance[action](...params).subscribe(
      (res: any) => {
        handleResult.status = res.status;
        handleResult.data = res.data;
        handleResult.error = res.error;
        callback(handleResult);
      },
      (error: any) => {
        console.log('EOERROR:', action, error);
        handleResult.status = StorageResStatus.error;
        handleResult.error = error;
        callback(handleResult);
      }
    );
  }
}
