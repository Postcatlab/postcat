import { Component, OnInit } from '@angular/core';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

// * type(0=wechat, 1=qq, 2=github, 3=feishu, 4=corp_wechat, 5=ding_talk, 6=oauth2)
enum LoginType {
  qq = 1,
  github = 2,
  feishu = 3,
  corp_wechat = 4
}

@Component({
  selector: 'third-login',
  template: `<div class="flex justify-evenly pt-6">
    <button
      class="w-8 h-8 rounded-full bg-center bg-no-repeat bg-cover cursor-pointer border-none"
      *ngFor="let it of renderList"
      (click)="handleLogin(it.type)"
      [ngStyle]="{ 'background-image': logoLink(it.logo) }"
    >
    </button>
  </div>`,
  styleUrls: []
})
export class ThirdLoginComponent implements OnInit {
  renderList = [];
  constructor(private store: StoreService, private api: ApiService) {}
  ngOnInit() {
    // this.renderList = this.store.isZh
    //   ? []
    //   : [];
    this.renderList = [
      { logo: 'feishu.png', label: '飞书', type: 'feishu' },
      { logo: 'qq.png', label: 'QQ', type: 'qq' },
      { logo: 'github.png', label: 'Github', type: 'github' }
    ];
  }
  logoLink(name) {
    return `url('https://cdn.eolink.com/10.7.3.4/ng14/assets/images/third_party/${name}')`;
  }
  async handleLogin(type) {
    // * get login url
    const [res, err] = await this.api.api_userThirdLogin({
      type: LoginType[type],
      redirectUri: this.store.getUrl.split('?').at(0),
      appType: 0,
      client: 0
    });
    if (err) {
      return;
    }
    window.location.href = res[type];
  }
}
