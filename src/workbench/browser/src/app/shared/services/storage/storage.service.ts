import { Injectable, Injector } from '@angular/core';
import { StorageResStatus } from './index.model';
import { IndexedDBStorage } from './IndexedDB/lib';
import { HttpStorage } from './http/lib';
import { MessageService } from '../../../shared/services/message';
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
  dataSourceType: DataSourceType = getSettings()['eoapi-common.dataStorage'] || 'local';
  constructor(
    private injector: Injector,
    private messageService: MessageService,
    private settingService: SettingService,
    private indexedDBStorage: IndexedDBStorage
  ) {
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
      callback,
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
        console.log('EOERROR:',action, error);
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
    this.messageService.send({
      type: 'onDataSourceChange',
      data: { ...options, dataSourceType: this.dataSourceType },
    });
  };
  toggleDataSource = (options: any = {}) => {
    const { dataSourceType } = options;
    this.dataSourceType = dataSourceType ?? (this.dataSourceType === 'http' ? 'local' : 'http');
    this.setStorage(this.dataSourceType, options);
  };
  setDataStorage(value) {
    this.settingService.putSettings({
      'eoapi-common.dataStorage': value,
    });
  }
}
