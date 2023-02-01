import { Component, Input, OnInit } from '@angular/core';

import { ElectronService, WebService } from '../../core/services';

@Component({
  selector: 'pc-download-client',
  template: ` <button eo-ng-button nzType="primary" *ngIf="!electron.isElectron" eo-ng-dropdown [nzDropdownMenu]="download">
      <eo-iconpark-icon class="mr-[5px]" name="download" size="14px"></eo-iconpark-icon>
      <span i18n>{{ title }}</span>
    </button>
    <eo-ng-dropdown-menu #download="nzDropdownMenu">
      <ul nz-menu>
        <ng-container *ngFor="let item of resourceInfo; let index = index">
          <a [href]="item.link" nz-menu-item>{{ item.name }}</a>
        </ng-container>
      </ul>
    </eo-ng-dropdown-menu>`,
  styles: []
})
export class DownloadClientComponent implements OnInit {
  @Input() title: string = $localize`Download`;
  resourceInfo;
  constructor(private web: WebService, public electron: ElectronService) {}

  ngOnInit(): void {
    this.resourceInfo = this.web.resourceInfo;
  }
}
