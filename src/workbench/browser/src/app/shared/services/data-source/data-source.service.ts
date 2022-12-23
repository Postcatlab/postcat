import { Injectable } from '@angular/core';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { SettingService } from 'eo/workbench/browser/src/app/modules/system-setting/settings.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { compareVersion } from 'eo/workbench/browser/src/app/utils/index.utils';
import { NzModalService } from 'ng-zorro-antd/modal';

import StorageUtil from '../../../utils/storage/Storage';

const minFontendVersion = '2.0.0';
/**
 * @description
 * A message queue global send and get message
 */
@Injectable({
  providedIn: 'root'
})
export class DataSourceService {
  isConnectRemote = false;
  lowLevelTipsHasShow = false;
  get remoteServerUrl() {
    return this.settingService.getConfiguration('backend.url');
  }

  constructor(
    private messageService: MessageService,
    private settingService: SettingService,
    private store: StoreService,
    private modal: NzModalService,
    private http: RemoteService,
    private web: WebService
  ) {
    this.pingCloudServerUrl();
  }

  /**
   * Test if cloud service address is available
   */
  async pingCloudServerUrl(inputUrl?): Promise<boolean> {
    const remoteUrl = inputUrl || this.remoteServerUrl;
    if (!remoteUrl) {
      return false;
    }
    const [data, err]: any = await this.http.api_systemStatus({}, `${remoteUrl}/api`);
    if (err) {
      this.isConnectRemote = false;
      return false;
    } else {
      StorageUtil.set('server_version', data);
      if (!this.lowLevelTipsHasShow && compareVersion(data, minFontendVersion) < 0) {
        if (this.store.isLocal) return;
        this.lowLevelTipsHasShow = true;
        this.modal.warning({
          nzTitle: $localize`The version of the cloud service is too low`,
          nzContent: $localize`Please update the local version to the latest version,<a i18n href="https://docs.eoapi.io/docs/storage.html#%E6%9C%8D%E5%8A%A1%E5%8D%87%E7%BA%A7" target="_blank" class="eo-link">${$localize`Learn more..`}</a>`
        });
        return false;
      }
    }
    this.isConnectRemote = true;
    return this.isConnectRemote;
  }

  async checkRemoteAndTipModal() {
    const isSuccess = await this.pingCloudServerUrl();
    if (!isSuccess) {
      this.messageService.send({ type: 'ping-fail', data: {} });
      return;
    }
    // this.messageService.send({ type: 'ping-success', data: {} });
  }

  async checkRemoteCanOperate(canOperateCallback?, isLocalSpace = false) {
    if (this.web.isVercel) {
      this.modal.info({
        nzTitle: $localize`Need to deploy cloud services`,
        nzContent:
          `<span>${$localize`Store data on the cloud for team collaboration and product use across devices.`}</span>` +
          `<a i18n href="https://docs.eoapi.io/docs/storage.html" target="_blank" class="eo-link">${$localize`Learn more..`}</a>`,
        nzOnOk: () => console.log('Info OK'),
        nzMaskClosable: true
      });
      return;
    }
    if (this.web.isWeb) {
      if (!this.store.isLogin) {
        this.messageService.send({ type: 'login', data: {} });
        return;
      }
      canOperateCallback?.();
      return;
    }
    if (this.remoteServerUrl) {
      const isSuccess = await this.pingCloudServerUrl();
      // 3.1 如果ping成功，则应该去登陆
      if (isSuccess) {
        if (!this.store.isLogin) {
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
    const filterKeys = keys.filter(n => n.startsWith(keyPath));
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
}
