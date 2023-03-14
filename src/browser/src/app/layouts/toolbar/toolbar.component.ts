import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeatureControlService } from 'pc/browser/src/app/core/services/feature-control/feature-control.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ChatRobotService } from '../../components/chat-robot/chat-robot.service';
import { SystemSettingComponent } from '../../components/system-setting/system-setting.component';
import { ModalService } from '../../services/modal.service';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'eo-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnDestroy {
  hideSidebar = $localize`Hide Sidebar`;
  showSidebar = $localize`Show Sidebar`;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    public sidebar: SidebarService,
    private modal: ModalService,
    private chat: ChatRobotService,
    public feature: FeatureControlService
  ) {}
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
  openRobot() {
    this.chat.open();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
