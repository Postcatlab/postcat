import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ElectronService } from '../../core/services';

@Component({
  selector: 'eo-nav-operate',
  template: ` <div class="flex items-center" *ngIf="isElectron">
    <button eo-ng-button (click)="refresh()" nzType="default">
      <eo-iconpark-icon eoNgFeedbackTooltip i18n-nzTooltipTitle nzTooltipTitle="Refresh" nzType="" name="refresh"></eo-iconpark-icon>
    </button>
    <div *ngIf="!isMac">
      <button
        eo-ng-button
        eoNgFeedbackTooltip
        i18n-nzTooltipTitle
        nzTooltipTitle="Minimize"
        [nzTooltipMouseEnterDelay]="0.4"
        nzType="text"
        (click)="minimize()"
      >
        <eo-iconpark-icon name="minus"></eo-iconpark-icon>
      </button>
      <button
        eo-ng-button
        eoNgFeedbackTooltip
        i18n-nzTooltipTitle
        nzTooltipTitle="Maximize"
        [nzTooltipMouseEnterDelay]="0.4"
        nzType="text"
        (click)="toggleMaximize()"
      >
        <eo-iconpark-icon [name]="isMaximized ? 'off-screen' : 'full-screen'"></eo-iconpark-icon>
      </button>
      <button
        eo-ng-button
        eoNgFeedbackTooltip
        i18n-nzTooltipTitle
        (click)="close()"
        [nzTooltipMouseEnterDelay]="0.4"
        nzTooltipTitle="Quit"
        nzType="text"
      >
        <eo-iconpark-icon name="close"></eo-iconpark-icon>
      </button>
    </div>
  </div>`
})
export class NavOperateComponent {
  isMaximized = false;
  isElectron: boolean;
  isMac = navigator.platform.toLowerCase().includes('mac');
  constructor(private electron: ElectronService, private router: Router, private route: ActivatedRoute) {
    this.isElectron = this.electron.isElectron;
  }
  minimize() {
    this.electron.ipcRenderer.send('message', {
      action: 'minimize'
    });
  }
  async refresh() {
    const pathname = this.router.url.split('?').at(0);
    const queryParams = this.route.queryParams;
    await this.router.navigate(['**']);
    await this.router.navigate([pathname], { queryParams });
  }
  toggleMaximize() {
    this.electron.ipcRenderer.send('message', {
      action: this.isMaximized ? 'restore' : 'maximize'
    });
    this.isMaximized = !this.isMaximized;
  }
  close() {
    this.electron.ipcRenderer.send('message', {
      action: 'close'
    });
  }
}
