import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import en from '@angular/common/locales/en';
import zh from '@angular/common/locales/zh';
import { NgModule, LOCALE_ID, ErrorHandler } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WarningFill } from '@ant-design/icons-angular/icons';
import { EoNgFeedbackTooltipModule, EoNgFeedbackMessageModule } from 'eo-ng-feedback';
import { en_US, NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FeatureControlService } from 'pc/browser/src/app/core/services/feature-control/feature-control.service';
import { LanguageService } from 'pc/browser/src/app/core/services/language/language.service';
import { NotificationService } from 'pc/browser/src/app/core/services/notification.service';
import { ExtensionService } from 'pc/browser/src/app/services/extensions/extension.service';
import { GlobalProvider } from 'pc/browser/src/app/services/globalProvider';
import { IndexedDBStorage } from 'pc/browser/src/app/services/storage/IndexedDB/lib';
import { HttpStorage } from 'pc/browser/src/app/services/storage/http/lib';
import { BaseUrlInterceptor } from 'pc/browser/src/app/services/storage/http/lib/baseUrl.service';
import { APP_CONFIG } from 'pc/browser/src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TABLE_PRO_CONFIG } from './components/eo-ui/table-pro/table-pro.token';
import { PcConsoleModule } from './components/pc-console/pc-console.module';
import { GlobalErrorHandler } from './core/services/errorHandle.service';
import { ThemeService } from './core/services/theme/theme.service';
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
    PcConsoleModule,
    EoNgFeedbackMessageModule,
    NzIconModule.forRoot([WarningFill])
  ],
  providers: [
    MockService,
    ExtensionService,
    IndexedDBStorage,
    HttpStorage,
    ThemeService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: TABLE_PRO_CONFIG,
      useValue: {
        childKey: 'childList'
      }
    },
    {
      provide: '$scope',
      useFactory: i => i.get('$rootScope'),
      deps: ['$injector']
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
    private theme: ThemeService,
    private feature: FeatureControlService,
    private extensionService: ExtensionService,
    private notification: NotificationService
  ) {
    this.init();
  }
  async init() {
    //* Init language
    if (APP_CONFIG.production) {
      this.lang.init();
    }

    //* Init feature before extension install
    this.feature.init();

    //* Inject extension global data
    this.global.injectGlobalData();
    //* Init local mock server
    this.mockService.init();

    //* Init theme
    const promiseSystem = this.theme.initTheme();
    //* Init Extension
    await this.extensionService.init();
    this.theme.queryExtensionThemes();

    //*Reset theme after theme/extension theme loading
    Promise.all([promiseSystem]).then(() => {
      this.theme.afterAllThemeLoad();
    });

    //* Init notification
    this.notification.init();
  }
}
