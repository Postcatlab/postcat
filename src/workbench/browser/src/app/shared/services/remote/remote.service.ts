import { Injectable } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DataSourceType, StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import { Message } from 'eo/workbench/browser/src/app/shared/services/message/message.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services/electron/electron.service';
import { SettingService } from 'eo/workbench/browser/src/app/core/services/settings/settings.service';

/** is show switch success tips */
export const IS_SHOW_DATA_SOURCE_TIP = 'IS_SHOW_DATA_SOURCE_TIP';

/**
 * @description
 * A message queue global send and get message
 */
@Injectable({
  providedIn: 'root',
})
export class RemoteService {
  private destroy$: Subject<void> = new Subject<void>();
  /** data source type @type { DataSourceType }  */
  get dataSourceType(): DataSourceType {
    return this.settingService.settings['eoapi-common.dataStorage'] ?? 'local';
  }
  get isElectron() {
    return this.electronService.isElectron;
  }
  /** Is it a remote data source */
  get isRemote() {
    return this.dataSourceType === 'http';
  }
  /** Text corresponding to the current data source */
  get dataSourceText() {
    return this.isRemote ? $localize`:@@Remote Server:Remote Server` : $localize`Localhost`;
  }
  /** get mock url */
  get mockUrl() {
    return this.isRemote
      ? window.eo?.getModuleSettings?.('eoapi-common.remoteServer.url') + '/mock/eo-1/'
      : window.eo?.getMockUrl?.();
  }

  constructor(
    private storageService: StorageService,
    private messageService: MessageService,
    private message: NzMessageService,
    private electronService: ElectronService,
    private settingService: SettingService,
    private router: Router
  ) {
    this.messageService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((inArg: Message) => {
        switch (inArg.type) {
          case 'onDataSourceChange': {
            if (localStorage.getItem(IS_SHOW_DATA_SOURCE_TIP) === 'true') {
              this.showMessage();
            }
            break;
          }
        }
      });
  }

  getApiUrl(apiData: ApiData) {
    const url = new URL(`${this.mockUrl}/${apiData.uri}`.replace(/(?<!:)\/{2,}/g, '/'), 'https://github.com/');
    if (apiData) {
      url.searchParams.set('mockID', apiData.uuid + '');
    }
    console.log('getApiUrl', decodeURIComponent(url.toString()));
    return decodeURIComponent(url.toString());
  }

  async refreshComponent() {
    const { pathname, searchParams } = new URL(this.router.url, 'https://github.com/');
    // console.log('this.router', pathname, Object.fromEntries(searchParams.entries()));
    await this.router.navigate(['**']);
    await this.router.navigate([pathname], { queryParams: Object.fromEntries(searchParams.entries()) });
  }

  /**
   * Test if remote server address is available
   */
  async pingRmoteServerUrl(): Promise<[boolean, any]> {
    const { url: remoteUrl, token } = this.settingService.getConfiguration('eoapi-common.remoteServer') || {};

    if (!remoteUrl) {
      return [false, remoteUrl];
    }

    const url = `${remoteUrl}/system/status`.replace(/(?<!:)\/{2,}/g, '/');

    let result;
    try {
      const response = await fetch(url, {
        headers: {
          'x-api-key': token,
        },
      });
      result = await response.json();
      if (result.statusCode !== 200) {
        return [false, result];
      }
    } catch (e) {
      return [false, e];
    }
    return [true, result];
  }

  switchToLocal() {
    this.storageService.toggleDataSource({ dataSourceType: 'local' });
  }

  switchToHttp() {
    this.storageService.toggleDataSource({ dataSourceType: 'http' });
  }

  getSettings() {
    try {
      return JSON.parse(localStorage.getItem('localSettings') || '{}');
    } catch (error) {
      return {};
    }
  }

  /**
   * Get the value of the corresponding configuration according to the key path
   *
   * @param key
   * @returns
   */
  getConfiguration = (keyPath: string) => {
    const localSettings = this.getSettings();
    if (Reflect.has(localSettings, keyPath)) {
      return Reflect.get(localSettings, keyPath);
    }

    const keys = Object.keys(localSettings);
    const filterKeys = keys.filter((n) => n.startsWith(keyPath));
    if (filterKeys.length) {
      return filterKeys.reduce((pb, ck) => {
        const keyArr = ck.replace(`${keyPath}.`, '').split('.');
        const targetKey = keyArr.pop();
        const target = keyArr.reduce((p, v) => {
          p[v] ??= {};
          return p[v];
        }, pb);
        target[targetKey] = localSettings[ck];
        return pb;
      }, {});
    }
    return undefined;
  };

  /**
   * switch data
   */
  switchDataSource = async (dataSource: DataSourceType) => {
    const isRemote = dataSource === 'http';
    if (isRemote) {
      const [isSuccess] = await this.pingRmoteServerUrl();
      if (isSuccess) {
        localStorage.setItem(IS_SHOW_DATA_SOURCE_TIP, 'true');
        this.switchToHttp();
        this.refreshComponent();
      } else {
        this.message.create('error', $localize`Remote data source not available`);
        localStorage.setItem(IS_SHOW_DATA_SOURCE_TIP, 'false');
      }
    } else {
      localStorage.setItem(IS_SHOW_DATA_SOURCE_TIP, 'true');
      this.switchToLocal();
      this.refreshComponent();
    }
  };

  showMessage() {
    this.message.create('success', $localize`successfully switched to ${this.dataSourceText} data source`);
    localStorage.setItem('IS_SHOW_DATA_SOURCE_TIP', 'false');
  }
}
