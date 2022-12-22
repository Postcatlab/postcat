import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { autorun } from 'mobx';
import { filter } from 'rxjs';

import { StoreService } from '../../../shared/store/state.service';

@Component({
  selector: 'eo-nav-breadcrumb',
  templateUrl: './nav-breadcrumb.component.html',
  styleUrls: ['./nav-breadcrumb.component.scss']
})
export class NavBreadcrumbComponent implements OnDestroy {
  level: 'project' | 'workspace';
  projectName: string;
  projectID;
  workspaceID;
  private routerSubscribe;
  constructor(private store: StoreService, private router: Router) {
    this.watchRouterChange();
    autorun(() => {
      if (this.store.getCurrentProject.name) {
        this.projectName = this.store.getCurrentProject.name;
        this.projectID = this.store.getCurrentProject.uuid;
      }
      this.workspaceID = this.store.getCurrentWorkspaceID;
    });
  }
  watchRouterChange() {
    this.routerSubscribe = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((res: any) => {
      if (['/home/workspace/project/list'].some(val => this.router.url.includes(val))) {
        this.level = 'workspace';
      } else {
        this.level = 'project';
      }
    });
  }
  ngOnDestroy() {
    this.routerSubscribe?.unsubscribe();
  }
}
