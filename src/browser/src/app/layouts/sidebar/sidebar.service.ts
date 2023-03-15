import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { SettingService } from '../../components/system-setting/settings.service';
import StorageUtil from '../../shared/utils/storage/storage.utils';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  collapsed;
  visible = true;
  private selectKey = 'side_bar_selected';
  currentID: string = StorageUtil.get(this.selectKey);
  private collapsedChanged$: Subject<boolean> = new Subject();
  constructor(private setting: SettingService) {
    this.collapsed = this.setting.get('workbench.sidebar.shrink');
  }
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
    this.setting.set('workbench.sidebar.shrink', this.collapsed);
  }
  onCollapsedChanged = function () {
    return this.collapsedChanged$.pipe();
  };
}
