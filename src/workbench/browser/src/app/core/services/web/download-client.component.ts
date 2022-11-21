import { Component } from '@angular/core';
import { WebService } from 'eo/workbench/browser/src/app/core/services';

@Component({
  selector: 'eo-download-client',
  template: `
    <span i18n>Don't have Eoapi Client?</span>
    <!-- <a eo-ng-button nzType="link" eo-nz-dropdown [nzDropdownMenu]="download" i18n> Download </a>.
    <eo-nz-dropdown-menu #download="nzDropdownMenu">
      <ul nz-menu>
        <ng-container *ngFor="let item of resourceInfo; let index = index">
          <a [href]="item.link" nz-menu-item>{{ item.name }}</a>
          <li nz-menu-divider *ngIf="index !== resourceInfo.length - 1"></li>
        </ng-container>
      </ul>
    </eo-nz-dropdown-menu> -->
  `,
})
export class DownloadClienteComponent {
  resourceInfo = this.web.resourceInfo;

  constructor(public web: WebService) {}
}
