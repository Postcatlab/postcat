import { Component, OnInit } from '@angular/core';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { copy } from 'eo/workbench/browser/src/app/utils/index.utils';
import { interval } from 'rxjs';

import { DataSourceService } from '../../shared/services/data-source/data-source.service';
@Component({
  selector: 'eo-get-share-link',
  template: `<button
      eo-ng-button
      nzType="default"
      class="mx-2 btn_scondary"
      nz-popover
      [nzPopoverContent]="contentTemplate"
      nzPopoverPlacement="bottomRight"
      nzPopoverTrigger="click"
      i18n
    >
      Share
    </button>
    <ng-template #contentTemplate>
      <div class="w-[360px] pb-4">
        <p i18n class="font-bold">Share via link</p>
        <p i18n class="pb-2 text-xs text-[#999]">
          This link will be updated with the API content. Everyone can access it without logging in
        </p>
        <div class="flex items-center justify-between">
          <input readonly type="text" eo-ng-input [value]="store.getShareLink" class="mr-3" />
          <button eo-ng-button nzType="primary" *ngIf="!isCopy" (click)="handleCopy()">Copy</button>
          <button eo-ng-button nzType="default" *ngIf="isCopy" class="text-[#158565]">Copied</button>
        </div>
      </div>
    </ng-template> `
})
export class GetShareLinkComponent implements OnInit {
  isCopy = false;
  constructor(public store: StoreService, public dataSourceService: DataSourceService) {}
  handleCopy() {
    if (this.isCopy) {
      return;
    }
    if (!this.store.getShareLink) {
      this.isCopy = false;
      return;
    }
    const isOk = copy(this.store.getShareLink);
    if (isOk) {
      this.isCopy = true;
      interval(700).subscribe(() => {
        this.isCopy = false;
      });
    }
  }
  async ngOnInit() {}
}
