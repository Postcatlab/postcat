import { Component } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { copy } from 'pc/browser/src/app/shared/utils/index.utils';
import { EffectService } from 'pc/browser/src/app/store/effect.service';
import { StoreService } from 'pc/browser/src/app/store/state.service';
import { interval } from 'rxjs';

import { DataSourceService } from '../../services/data-source/data-source.service';
@Component({
  selector: 'eo-get-share-link',
  template: `
    <button
      eo-ng-button
      nzType="default"
      class="mx-2"
      nz-popover
      *ngIf="store.getPageLevel === 'project'"
      [nzPopoverContent]="contentTemplate"
      nzPopoverPlacement="bottomRight"
      nzPopoverOverlayClassName="background-popover"
      [nzPopoverTrigger]="!store.isLocal ? 'click' : null"
      (click)="handleGetShareLink()"
      trace
      traceID="click_share"
      i18n
    >
      Share API
    </button>
    <ng-template #contentTemplate>
      <div class="w-[360px] py-4">
        <p i18n class="font-bold">Share via link</p>
        <p i18n class="pb-2 text-xs text-tips">
          This link will be updated with the API content. Everyone can access it without logging in
        </p>
        <div class="flex items-center">
          <nz-spin *ngIf="!link" class="flex-1 mt-[10px]"></nz-spin>
        </div>
        <ng-container *ngIf="link">
          <p nz-typography [nzContent]="link" nzCopyable nzEllipsis [nzCopyText]="link" [nzCopyIcons]="[copedIcon, copedIcon]"> </p>
          <ng-template #copedIcon>
            <button eo-ng-button nzType="text"><eo-iconpark-icon name="copy"></eo-iconpark-icon></button>
          </ng-template>
        </ng-container>
      </div>
    </ng-template>
  `
})
export class GetShareLinkComponent {
  link;
  isCopy = false;
  constructor(
    private effect: EffectService,
    public store: StoreService,
    public dataSourceService: DataSourceService,
    private message: EoNgFeedbackMessageService
  ) {}
  handleGetShareLink() {
    this.dataSourceService.checkRemoteCanOperate(async () => {
      if (this.store.isLocal) {
        this.message.info($localize`If you want to share API,Please switch to cloud workspace`);
      }
      this.link = await this.effect.updateShareLink();
    });
  }
}
