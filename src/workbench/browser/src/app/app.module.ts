import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
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
    NgxsModule.forRoot([EnvState]),
  ],
  providers: [
    MessageService,
    IndexedDBStorage,
    HttpStorage,
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
