import { Component, OnInit, OnDestroy } from '@angular/core';
import { SidebarService } from '../sidebar/sidebar.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'eo-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  showThemeDrawer: boolean = false;
  sideBarCollapsed: boolean;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(private sidebar: SidebarService) {
    this.sideBarCollapsed = this.sidebar.getCollapsed();
    this.sidebar
      .onCollapsedChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isCollapsed) => {
        this.sideBarCollapsed = isCollapsed;
      });
  }
  toggleCollapsed() {
    this.sidebar.toggleCollapsed();
  }
  changeTheme() {
    this.showThemeDrawer = true;
  }
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
