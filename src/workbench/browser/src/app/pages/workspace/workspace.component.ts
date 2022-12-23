import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { makeObservable, observable } from 'mobx';

import { EffectService } from '../../shared/store/effect.service';

@Component({
  selector: 'eo-workspace',
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class WorkspaceComponent implements OnInit {
  @observable projectList;
  constructor(private store: StoreService, private effect: EffectService, private route: ActivatedRoute) {
    const pid = Number(this.route.snapshot.queryParams.pid);
    const wid = Number(this.route.snapshot.queryParams.wid);
    if (this.store.getCurrentWorkspaceID !== wid) {
      this.effect.changeWorkspace(wid);
      this.store.setCurrentProjectID(pid);
    } else if (this.store.getCurrentProjectID !== pid && pid) {
      this.effect.changeProject(pid);
    }
  }

  ngOnInit(): void {
    makeObservable(this);
    this.projectList = this.store.getProjectList;
  }
}
