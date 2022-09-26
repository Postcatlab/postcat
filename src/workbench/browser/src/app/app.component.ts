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
    private remoteService: RemoteService,
    private modal: NzModalService,
    private appService: AppService
  ) {
    this.theme.changeTheme();
    this.checkRemoteServerConnect();
  }

  async checkRemoteServerConnect() {
    if (this.remoteService.isRemote && window.eo) {
      const [isSuccess] = await this.remoteService.pingRmoteServerUrl();
      if (!isSuccess) {
        const timer = setTimeout(() => {
          this.remoteService.switchDataSource('local');
        }, 5000);
        this.modal.info({
          nzContent: $localize`:{can not connect}:Unable to connect to remote data sources, please check and reconnect. In order not to affect use, the app will help you jump to local`,
          nzFooter: null,
          nzCentered: true,
          nzClosable: false,
          nzOnOk: () => {
            clearTimeout(timer);
            timer && this.remoteService.switchDataSource('local');
          },
        });
      }
    }
  }
}
