import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ElectronService } from '../../core/services';

@Component({
  selector: 'eo-nav-operate',
  template: ` <div class="flex items-center">
    <nz-divider nzType="vertical"></nz-divider>
    <button eo-ng-button nzType="default">
      <eo-iconpark-icon
        eoNgFeedbackTooltip
        i18n-nzTooltipTitle
        nzTooltipTitle="Refresh"
        nzType=""
        (click)="refresh()"
        name="refresh"
      ></eo-iconpark-icon>
    </button>
    <div *ngIf="showOperate">
      <button eo-ng-button nzType="text">
        <eo-iconpark-icon
          eoNgFeedbackTooltip
          i18n-nzTooltipTitle
          nzTooltipTitle="Minimize"
          (click)="minimize()"
          [nzTooltipMouseEnterDelay]="0.4"
          name="minus"
        ></eo-iconpark-icon>
      </button>
      <button eo-ng-button nzType="text">
        <eo-iconpark-icon
          eoNgFeedbackTooltip
          i18n-nzTooltipTitle
          nzTooltipTitle="Minimize"
          [nzTooltipMouseEnterDelay]="0.4"
          (click)="toggleMaximize()"
          [name]="isMaximized ? 'off-screen' : 'full-screen'"
        ></eo-iconpark-icon>
      </button>
      <button eo-ng-button nzType="text">
        <eo-iconpark-icon
          eoNgFeedbackTooltip
          i18n-nzTooltipTitle
          [nzTooltipMouseEnterDelay]="0.4"
          nzTooltipTitle="Close"
          name="close"
          (click)="close()"
        ></eo-iconpark-icon>
      </button>
    </div>
  </div>`
})
export class NavOperateComponent {
  isMaximized = false;
  showOperate = navigator.platform.toLowerCase().includes('mac') && this.electron.isElectron;
  constructor(private electron: ElectronService, private router: Router) {}
  minimize() {
    this.electron.ipcRenderer.send('message', {
      action: 'minimize'
    });
  }
  async refresh() {
    const { pathname, hash, searchParams } = new URL(window.location.href);
    console.log(this.router.url.split('?')[0]);
    // await this.router.navigate(['**']);
    // await this.router.navigate([], { queryParams: Object.fromEntries(searchParams.entries()) });
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
