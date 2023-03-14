import { Component } from '@angular/core';
import { autorun } from 'mobx';

import { StoreService } from '../../../store/state.service';

@Component({
  selector: 'eo-nav-breadcrumb',
  templateUrl: './nav-breadcrumb.component.html',
  styleUrls: ['./nav-breadcrumb.component.scss']
})
export class NavBreadcrumbComponent {
  level: 'project' | 'workspace';
  projectName: string = 'Default';
  projectID;
  workspaceID;
  constructor(public store: StoreService) {
    autorun(() => {
      if (this.store.getCurrentProject?.name) {
        this.projectName = this.store.getCurrentProject.name;
        this.projectID = this.store.getCurrentProject.projectUuid;
      }
      this.workspaceID = this.store.getCurrentWorkspaceUuid;
    });
  }
}
