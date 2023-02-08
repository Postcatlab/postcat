import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { autorun } from 'mobx';

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
          <i class="or">or</i>
        </ng-template>
      </nz-divider>
    </div>
    <div class="mb-4" *ngIf="store.isEn">
      <button
        eo-ng-button
        [nzLoading]="isLoginBtnBtnLoading"
        type="submit"
        class="h-10"
        nzType="primary"
        nzBlock
        (click)="handleLogin('github')"
        nzGhost
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
  constructor(private api: ApiService, private web: WebService, public store: StoreService) {}
  ngOnInit() {
    autorun(() => {
      // * It could use store.isZh and store.isEn
      this.renderList = this.store.isZh
        ? [
            // { logo: 'feishu.png', label: '飞书', type: 'feishu' },
            { logo: 'github.png', label: 'Github', type: 'github' }
          ]
        : [];
    });
  }
  logoLink(name) {
    return `url('https://cdn.eolink.com/10.7.3.4/ng14/assets/images/third_party/${name}')`;
  }

  async handleLogin(type) {
    // * get login url
    const [res, err] = await this.api.api_userThirdLogin({
      type: LoginType[type],
      redirectUri: window.location.href.split('?').at(0),
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
    window.electron.loginWith(res[type], data => {
      console.log('retrun data', data);
    });
  }
}
