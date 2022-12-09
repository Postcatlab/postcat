import { Component, OnInit, OnDestroy } from '@angular/core';
import { EoNgFeedbackDrawerService } from 'eo-ng-feedback';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SettingComponent } from '../../modules/setting/setting.component';
import { ModalService } from '../../shared/services/modal.service';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'eo-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  sideBarCollapsed: boolean;
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
      nzClassName: 'eo-setting-modal',
      nzContent: SettingComponent,
      nzComponentParams: {
        selectedModule: 'eoapi-theme'
      },
      nzFooter: null
    });
  }
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
