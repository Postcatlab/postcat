import { Component } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';

import { FeatureControlService } from '../../../core/services/feature-control/feature-control.service';
import { SettingService } from '../../../modules/system-setting/settings.service';
import { DataSourceService } from '../../../shared/services/data-source/data-source.service';
import { MessageService } from '../../../shared/services/message';
import { ApiService } from '../../../shared/services/storage/api.service';
import { StoreService } from '../../../shared/store/state.service';

@Component({
  selector: 'pc-btn-user',
  template: `
    <ng-container *ngIf="feature.config.cloudFeature">
      <button *ngIf="!store.isLogin" eo-ng-button nzType="primary" (click)="loginOrSign()" i18n>Sign in/Up</button>
      <button
        *ngIf="store.isLogin"
        eo-ng-button
        nzType="text"
        eo-ng-dropdown
        class="flex items-center justify-center icon"
        [nzDropdownMenu]="userMenu"
        nzPlacement="bottomRight"
      >
        <eo-iconpark-icon name="people"> </eo-iconpark-icon>
      </button>
      <eo-ng-dropdown-menu #userMenu>
        <ul nz-menu>
          <li class="px-[12px] py-[5px] font-bold">
            {{ store.getUserProfile?.userNickName }}
          </li>
          <li nz-menu-item (click)="openSettingModal()" i18n>Account Setting</li>
          <li nz-menu-item (click)="loginOut()" i18n>Sign Out</li>
        </ul>
      </eo-ng-dropdown-menu>
    </ng-container>
  `,
  styles: []
})
export class BtnUserComponent {
  constructor(
    private message: MessageService,
    private api: ApiService,
    public feature: FeatureControlService,
    private eMessage: EoNgFeedbackMessageService,
    public store: StoreService,
    private dataSourceService: DataSourceService,
    private setting: SettingService
  ) {}

  openSettingModal() {
    this.setting.openSettingModal({
      module: 'user'
    });
  }
  async loginOut() {
    this.store.clearAuth();
    this.eMessage.success($localize`Successfully logged out !`);
    const [, err]: any = await this.api.api_userLogout({});
    if (err) {
      return;
    }
  }
  loginOrSign() {
    this.dataSourceService.checkRemoteCanOperate();
  }
}
