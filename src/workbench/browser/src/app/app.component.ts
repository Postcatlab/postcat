import { Component } from '@angular/core';
import { WebExtensionService } from 'eo/workbench/browser/src/app/shared/services/web-extension/webExtension.service';
import { GlobalProvider } from 'eo/workbench/browser/src/app/shared/services/globalProvider';

@Component({
  selector: 'eo-root',
  template: ` <router-outlet></router-outlet> `,
})
export class AppComponent {
  constructor(
    private webExtensionService: WebExtensionService,
    private globalProvider: GlobalProvider
  ) {
    this.webExtensionService.init();
    this.globalProvider.injectGlobalData();
  }
}
