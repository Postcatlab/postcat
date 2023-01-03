import { Component, OnDestroy, OnInit } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { ExtensionComponent } from 'eo/workbench/browser/src/app/pages/extension/extension.component';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { interval, Subject, takeUntil } from 'rxjs';
import { distinct } from 'rxjs/operators';

import { ElectronService, WebService } from '../../core/services';
import { LanguageService } from '../../core/services/language/language.service';
import { ThemeService } from '../../core/services/theme.service';
import { SystemSettingComponent } from '../../modules/system-setting/system-setting.component';
import { ModalService } from '../../shared/services/modal.service';
@Component({
  selector: 'eo-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  resourceInfo;
  helpMenus = [
    {
      title: $localize`Document`,
      href: 'https://docs.postcat.com',
      itemClick: $event => {}
    },
    {
      title: $localize`Report Issue`,
      href: `https://github.com/eolinker/postcat/issues/new?assignees=&labels=&template=bug_report.yml&environment=${this.getEnvironment()}`,
      itemClick: $event => {}
    }
  ];
  issueEnvironment = this.getEnvironment();
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    public electron: ElectronService,
    private web: WebService,
    private modal: ModalService,
    private modalService: NzModalService,
    private eMessage: EoNgFeedbackMessageService,
    public theme: ThemeService,
    private message: MessageService,
    private api: RemoteService,
    public lang: LanguageService,
    public store: StoreService,
    public dataSourceService: DataSourceService,
    private effect: EffectService
  ) {
    this.resourceInfo = this.web.resourceInfo;
  }
  async ngOnInit(): Promise<void> {
    this.message
      .get()
      .pipe(takeUntil(this.destroy$))
      .pipe(distinct(({ type }) => type, interval(400)))
      .subscribe(async ({ type, data }) => {
        if (type === 'open-setting') {
          this.openSettingModal(data);
          return;
        }
        if (type === 'open-extension') {
          this.openExtension();
          return;
        }
      });
  }
  openExtension() {
    this.modalService.create({
      nzClassName: 'eo-extension-modal',
      nzWidth: '80%',
      nzTitle: $localize`Extensions Hub`,
      nzContent: ExtensionComponent,
      nzFooter: null
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loginOrSign() {
    this.dataSourceService.checkRemoteCanOperate();
  }
  async loginOut() {
    this.store.setUserProfile({
      id: -1,
      password: '',
      username: '',
      workspaces: []
    });
    this.eMessage.success($localize`Successfully logged out !`);
    const refreshToken = this.store.getLoginInfo.refreshToken;
    this.store.clearAuth();
    {
      const [data, err]: any = await this.api.api_authLogout({
        refreshToken
      });
      if (err) {
        if (err.status === 401) {
          this.message.send({ type: 'clear-user', data: {} });
          if (this.store.isLogin) {
            return;
          }
          this.message.send({ type: 'http-401', data: {} });
        }
        return;
      }
    }
  }

  handleSwitchLang(event) {
    this.lang.changeLanguage(event);
  }

  /**
   * 打开系统设置
   */
  openSettingModal(inArg?) {
    const ref = this.modal.create({
      nzClassName: 'eo-system-setting-modal',
      nzTitle: $localize`Settings`,
      nzContent: SystemSettingComponent,
      nzComponentParams: {
        selectedModule: inArg?.module
      },
      withoutFooter: true
    });
    this.message
      .get()
      .pipe(distinct(({ type }) => type, interval(400)))
      .subscribe(({ type }) => {
        if (type === 'close-setting') {
          ref.close();
        }
      });
  }
  private getEnvironment(): string {
    let result = '';
    const systemInfo = this.electron?.getSystemInfo();
    systemInfo?.forEach(val => {
      if (['homeDir'].includes(val.id)) {
        return;
      }
      result += `- ${val.label}: ${val.value}\r\n`;
    });
    return encodeURIComponent(result);
  }
}
