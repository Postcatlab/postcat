import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SystemSettingComponent } from '../../modules/system-setting/system-setting.component';
import { ModalService } from '../../shared/services/modal.service';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'eo-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnDestroy {
  sideBarCollapsed: boolean;
  hideSidebar = $localize`Hide Sidebar`;
  showSidebar = $localize`Show Sidebar`;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(public sidebar: SidebarService, private modal: ModalService) {
    this.sideBarCollapsed = this.sidebar.getCollapsed();
    this.sidebar
      .onCollapsedChanged()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isCollapsed => {
        this.sideBarCollapsed = isCollapsed;
      });
  }
  toggleCollapsed() {
    this.sidebar.toggleCollapsed();
  }
  changeTheme() {
    const ref = this.modal.create({
      nzClassName: 'eo-system-setting-modal',
      nzTitle: $localize`Settings`,
      nzContent: SystemSettingComponent,
      nzComponentParams: {
        selectedModule: 'theme'
      },
      withoutFooter: true
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
