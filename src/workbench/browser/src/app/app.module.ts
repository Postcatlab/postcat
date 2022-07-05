import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { EouiModule } from 'eo/workbench/browser/src/app/eoui/eoui.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

//Other module
import { CoreModule } from './core/core.module';
import { NgxsModule } from '@ngxs/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EnvState } from './shared/store/env.state';

// NG1 Upgrade
import { UpgradeModule } from '@angular/upgrade/static';
import { MessageService } from './shared/services/message';
import { IndexedDBStorage } from 'eo/workbench/browser/src/app/shared/services/storage/IndexedDB/lib/';
import { HttpStorage } from 'eo/workbench/browser/src/app/shared/services/storage/http/lib';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/remote/remote.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BaseUrlInterceptor } from 'eo/workbench/browser/src/app/shared/services/storage/http/lib/baseUrl.service';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    AppRoutingModule,
    HttpClientModule,
    UpgradeModule,
    EouiModule,
    NgxsModule.forRoot([EnvState]),
  ],
  providers: [
    StorageService,
    RemoteService,
    MessageService,
    IndexedDBStorage,
    HttpStorage,
    NzMessageService,
    NzModalService,
    {
      provide: '$scope',
      useFactory: (i) => i.get('$rootScope'),
      deps: ['$injector'],
    },
    { provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private upgrade: UpgradeModule, private lang: LanguageService) {
    if (APP_CONFIG.production) {
      this.lang.init();
    }
    this.upgrade.bootstrap(document.body, ['eolinker']);
  }
}
