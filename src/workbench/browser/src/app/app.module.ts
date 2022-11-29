import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Other module
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { IndexedDBStorage } from 'eo/workbench/browser/src/app/shared/services/storage/IndexedDB/lib/';
import { HttpStorage } from 'eo/workbench/browser/src/app/shared/services/storage/http/lib';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BaseUrlInterceptor } from 'eo/workbench/browser/src/app/shared/services/storage/http/lib/baseUrl.service';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';
import { MockService } from './services/mock.service';

//I18n
import { ExtensionService } from 'eo/workbench/browser/src/app/pages/extension/extension.service';
import { registerLocaleData } from '@angular/common';
import { en_US, NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import zh from '@angular/common/locales/zh';

import { EoNgFeedbackMessageModule } from 'eo-ng-feedback';
import { ThemeService } from './core/services/theme.service';

import { NzConfig, NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { NzOverlayModule } from 'ng-zorro-antd/core/overlay';
registerLocaleData(en);
registerLocaleData(zh);

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    EoNgFeedbackMessageModule,
    BrowserAnimationsModule,
    CoreModule,
    AppRoutingModule,
  ],
  providers: [
    MockService,
    ExtensionService,
    StorageService,
    IndexedDBStorage,
    HttpStorage,
    ThemeService,
    NzModalService,
    {
      provide: NZ_CONFIG,
      useFactory: (theme): NzConfig => ({
        theme: theme.DESIGN_TOKEN,
      }),
      deps: [ThemeService],
    },
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
  schemas: [],
})
export class AppModule {
  constructor(private lang: LanguageService, private mockService: MockService) {
    this.mockService.init();
    if (APP_CONFIG.production) {
      this.lang.init();
    }
  }
}
