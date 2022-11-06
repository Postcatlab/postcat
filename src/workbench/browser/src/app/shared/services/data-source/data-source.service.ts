import { Injectable } from '@angular/core';
import { DataSourceType, StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import { ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { SettingService } from 'eo/workbench/browser/src/app/core/services/settings/settings.service';
import { UserService } from 'eo/workbench/browser/src/app/shared/services/user/user.service';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Message } from 'eo/workbench/browser/src/app/shared/services/message';
/** is show local data source tips */
export const IS_SHOW_REMOTE_SERVER_NOTIFICATION = 'IS_SHOW_REMOTE_SERVER_NOTIFICATION';
/**
 * @description
 * A message queue global send and get message
 */
@Injectable({
  providedIn: 'root',
})
export class DataSourceService {
  isConnectRemote = false;
  /** get mock url */
  get mockUrl() {
    return window.eo?.getMockUrl?.();
  }
  get remoteServerUrl() {
    return this.settingService.getConfiguration('eoapi-common.remoteServer.url');
  }

  constructor(
    private messageService: MessageService,
    private settingService: SettingService,
    private user: UserService,
    private storage: StorageService,
    private modal: NzModalService,
    private http: RemoteService,
    private web: WebService
  ) {
    this.pingCloudServerUrl();
    this.messageService.get().subscribe((inArg: Message) => {
      if (inArg.type === 'switchDataSource') {
        this.switchDataSource(inArg.data);
      }
    });
  }
  getApiUrl(apiData: ApiData) {
    const url = new URL(`${this.mockUrl}/${apiData.uri}`.replace(/(?<!:)\/{2,}/g, '/'), 'https://github.com/');
    if (apiData) {
      url.searchParams.set('mockID', apiData.uuid + '');
    }
    // console.log('getApiUrl', decodeURIComponent(url.toString()));
    return decodeURIComponent(url.toString());
  }

  /**
   * Test if cloud service address is available
   */
  async pingCloudServerUrl(inputUrl?): Promise<boolean> {
    const remoteUrl = inputUrl || this.remoteServerUrl;
    if (!remoteUrl) {
      return false;
    }
    const [, err]: any = await this.http.api_systemStatus({}, remoteUrl);
    if (err) {
      // ! TODO delete the retry
      const [, nErr]: any = await this.http.api_systemStatus({}, `${remoteUrl}/api`);
      if (nErr) {
        this.isConnectRemote = false;
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
          `<span>` +
          $localize`Store data on the cloud for team collaboration and product use across devices.` +
          `</span>` +
          `<a i18n href="https://docs.eoapi.io/docs/storage.html" target="_blank" class="eo_link">` +
          $localize`Learn more..` +
          `</a>`,
        nzOnOk: () => console.log('Info OK'),
        nzMaskClosable: true,
      });
      return;
    }
    if (this.web.isWeb) {
      if (!this.user.isLogin) {
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
  /**
   * switch data
   */
  switchDataSource = async (dataSource: DataSourceType) => {
    const isRemote = dataSource === 'http';
    if (isRemote) {
      localStorage.setItem(IS_SHOW_REMOTE_SERVER_NOTIFICATION, 'false');
    } else {
      localStorage.setItem(IS_SHOW_REMOTE_SERVER_NOTIFICATION, 'true');
    }
  };
}
