import { Component } from '@angular/core';
import { ElectronService } from '../../core/services';

@Component({
  selector: 'eo-win-operate',
  template: `<div *ngIf="!OS_TYPE.includes('mac') && electron.isElectron">
    <button eo-ng-button nzType="text">
      <nz-divider nzType="vertical"></nz-divider>
      <eo-iconpark-icon
        eoNgFeedbackTooltip
        i18n-nzTooltipTitle
        nzTooltipTitle="Minimize"
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
  OS_TYPE = navigator.platform.toLowerCase();
  constructor(public electron: ElectronService) {}
  minimize() {
    this.electron.ipcRenderer.send('message', {
      action: 'minimize',
    });
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
