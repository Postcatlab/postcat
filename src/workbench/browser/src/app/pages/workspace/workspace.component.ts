import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

import { EffectService } from '../../shared/store/effect.service';

import { debug } from 'console';

@Component({
  selector: 'eo-workspace',
  template: `<router-outlet *ngIf="store.getCurrentWorkspace?.workSpaceUuid"></router-outlet>`,
  styles: []
})
export class WorkspaceComponent implements OnInit {
  constructor(private effect: EffectService, private route: ActivatedRoute, public store: StoreService) {}

  async ngOnInit() {
    const { pid, wid } = this.route.snapshot.queryParams;
    if (this.store.getCurrentWorkspaceUuid !== wid) {
      this.effect.switchWorkspace(wid);
      this.store.setCurrentProjectID(pid);
      return;
    }
    if (this.store.getCurrentProjectID !== pid && pid) {
      this.effect.switchProject(pid);
    }
  }
}
