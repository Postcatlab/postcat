import { Injectable, Injector } from '@angular/core';
import { StorageResStatus } from './index.model';
import { IndexedDBStorage } from './IndexedDB/lib';
import { HttpStorage } from './http/lib';
import { SettingService } from 'eo/workbench/browser/src/app/core/services/settings/settings.service';
import { Message, MessageService } from 'eo/workbench/browser/src/app/shared/services/message';

export type DataSourceType = 'local' | 'http';

/**
 * @description
 * A storage service
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private instance;
  dataSourceType: DataSourceType;
  constructor(
    private injector: Injector,
    private settingService: SettingService,
    private indexedDBStorage: IndexedDBStorage,
    private message: MessageService
  ) {
    this.message.get().subscribe((inArg: Message) => {
      if (inArg.type === 'switchDataSource') {
        this.setStorage(inArg.data);
      }
    });
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

  private toggleDataSource = (options: any = {}) => {
    const { dataSourceType } = options;
    this.setStorage(dataSourceType ?? (this.dataSourceType === 'http' ? 'local' : 'http'), options);
  };
  setDataStorage(value) {
    this.settingService.putSettings({
      'eoapi-common.dataStorage': value,
    });
  }
}
