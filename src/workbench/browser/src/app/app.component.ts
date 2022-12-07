import { Component } from '@angular/core';
import { ThemeService } from './core/services';
import { WebExtensionService } from 'eo/workbench/browser/src/app/shared/services/web-extension/webExtension.service';
import { GlobalProvider } from 'eo/workbench/browser/src/app/shared/components/extension-app/globalProvider';
import { ExtensionService } from 'eo/workbench/browser/src/app/pages/extension/extension.service';

@Component({
  selector: 'eo-root',
  template: `
    <eo-message></eo-message>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  constructor(
    private theme: ThemeService,
    private webExtensionService: WebExtensionService,
    private extensionService: ExtensionService,
    private globalProvider: GlobalProvider
  ) {
    this.theme.changeTheme();
    this.globalProvider.injectGlobalData();
    this.webExtensionService.init();
    this.extensionService.init();
  }
}
