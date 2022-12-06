import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectronService } from '../../core/services';

@Component({
  selector: 'eo-win-operate',
  template: ` <div *ngIf="showOperate">
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
  </div>`,
})
export class WinOperateComponent {
  isMaximized = false;
  showOperate = navigator.platform.toLowerCase().includes('mac') && this.electron.isElectron;
  constructor(private electron: ElectronService,private router: Router,private route: ActivatedRoute) {}
  minimize() {
    this.electron.ipcRenderer.send('message', {
      action: 'minimize',
    });
  }
  async refresh() {
    const { pathname, searchParams } = new URL(window.location.href);
    await this.router.navigate(['**']);
    await this.router.navigate([pathname], { queryParams: Object.fromEntries(searchParams.entries()) });
  }
  toggleMaximize() {
    this.electron.ipcRenderer.send('message', {
      action: this.isMaximized ? 'restore' : 'maximize',
    });
    this.isMaximized = !this.isMaximized;
  }
  close() {
    this.electron.ipcRenderer.send('message', {
      action: 'close',
    });
  }
}
