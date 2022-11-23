import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../shared/services/message';
import { RemoteService } from '../../../shared/services/storage/remote.service';
import { UserService } from '../../../services/user/user.service';
import { WorkspaceService } from '../../workspace/workspace.service';
import { copy } from 'eo/workbench/browser/src/app/utils/index.utils';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { DataSourceService } from '../../../shared/services/data-source/data-source.service';
import { StatusService } from '../../../shared/services/status.service';
import { distinct, interval } from 'rxjs';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';
import { WebService } from '../../../core/services';
@Component({
  selector: 'eo-get-share-link',
  templateUrl: './get-share-link.component.html',
  styleUrls: ['./get-share-link.component.scss'],
})
export class GetShareLinkComponent implements OnInit {
  shareLink = '';
  isCopy = false;
  constructor(
    private userService: UserService,
    public dataSourceService: DataSourceService,
    public status: StatusService,
    private web: WebService,
    private message: MessageService,
    private lang: LanguageService,
    public workspaceService: WorkspaceService,
    private http: RemoteService
  ) {
  }
  handleCopy() {
    if (this.isCopy) {
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
    if (!this.userService.isLogin) {
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
