import { Injectable } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {
  DataSourceType,
  DATA_SOURCE_TYPE_KEY,
  StorageService,
} from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import { Message } from 'eo/workbench/browser/src/app/shared/services/message/message.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

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
  dataSourceType: DataSourceType = (localStorage.getItem(DATA_SOURCE_TYPE_KEY) as DataSourceType) || 'local';

  /** Is it a remote data source */
  get isRemote() {
    return this.dataSourceType === 'http';
  }
  /** Text corresponding to the current data source */
  get dataSourceText() {
    return this.isRemote ? '远程' : '本地';
  }

  constructor(
    private storageService: StorageService,
    private messageService: MessageService,
    private message: NzMessageService,
    private router: Router
  ) {
    this.messageService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((inArg: Message) => {
        switch (inArg.type) {
          case 'onDataSourceChange': {
            setTimeout(() => {
              this.dataSourceType = inArg.data.dataSourceType;
            });
            if (localStorage.getItem(IS_SHOW_DATA_SOURCE_TIP) === 'true') {
              setTimeout(() => {
                requestIdleCallback(() => this.showMessage());
              }, 1200);
            }
            break;
          }
        }
      });
  }

  refreshComponent() {
    this.router.navigate(['home/blank']).then(() => {
      this.router.navigate(['home']);
    });
  }

  /**
   * 测试远程服务器地址是否可用
   */
  async pingRmoteServerUrl(): Promise<[boolean, any]> {
    const { url: remoteUrl, token } = window.eo.getModuleSettings('eoapi-common.remoteServer');

    const url = `${remoteUrl}/system/status`.replace(/(?<!:)\/{2,}/g, '/');
    const response = await fetch(url, {
      headers: {
        'x-api-key': token,
      },
    });
    let result;
    try {
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

  /**
   * switch data
   */
  switchDataSource = async () => {
    if (this.isRemote) {
      localStorage.setItem(IS_SHOW_DATA_SOURCE_TIP, 'true');
      this.switchToLocal();
      this.refreshComponent();
    } else {
      const [isSuccess] = await this.pingRmoteServerUrl();
      if (isSuccess) {
        localStorage.setItem(IS_SHOW_DATA_SOURCE_TIP, 'true');
        this.switchToHttp();
        this.refreshComponent();
      } else {
        console.log('切换失败');
        this.message.create('error', `远程数据源不可用`);
        localStorage.setItem(IS_SHOW_DATA_SOURCE_TIP, 'false');
      }
    }
  };

  showMessage() {
    this.message.create('success', `成功切换到${this.dataSourceText}数据源`);
    localStorage.setItem('IS_SHOW_DATA_SOURCE_TIP', 'false');
  }
}
