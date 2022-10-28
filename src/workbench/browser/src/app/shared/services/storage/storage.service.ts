import { Injectable, Injector } from '@angular/core';
import { StorageResStatus } from './index.model';
import { IndexedDBStorage } from './IndexedDB/lib';
import { HttpStorage } from './http/lib';
import { getSettings, SettingService } from 'eo/workbench/browser/src/app/core/services/settings/settings.service';

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
  constructor(
    private injector: Injector,
    private settingService: SettingService,
    private indexedDBStorage: IndexedDBStorage
  ) {
    console.log('StorageService init');
    this.setStorage( this.dataSourceType);
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
      callback,
    };
    // console.log('this.instance', this.instance, action);
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
        console.log('EOERROR:', action, error);
        handleResult.status = StorageResStatus.error;
        callback(handleResult);
      }
    );
  }
  setStorage = (type: DataSourceType = 'local', options = {}) => {
    switch (type) {
      case 'local': {
        this.instance = this.indexedDBStorage;
        break;
      }
      case 'http': {
        this.instance = this.injector.get(HttpStorage);
        break;
      }
    }

    this.setDataStorage(type);
  };
  toggleDataSource = (options: any = {}) => {
    const { dataSourceType } = options;
    this.setStorage(dataSourceType ?? (this.dataSourceType === 'http' ? 'local' : 'http'), options);
  };
  setDataStorage(value) {
    this.settingService.putSettings({
      'eoapi-common.dataStorage': value,
    });
  }
}
