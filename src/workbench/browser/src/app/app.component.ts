import { Component } from '@angular/core';
import { ExtensionService } from 'eo/workbench/browser/src/app/pages/extension/extension.service';
import { GlobalProvider } from 'eo/workbench/browser/src/app/shared/services/globalProvider';
import { WebExtensionService } from 'eo/workbench/browser/src/app/shared/services/web-extension/webExtension.service';

@Component({
  selector: 'eo-root',
  template: ` <router-outlet></router-outlet> `
})
export class AppComponent {
  constructor(
    private webExtensionService: WebExtensionService,
    private extensionService: ExtensionService,
    private globalProvider: GlobalProvider
  ) {
    this.globalProvider.injectGlobalData();
    this.webExtensionService.init();
    this.extensionService.init();
  }
}
