import { Component } from '@angular/core';
import {  ThemeService } from './core/services';
import { WebExtensionService } from 'eo/workbench/browser/src/app/shared/services/web-extension/webExtension.service';

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
    private webExtensionService: WebExtensionService
  ) {
    this.webExtensionService.init();
    this.theme.changeTheme();
  }
}
