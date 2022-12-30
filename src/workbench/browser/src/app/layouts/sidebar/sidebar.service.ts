import { Injectable } from '@angular/core';
import { ModuleInfo } from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { Subject } from 'rxjs';

import StorageUtil from '../../utils/storage/Storage';
import { SidebarModuleInfo } from './sidebar.model';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  collapsed = false;
  visible = true;
  private selectKey = 'side_bar_selected';
  currentID: string = StorageUtil.get(this.selectKey);
  private collapsedChanged$: Subject<boolean> = new Subject();
  constructor() {}
  getCollapsed() {
    return this.collapsed;
  }
  setModule(module) {
    this.currentID = module;
    StorageUtil.set(this.selectKey, module.id);
  }
  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.collapsedChanged$.next(this.collapsed);
  }
  onCollapsedChanged = function () {
    return this.collapsedChanged$.pipe();
  };
}
