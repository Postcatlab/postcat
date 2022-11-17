import { Injectable } from '@angular/core';
import { ModalService } from 'eo/workbench/browser/src/app/shared/services/modal.service';
import { NavigationExtras, Router } from '@angular/router';
import { SettingService } from 'eo/workbench/browser/src/app/core/services/settings/settings.service';
import { WebExtensionService } from 'eo/workbench/browser/src/app/shared/services/web-extension/webExtension.service';

@Injectable({ providedIn: 'root' })
export class GlobalProvider {
  constructor(
    private modalService: ModalService,
    private router: Router,
    private settingService: SettingService,
    private webExtensionService: WebExtensionService
  ) {}

  injectGlobalData() {
    window.eo ??= {};
    window.eo.modalService = this.modalService;
    window.eo.getExtensionSettings = this.settingService.getConfiguration;
    window.eo.loadFeatureModule ??= this.webExtensionService.importModule;
    window.eo.navigate = (commands: any[], extras?: NavigationExtras) => {
      this.router.navigate(commands, extras);
    };
    // window.eo.getConfiguration = this.modalService;
  }
}
