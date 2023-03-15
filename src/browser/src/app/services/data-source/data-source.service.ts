import { Injectable } from '@angular/core';
import { SettingService } from 'pc/browser/src/app/components/system-setting/settings.service';
import { WebService } from 'pc/browser/src/app/core/services';
import { MessageService } from 'pc/browser/src/app/services/message/message.service';
import { StoreService } from 'pc/browser/src/app/store/state.service';

/**
 * Client need min fontend version
 */
const minFontendVersion = '2.0.0';
/**
 * @description
 * A message queue global send and get message
 */
@Injectable({
  providedIn: 'root'
})
export class DataSourceService {
  lowLevelTipsHasShow = false;
  get remoteServerUrl() {
    return this.settingService.getConfiguration('backend.url');
  }

  constructor(
    private messageService: MessageService,
    private settingService: SettingService,
    private store: StoreService,
    private web: WebService
  ) {
    this.pingCloudServerUrl();
  }

  /**
   * Test if cloud service address is available
   */
  async pingCloudServerUrl(inputUrl?): Promise<boolean> {
    // const remoteUrl = inputUrl || this.remoteServerUrl;
    // if (!remoteUrl) {
    //   return false;
    // }
    // const [data, err]: any = await this.http.api_systemStatus({}, `${remoteUrl}/api`);
    // if (err) {
    //   return false;
    // } else {
    //   StorageUtil.set('server_version', data);
    //   if (!this.lowLevelTipsHasShow && compareVersion(data, minFontendVersion) < 0) {
    //     if (this.store.isLocal) return true;
    //     this.lowLevelTipsHasShow = true;
    //     this.modal.warning({
    //       nzTitle: $localize`The version of the cloud service is too low`,
    //       nzContent:
    //         $localize`Requires cloud service at least version ${minFontendVersion}.<br>` +
    //         $localize`Please update the local version to the latest version <a href="https://docs.postcat.com/docs/storage.html" target="_blank" >Learn more..</a>`
    //     });
    //     return true;
    //   }
    // }
    return true;
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
    // if (this.web.isVercel) {
    //   pcConsole.error(`Vercel can't operate remote data`);
    //   return;
    // }
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
