import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { autorun, makeObservable, observable } from 'mobx';

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
    autorun(() => {
      if (this.projectList.length === 0) {
        this.router.navigate(['/home/workspace/project/list']);
      }
    });
  }
}
