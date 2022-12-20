import { Component, OnInit } from '@angular/core';
import { autorun } from 'mobx';

import { StoreService } from '../../../shared/store/state.service';

@Component({
  selector: 'eo-nav-breadcrumb',
  templateUrl: './nav-breadcrumb.component.html',
  styleUrls: ['./nav-breadcrumb.component.scss']
})
export class NavBreadcrumbComponent {
  projectName: string;
  projectID;
  workspaceID;
  constructor(private store: StoreService) {
    autorun(() => {
      this.projectName = this.store.getCurrentProject.name;
      this.projectID = this.store.getCurrentProject.uuid;
      this.workspaceID = this.store.getCurrentWorkspaceID;
    });
  }
}
