import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ExtensionComponent } from 'pc/browser/src/app/pages/components/extension/extension.component';
import { MessageService } from 'pc/browser/src/app/services/message';
import { StoreService } from 'pc/browser/src/app/store/state.service';
import { APP_CONFIG } from 'pc/browser/src/environments/environment';
import { interval, Subject, takeUntil } from 'rxjs';
import { distinct } from 'rxjs/operators';

import { SettingService } from '../../components/system-setting/settings.service';
import { ElectronService } from '../../core/services';
import { ThemeService } from '../../core/services/theme/theme.service';
@Component({
  selector: 'eo-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  readonly APP_CONFIG = APP_CONFIG;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    public electron: ElectronService,
    private modalService: NzModalService,
    public theme: ThemeService,
    private message: MessageService,
    public store: StoreService,
    private setting: SettingService
  ) {}
  async ngOnInit(): Promise<void> {
    this.message
      .get()
      .pipe(takeUntil(this.destroy$))
      .pipe(distinct(({ type }) => type, interval(400)))
      .subscribe(async ({ type, data }) => {
        if (type === 'open-extension') {
          this.openExtension(data);
          return;
        }
      });
  }
  openExtension(data?) {
    this.modalService.create({
      nzClassName: 'eo-extension-modal',
      nzWidth: '85%',
      nzTitle: $localize`Extensions Hub`,
      nzComponentParams: {
        keyword: data?.suggest || '',
        nzSelectedKeys: [data?.suggest || 'all']
      },
      nzContent: ExtensionComponent,
      nzFooter: null
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  openSettingModal() {
    this.setting.openSettingModal();
  }
}
