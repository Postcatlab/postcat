import { Component, Input, OnInit } from '@angular/core';

import { ElectronService, WebService } from '../../core/services';

@Component({
  selector: 'pc-download-client',
  template: `<ng-container *ngIf="!electron.isElectron">
    <button *ngIf="btnType === 'icon'" eo-ng-button nzType="text" eo-ng-dropdown [nzDropdownMenu]="download">
      <eo-iconpark-icon name="download" size="14px"></eo-iconpark-icon>
    </button>
    <button *ngIf="btnType !== 'icon'" eo-ng-button nzType="primary" eo-ng-dropdown [nzDropdownMenu]="download">
      <eo-iconpark-icon name="download" size="14px"></eo-iconpark-icon>
      <span class="ml-[5px]">{{ title }}</span>
    </button>
    <eo-ng-dropdown-menu #download="nzDropdownMenu">
      <ul nz-menu>
        <ng-container *ngFor="let item of resourceInfo; let index = index">
          <a [href]="item.link" traceID="download_client" [traceParams]="{ client_system: item.id }" trace nz-menu-item>{{ item.name }}</a>
        </ng-container>
      </ul>
    </eo-ng-dropdown-menu></ng-container
  >`,
  styles: []
})
export class DownloadClientComponent implements OnInit {
  @Input() title: string = $localize`Download`;
  @Input() btnType: string = 'button';
  resourceInfo;
  constructor(private web: WebService, public electron: ElectronService) {}

  ngOnInit(): void {
    this.resourceInfo = this.web.resourceInfo;
  }
}
