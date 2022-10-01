import { Component } from '@angular/core';
import { ElectronService, ThemeService } from './core/services';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';

@Component({
  selector: 'eo-root',
  template: `
    <eo-message></eo-message>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  constructor(private theme: ThemeService, private dataSource: DataSourceService, private electron: ElectronService) {
    this.theme.changeTheme();
    //Check Connection at fisrt
    if (!this.dataSource.isRemote || !this.electron.isElectron) {
      return;
    }
    this.dataSource.checkRemoteAndTipModal();
  }
}
