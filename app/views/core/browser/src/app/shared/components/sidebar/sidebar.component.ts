import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { SidebarService } from './sidebar.service';
@Component({
  selector: 'eo-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  isCollapsed: boolean;
  destroy = false;
  constructor(private sidebar: SidebarService) {
    this.isCollapsed = this.sidebar.getCollapsed();
    this.sidebar
      .onCollapsedChange()
      .pipe(takeWhile(() => !this.destroy))
      .subscribe((isCollapsed) => {
        this.isCollapsed = isCollapsed;
      });
  }
  toggleCollapsed(): void {
    this.sidebar.toggleCollapsed();
  }
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.destroy = true;
  }
}
