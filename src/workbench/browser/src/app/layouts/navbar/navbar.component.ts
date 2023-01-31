import { Component, OnDestroy, OnInit } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { ExtensionComponent } from 'eo/workbench/browser/src/app/pages/extension/extension.component';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { interval, Subject, takeUntil } from 'rxjs';
import { distinct } from 'rxjs/operators';

import { ElectronService } from '../../core/services';
import { FeatureControlService } from '../../core/services/feature-control/feature-control.service';
import { ThemeService } from '../../core/services/theme/theme.service';
import { SystemSettingComponent } from '../../modules/system-setting/system-setting.component';
import { ModalService } from '../../shared/services/modal.service';
@Component({
  selector: 'eo-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    public electron: ElectronService,
    private modal: ModalService,
    private modalService: NzModalService,
    private eMessage: EoNgFeedbackMessageService,
    public theme: ThemeService,
    private message: MessageService,
    private api: ApiService,
    public store: StoreService,
    public dataSourceService: DataSourceService,
    public feature: FeatureControlService
  ) {}
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
    this.store.clearAuth();
    this.eMessage.success($localize`Successfully logged out !`);
    const [, err]: any = await this.api.api_userLogout({});
    if (err) {
      return;
    }
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
}
