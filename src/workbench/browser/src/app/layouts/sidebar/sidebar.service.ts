import { Injectable } from '@angular/core';
import { ModuleInfo } from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { Subject } from 'rxjs';

import { SidebarModuleInfo } from './sidebar.model';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  collapsed = false;
  sidebarShow = true;
  currentModule: ModuleInfo | SidebarModuleInfo | any;
  private collapsedChanged$: Subject<boolean> = new Subject();
  constructor() {}
  getCollapsed() {
    return this.collapsed;
  }
  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.collapsedChanged$.next(this.collapsed);
  }
  onCollapsedChanged = function () {
    return this.collapsedChanged$.pipe();
  };
}
