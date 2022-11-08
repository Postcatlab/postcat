import { Component } from '@angular/core';
import { ThemeService } from './core/services';
import { WebExtensionService } from 'eo/workbench/browser/src/app/shared/services/web-extension/webExtension.service';
import { ModalService } from 'eo/workbench/browser/src/app/shared/services/modal.service';
import { NavigationExtras, Router } from '@angular/router';

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
    private modalService: ModalService,
    private router: Router
  ) {
    this.webExtensionService.init();
    this.theme.changeTheme();
    this.injectGlobalData();
  }

  injectGlobalData() {
    window.eo.modalService = this.modalService;
    window.eo.navigate = (commands: any[], extras?: NavigationExtras) => {
      setTimeout(() => {
        this.router.navigate(commands, extras);
      });
    };
    // window.eo.getConfiguration = this.modalService;
  }
}
