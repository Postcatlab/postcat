import { Component, OnInit, OnDestroy } from '@angular/core';
import { EoNgFeedbackDrawerService } from 'eo-ng-feedback';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SelectThemeComponent } from '../../modules/setting/common/select-theme/select-theme.component';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'eo-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  sideBarCollapsed: boolean;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(public sidebar: SidebarService, private drawerService: EoNgFeedbackDrawerService) {
    this.sideBarCollapsed = this.sidebar.getCollapsed();
    this.sidebar
      .onCollapsedChanged()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isCollapsed) => {
        this.sideBarCollapsed = isCollapsed;
      });
  }
  toggleCollapsed() {
    this.sidebar.toggleCollapsed();
  }
  changeTheme() {
    // this.drawerService.create({
    //   nzTitle: 'Theme',
    //   nzSize: 'default',
    //   nzContent: SelectThemeComponent,
    // });
  }
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
