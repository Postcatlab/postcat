import { Component } from '@angular/core';
import { EoNgFeedbackDrawerService } from 'eo-ng-feedback';
import { StoreService } from 'pc/browser/src/app/store/state.service';

@Component({
  selector: 'eo-workspace',
  template: `<router-outlet *ngIf="store.getCurrentWorkspace?.workSpaceUuid"></router-outlet>`,
  styles: []
})
export class WorkspaceComponent {
  constructor(public store: StoreService) {}
}
