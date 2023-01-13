import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

import { EffectService } from '../../shared/store/effect.service';

@Component({
  selector: 'eo-workspace',
  template: `<router-outlet *ngIf="storeService.getCurrentWorkspace?.workSpaceUuid"></router-outlet>`,
  styles: []
})
export class WorkspaceComponent implements OnInit {
  hasWorkspace = false;

  constructor(private effect: EffectService, private route: ActivatedRoute, public storeService: StoreService) {}

  async ngOnInit() {
    const pid = this.route.snapshot.queryParams.pid;
    const wid = this.route.snapshot.queryParams.wid;
    if (this.storeService.getCurrentWorkspaceUuid !== wid) {
      this.effect.changeWorkspace(wid);
      this.storeService.setCurrentProjectID(pid);
    } else if (this.storeService.getCurrentProjectID !== pid && pid) {
      this.effect.changeProject(pid);
    }
  }
}
