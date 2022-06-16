import { Component } from '@angular/core';
import { ThemeService } from './core/services';
import { AppService } from './app.service';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/remote/remote.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'eo-root',
  template: `
    <eo-message></eo-message>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  constructor(
    private theme: ThemeService,
    private app: AppService,
    private remoteService: RemoteService,
    private modal: NzModalService
  ) {
    this.theme.changeTheme();
    this.checkRemoteServerConnect();
  }

  async checkRemoteServerConnect() {
    if (this.remoteService.isRemote && window.eo) {
      const [isSuccess] = await this.remoteService.pingRmoteServerUrl();
      console.log('isSuccess', isSuccess);
      if (!isSuccess) {
        const timer = setTimeout(() => {
          this.remoteService.switchDataSource();
        }, 5000);
        this.modal.info({
          nzContent: '无法连接到远程数据源，请检查后重新连接，为了不影响使用，程序将帮您跳转到本地',
          nzFooter: null,
          nzCentered: true,
          nzClosable: false,
          nzOnOk: () => {
            clearTimeout(timer);
            this.remoteService.switchDataSource();
          },
        });
      }
    }
  }
}
