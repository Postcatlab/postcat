import { Component } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
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
      *ngIf="!store.isShare && store.getUrl.includes('/home/workspace/project/api/http/test')"
      [nzPopoverContent]="contentTemplate"
      nzPopoverPlacement="bottomRight"
      nzPopoverTrigger="click"
      (click)="handleGetShareLink()"
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
        <div class="flex items-center">
          <span class="truncate flex-1">
            {{ link }}
          </span>
          <button eo-ng-button nzType="text" (click)="handleCopy()"><eo-iconpark-icon name="copy"></eo-iconpark-icon></button>
        </div>
      </div>
    </ng-template> `
})
export class GetShareLinkComponent {
  link;
  isCopy = false;
  constructor(
    private effect: EffectService,
    public store: StoreService,
    public dataSourceService: DataSourceService,
    private message: EoNgFeedbackMessageService
  ) {
    this.link = 'Please wait ...';
  }
  handleCopy() {
    if (this.isCopy) {
      return;
    }
    if (!this.link) {
      this.isCopy = false;
      return;
    }
    const isOk = copy(this.link);
    if (isOk) {
      this.message.success($localize`Copied`);
      this.isCopy = true;
      interval(700).subscribe(() => {
        this.isCopy = false;
      });
    }
  }
  async handleGetShareLink() {
    this.link = await this.effect.updateShareLink();
  }
}
