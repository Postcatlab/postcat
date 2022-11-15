import { Injectable } from '@angular/core';
import { ModalService } from 'eo/workbench/browser/src/app/shared/services/modal.service';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class GlobalProvider {
  constructor(private modalService: ModalService, private router: Router) {}

  injectGlobalData() {
    window.eo ??= {};
    window.eo.modalService = this.modalService;
    window.eo.navigate = (commands: any[], extras?: NavigationExtras) => {
      this.router.navigate(commands, extras);
    };
    // window.eo.getConfiguration = this.modalService;
  }
}
