//Other module

//I18n
import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import en from '@angular/common/locales/en';
import zh from '@angular/common/locales/zh';
import { NgModule, LOCALE_ID, APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WarningFill } from '@ant-design/icons-angular/icons';
import { EoNgFeedbackTooltipModule, EoNgFeedbackMessageModule } from 'eo-ng-feedback';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { ExtensionService } from 'eo/workbench/browser/src/app/pages/extension/extension.service';
import { GlobalProvider } from 'eo/workbench/browser/src/app/shared/services/globalProvider';
import { IndexedDBStorage } from 'eo/workbench/browser/src/app/shared/services/storage/IndexedDB/lib/';
import { HttpStorage } from 'eo/workbench/browser/src/app/shared/services/storage/http/lib';
import { BaseUrlInterceptor } from 'eo/workbench/browser/src/app/shared/services/storage/http/lib/baseUrl.service';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';
import { en_US, NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThemeService } from './core/services/theme.service';
import { TABLE_PRO_CONFIG } from './modules/eo-ui/table-pro/table-pro.token';
import { MockService } from './services/mock.service';
registerLocaleData(en);
registerLocaleData(zh);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NzModalModule,
    EoNgFeedbackTooltipModule,
    EoNgFeedbackMessageModule,
    NzIconModule.forRoot([WarningFill])
  ],
  providers: [
    MockService,
    ExtensionService,
    StorageService,
    IndexedDBStorage,
    HttpStorage,
    ThemeService,
    {
      provide: TABLE_PRO_CONFIG,
      useValue: {
        childKey: 'children'
      }
    },
    {
      provide: '$scope',
      useFactory: i => i.get('$rootScope'),
      deps: ['$injector']
    },
    { provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: (themeService: ThemeService) => () => themeService.initTheme(),
      deps: [ThemeService],
      multi: true
    },
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
      deps: [LOCALE_ID]
    }
  ],
  bootstrap: [AppComponent],
  schemas: []
})
export class AppModule {
  constructor(
    private lang: LanguageService,
    private mockService: MockService,
    private global: GlobalProvider,
    private extensionService: ExtensionService
  ) {
    this.extensionService.init();
    this.mockService.init();
    this.global.injectGlobalData();
    if (APP_CONFIG.production) {
      this.lang.init();
    }
  }
}
