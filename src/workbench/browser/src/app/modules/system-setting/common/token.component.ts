import { Component } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { copy } from 'eo/workbench/browser/src/app/utils/index.utils';

import { DataSourceService } from '../../../shared/services/data-source/data-source.service';

@Component({
  selector: 'eo-token',
  template: `
    <div class="pb-4" *ngIf="token">
      <eo-ng-feedback-alert nzType="success" [nzMessage]="templateRefSuccessMessage" i18n-nzMessage i18n-nzDescription>
        <ng-template #templateRefSuccessMessage>
          <section class="pt-1 px-3">
            <div class="alert-title flex justify-between">
              <span i18n>Token succeddfully generated</span>
              <span class="cursor-pointer" (click)="closeAlert()"><eo-iconpark-icon name="close"></eo-iconpark-icon></span>
            </div>
            <div i18n>Make sure to copy your token. It will never be displayed again.</div>
            <div>
              <span class="alert-text">{{ token }}</span>
              <button eo-ng-button nzType="text" class="copy-btn mx-2" (click)="handleCopy(token)"
                ><eo-iconpark-icon name="copy"></eo-iconpark-icon
              ></button>
            </div>
          </section>
        </ng-template>
      </eo-ng-feedback-alert>
    </div>
    <h2 class="text-lg flex justify-between items-center">
      <span class="font-bold text-base mb-2" i18n>Personal Access Token</span>
    </h2>
    <button eo-ng-button nzType="primary" trace traceID="generate_token" class="w-32" i18n (click)="resetToken()">Generate Token</button>
  `,
  styleUrls: ['./token.component.scss']
})
export class TokenComponent {
  token;
  constructor(
    private api: ApiService,
    private message: MessageService,
    private eoMessage: EoNgFeedbackMessageService,
    private store: StoreService,
    private dataSource: DataSourceService
  ) {
    this.token = '';
  }

  handleCopy(text) {
    const isOk = copy(text);
    if (isOk) {
      this.eoMessage.success($localize`Copied`);
    }
  }

  closeAlert() {
    // * Reset token and close the alert
    this.token = '';
  }

  async resetToken() {
    this.dataSource.checkRemoteCanOperate(async () => {
      const [data, err] = await this.api.api_userResetToken({});
      if (err) {
        return;
      }
      this.token = data.accessToken;
    });
  }

  async getToken() {}
}
