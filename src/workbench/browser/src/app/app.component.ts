import { Component } from '@angular/core';
import { ElectronService, ThemeService } from './core/services';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';
import { WebExtensionService } from 'eo/workbench/browser/src/app/shared/services/web-extension/webExtension.service';

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
    private dataSource: DataSourceService,
    private electron: ElectronService,
    private webExtensionService: WebExtensionService
  ) {
    this.webExtensionService.init();
    this.theme.changeTheme();
    //Check Connection at fisrt
    if (!this.dataSource.isRemote || !this.electron.isElectron) {
      return;
    }
    this.dataSource.checkRemoteAndTipModal();
  }
}
