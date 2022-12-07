import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../shared/services/message';
import { RemoteService } from '../../shared/services/storage/remote.service';
import { copy } from 'eo/workbench/browser/src/app/utils/index.utils';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { DataSourceService } from '../../shared/services/data-source/data-source.service';
import { distinct, interval } from 'rxjs';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';
import { WebService } from '../../core/services';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { autorun } from 'mobx';
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
          <input readonly type="text" eo-ng-input [value]="shareLink" class="mr-3" />
          <button eo-ng-button nzType="primary" *ngIf="!isCopy" (click)="handleCopy()">Copy</button>
          <button eo-ng-button nzType="default" *ngIf="isCopy" class="text-[#158565]">Copied</button>
        </div>
      </div>
    </ng-template> `,
})
export class GetShareLinkComponent implements OnInit {
  shareLink = '';
  isCopy = false;
  constructor(
    public store: StoreService,
    public dataSourceService: DataSourceService,
    private web: WebService,
    private message: MessageService,
    private lang: LanguageService,
    private http: RemoteService
  ) {}
  handleCopy() {
    if (this.isCopy) {
      return;
    }
    if (!this.shareLink) {
      this.isCopy = false;
      return;
    }
    const isOk = copy(this.shareLink);
    if (isOk) {
      this.isCopy = true;
      interval(700).subscribe(() => {
        this.isCopy = false;
      });
    }
  }
  async ngOnInit() {
    autorun(async () => {
      console.log('yoo');
      if (this.store.isLocal) {
        this.shareLink = '';
        return;
      }
      if (!this.store.isLogin) {
        this.shareLink = '';
        return;
      }
      if (this.store.isShare) {
        this.shareLink = '';
        return;
      }
      console.log('yoo1');
      const [res, err]: any = await this.http.api_shareCreateShare({});
      if (err) {
        console.log('yoo2');
        this.shareLink = '';
        return;
      }
      const host = (this.dataSourceService?.remoteServerUrl || window.location.host)
        .replace(/:\/{2,}/g, ':::')
        .replace(/\/{2,}/g, '/')
        .replace(/:{3}/g, '://')
        .replace(/(\/$)/, '');
      const lang = !APP_CONFIG.production && this.web.isWeb ? '' : this.lang.langHash;
      this.shareLink = `${host}/${lang ? `${lang}/` : ''}home/share/http/test?shareId=${res.uniqueID}`;
      console.log('yoo3', this.shareLink);
    });
  }
}
