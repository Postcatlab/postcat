import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DataSourceType, StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service';
import { Router } from '@angular/router';
import { ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { SettingService } from 'eo/workbench/browser/src/app/core/services/settings/settings.service';
import { UserService } from 'eo/workbench/browser/src/app/shared/services/user/user.service';

/** is show switch success tips */
export const IS_SHOW_DATA_SOURCE_TIP = 'IS_SHOW_DATA_SOURCE_TIP';

/**
 * @description
 * A message queue global send and get message
 */
@Injectable({
  providedIn: 'root',
})
export class DataSourceService {
  isConnectRemote = false;
  private destroy$: Subject<void> = new Subject<void>();
  /** data source type @type { DataSourceType }  */
  get dataSourceType(): DataSourceType {
    return this.settingService.settings['eoapi-common.dataStorage'] ?? 'local';
  }
  /** Is it a remote data source */
  get isRemote() {
    return this.dataSourceType === 'http';
  }
  /** get mock url */
  get mockUrl() {
    return window.eo?.getMockUrl?.();
  }
  get remoteServerUrl() {
    return this.settingService.getConfiguration('eoapi-common.remoteServer.url');
  }

  constructor(
    private storageService: StorageService,
    private messageService: MessageService,
    private message: EoMessageService,
    private settingService: SettingService,
    private router: Router,
    private user: UserService
  ) {
    this.pingCloudServerUrl();
  }

  getApiUrl(apiData: ApiData) {
    const url = new URL(`${this.mockUrl}/${apiData.uri}`.replace(/(?<!:)\/{2,}/g, '/'), 'https://github.com/');
    if (apiData) {
      url.searchParams.set('mockID', apiData.uuid + '');
    }
    // console.log('getApiUrl', decodeURIComponent(url.toString()));
    return decodeURIComponent(url.toString());
  }

  async refreshComponent() {
    const { pathname, searchParams } = new URL(this.router.url, 'https://github.com/');
    // console.log('this.router', pathname, Object.fromEntries(searchParams.entries()));
    await this.router.navigate(['**']);
    await this.router.navigate([pathname], { queryParams: Object.fromEntries(searchParams.entries()) });
  }
  /**
   * Test if cloud service address is available
   */
  async pingCloudServerUrl(inputUrl?): Promise<[boolean, any]> {
    const remoteUrl = inputUrl || this.remoteServerUrl;
    let result;
    if (!remoteUrl) {
      result = [false, remoteUrl];
    }

    const url = `${remoteUrl}/system/status`.replace(/(?<!:)\/{2,}/g, '/');

    let res;
    try {
      const response = await fetch(url);
      res = await response.json();
      if (res.statusCode !== 200) {
        result = [false, res];
      } else {
        result = [true, res];
      }
    } catch (e) {
      result = [false, e];
    }
    this.isConnectRemote = result[0];
    return result;
  }

  async checkRemoteAndTipModal() {
    const [isSuccess] = await this.pingCloudServerUrl();
    if (!isSuccess) {
      this.messageService.send({ type: 'ping-fail', data: {} });
      return;
    }
    this.messageService.send({ type: 'ping-success', data: {} });
  }

  async checkRemoteCanOperate(canOperateCallback?, isLocalSpace = false) {
    if (this.remoteServerUrl) {
      const [isSuccess] = await this.pingCloudServerUrl();
      // 3.1 如果ping成功，则应该去登陆
      if (isSuccess) {
        if (!this.user.isLogin) {
          !isLocalSpace && this.messageService.send({ type: 'login', data: {} });
        } else {
          canOperateCallback?.();
        }
        // 3.2 如果ping不成功，则应该重试
      } else {
        this.messageService.send({ type: 'retry', data: {} });
      }
      // 2.2 如果没有配置远程地址，则去配置
    } else {
      this.messageService.send({ type: 'need-config-remote', data: {} });
    }
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
  switchDataSource = async (dataSource: DataSourceType, beforRefreshCompFn = () => {}) => {
    const isRemote = dataSource === 'http';
    if (isRemote) {
      const [isSuccess] = await this.pingCloudServerUrl();
      if (isSuccess) {
        this.switchToHttp();
        localStorage.setItem(IS_SHOW_DATA_SOURCE_TIP, 'false');
        await beforRefreshCompFn?.();
        this.refreshComponent();
      } else {
        this.message.error($localize`Cloud Storage not available`);
        localStorage.setItem(IS_SHOW_DATA_SOURCE_TIP, 'true');
      }
    } else {
      this.switchToLocal();
      localStorage.setItem(IS_SHOW_DATA_SOURCE_TIP, 'true');
      await beforRefreshCompFn?.();
      this.refreshComponent();
    }
  };

  connectCloudSuccess() {
    this.message.success($localize`Successfully connect to cloud`);
    localStorage.setItem('IS_SHOW_DATA_SOURCE_TIP', 'false');
  }
}
