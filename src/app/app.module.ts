import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

//Other module
import { CoreModule } from './core/core.module';
import { StorageModule } from './modules/storage/storage.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// NG1 Upgrade
import { UpgradeModule } from '@angular/upgrade/static';
import { StorageSetting } from './modules/storage/storage.config';

import { NzModalModule } from 'ng-zorro-antd/modal';

// 数据库配置
const storageSetting: StorageSetting = {
  name: 'storage_module',
  version: 2,
  schema: {
    project: '++uuid, name',
    environment: '++uuid, name, projectID',
    group: '++uuid, name, projectID, parentID',
    apiData: '++uuid, name, projectID, groupID',
    apiTestHistory: '++uuid, projectID, apiDataID',
  },
  // 数据库创建库初始数据
  initData: [
    {
      name: 'project',
      items: [{ uuid: 1, name: 'Default' }],
    },
  ],
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    AppRoutingModule,
    UpgradeModule,
    NzModalModule,
    StorageModule.forRoot({ setting: storageSetting }),
  ],
  providers: [
    {
      provide: '$scope',
      useFactory: (i) => i.get('$rootScope'),
      deps: ['$injector'],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private upgrade: UpgradeModule) {
    this.upgrade.bootstrap(document.body, ['eolinker']);
  }
}
