import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { EouiModule } from 'eo/workbench/browser/src/app/eoui/eoui.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Other module
import { CoreModule } from './core/core.module';
import { NgxsModule } from '@ngxs/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EnvState } from './shared/store/env.state';

// NG1 Upgrade
import { UpgradeModule } from '@angular/upgrade/static';
import { IndexedDBStorage } from 'eo/workbench/browser/src/app/shared/services/storage/IndexedDB/lib/';
import { HttpStorage } from 'eo/workbench/browser/src/app/shared/services/storage/http/lib';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage';
import { SettingService } from 'eo/workbench/browser/src/app/core/services/settings/settings.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BaseUrlInterceptor } from 'eo/workbench/browser/src/app/shared/services/storage/http/lib/baseUrl.service';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';
import { AppService } from './app.service';

//I18n
import { ExtensionService } from 'eo/workbench/browser/src/app/pages/extension/extension.service';
import { registerLocaleData } from '@angular/common';
import { en_US, NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import zh from '@angular/common/locales/zh';
registerLocaleData(en);
registerLocaleData(zh);

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    AppService,
    SettingService,
    ExtensionService,
    StorageService,
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
    {
      provide: NZ_I18N,
      useFactory: (localId: string) => {
        switch (localId) {
          case 'zh':
            return zh_CN;
          default:
            return en_US;
        }
      },
      deps: [LOCALE_ID],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private upgrade: UpgradeModule, private lang: LanguageService, private appService: AppService) {
    this.appService.init();
    if (APP_CONFIG.production) {
      this.lang.init();
    }
    this.upgrade.bootstrap(document.body, ['eolinker']);
  }
}
