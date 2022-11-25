import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../shared/services/message';
import { RemoteService } from '../../shared/services/storage/remote.service';
import { WorkspaceService } from '../../pages/workspace/workspace.service';
import { copy } from 'eo/workbench/browser/src/app/utils/index.utils';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { DataSourceService } from '../../shared/services/data-source/data-source.service';
import { StatusService } from '../../shared/services/status.service';
import { distinct, interval } from 'rxjs';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';
import { WebService } from '../../core/services';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
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
        <p i18n class="pb-2 text-xs text-gray-400">
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
    private store: StoreService,
    public dataSourceService: DataSourceService,
    public status: StatusService,
    private web: WebService,
    private message: MessageService,
    private lang: LanguageService,
    public workspaceService: WorkspaceService,
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
  async getShareLink() {
    if (this.workspaceService.isLocal) {
      return '';
    }
    if (!this.store.getIsLogin) {
      return '';
    }
    if (this.status.isShare) {
      return '';
    }
    const [res, err]: any = await this.http.api_shareCreateShare({});
    if (err) {
      return '';
    }
    const host = (this.dataSourceService?.remoteServerUrl || window.location.host)
      .replace(/(?<!:)\/{2,}/g, '/')
      .replace(/(\/$)/, '');
    const lang = !APP_CONFIG.production && this.web.isWeb ? '' : this.lang.langHash;
    return `${host}/${lang ? `${lang}/` : ''}home/share/http/test?shareId=${res.uniqueID}`;
  }
  async ngOnInit() {
    this.shareLink = await this.getShareLink();
    this.message
      .get()
      .pipe(distinct(({ type }) => type, interval(400)))
      .subscribe(async ({ type }) => {
        if (type === 'update-share-link') {
          // * request share link
          this.shareLink = await this.getShareLink();
        }
      });
  }
}
