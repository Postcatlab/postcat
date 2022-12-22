import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { makeObservable, observable } from 'mobx';

@Component({
  selector: 'eo-workspace',
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class WorkspaceComponent implements OnInit {
  @observable projectList;
  constructor(private store: StoreService, private router: Router) {}

  ngOnInit(): void {
    makeObservable(this);
    this.projectList = this.store.getProjectList;
  }
}
