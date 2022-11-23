import { Component } from '@angular/core';
import { ThemeService } from './core/services';
import { WebExtensionService } from 'eo/workbench/browser/src/app/shared/services/web-extension/webExtension.service';
import { GlobalProvider } from 'eo/workbench/browser/src/app/shared/components/extension-app/globalProvider';

@Component({
  selector: 'eo-root',
  template: ` <router-outlet></router-outlet> `,
})
export class AppComponent {
  constructor(
    private theme: ThemeService,
    private webExtensionService: WebExtensionService,
    private globalProvider: GlobalProvider
  ) {
    this.webExtensionService.init();
    this.theme.changeTheme();
    this.globalProvider.injectGlobalData();
  }
}
