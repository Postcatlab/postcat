import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { autorun, reaction } from 'mobx';
import { WebService } from 'pc/browser/src/app/core/services';
import { LanguageService } from 'pc/browser/src/app/core/services/language/language.service';
import { ApiService } from 'pc/browser/src/app/services/storage/api.service';
import { StoreService } from 'pc/browser/src/app/store/state.service';
import { APP_CONFIG } from 'pc/browser/src/environments/environment';

// * type(0=wechat, 1=qq, 2=github, 3=feishu, 4=corp_wechat, 5=ding_talk, 6=oauth2)
enum LoginType {
  qq = 1,
  github = 2,
  feishu = 3,
  corp_wechat = 4
}

@Component({
  selector: 'third-login',
  template: ` <div class="">
      <nz-divider nzPlain [nzText]="text">
        <ng-template #text>
          <span class="or" i18n>or</span>
        </ng-template>
      </nz-divider>
    </div>
    <div class="mb-4" *ngIf="lang.langHash === 'en'">
      <button
        eo-ng-button
        [nzLoading]="isLoginBtnBtnLoading"
        type="submit"
        class="h-10"
        nzType="primary"
        nzBlock
        nzGhost
        nzSize="large"
        (click)="handleLogin('github')"
        traceID="click_login_github"
        trace
        i18n
      >
        Sign In/Up with Github
      </button>
    </div>
    <div class="flex justify-evenly">
      <button
        class="w-8 h-8 rounded-full bg-center bg-no-repeat bg-cover cursor-pointer border-none"
        *ngFor="let it of renderList"
        (click)="handleLogin(it.type)"
        trace
        [traceID]="'click_login_' + it.type"
        [ngStyle]="{ 'background-image': logoLink(it.logo) }"
      >
      </button>
    </div>`,
  styleUrls: ['./third-login.component.scss']
})
export class ThirdLoginComponent implements OnInit {
  @Output() readonly doneChange: EventEmitter<any> = new EventEmitter<boolean>();
  renderList = [];
  isLoginBtnBtnLoading = false;
  constructor(private api: ApiService, private web: WebService, public lang: LanguageService) {}
  ngOnInit() {
    autorun(() => {
      this.renderList =
        this.lang.langHash === 'zh'
          ? [
              // { logo: 'feishu.png', label: '飞书', type: 'feishu' },
              { logo: 'github.png', label: 'Github', type: 'github' }
            ]
          : [];
    });
  }
  logoLink(name) {
    return `url('./assets/images/${name}')`;
  }

  async handleLogin(type) {
    // * get login url
    const [res, err] = await this.api.api_userThirdLogin({
      type: LoginType[type],
      redirectUri: this.web.isWeb ? window.location.href.split('?').at(0) : APP_CONFIG.serverUrl,
      appType: 0,
      client: 0
    });
    if (err) {
      return;
    }
    // * close
    this.doneChange.emit(true);
    if (this.web.isWeb) {
      window.location.href = res[type];
      return;
    }
    window.electron.loginWith(
      {
        url: res[type],
        redirectUrl: window.location.href
      },
      data => {
        console.log('retrun data', data);
      }
    );
  }
}
