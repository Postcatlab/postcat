import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

//Other module
import { CoreModule } from './core/core.module';
import { StorageModule } from './modules/storage/storage.module';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NgxsModule } from '@ngxs/store';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EnvState } from './shared/store/env.state';

// NG1 Upgrade
import { UpgradeModule } from '@angular/upgrade/static';

//Storage Module
import { storageSettingData } from './shared/models/storageSetting.model';



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
    NgxsModule.forRoot([EnvState]),
    StorageModule.forRoot({ setting: storageSettingData })
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
