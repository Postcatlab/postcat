import { Component } from '@angular/core';
import { EoNgFeedbackDrawerService } from 'eo-ng-feedback';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

@Component({
  selector: 'eo-workspace',
  template: `<router-outlet *ngIf="store.getCurrentWorkspace?.workSpaceUuid"></router-outlet>`,
  styles: []
})
export class WorkspaceComponent {
  constructor(public store: StoreService) {}
}
