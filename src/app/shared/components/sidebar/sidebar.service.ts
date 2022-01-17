import { Injectable } from '@angular/core';


import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  collapsed = false;
  private collapsedChange$ = new Subject();
  constructor() {}
  getCollapsed() {
    return this.collapsed;
  }
  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.collapsedChange$.next(this.collapsed);
  }
  onCollapsedChange = function() {
    return this.collapsedChange$.pipe();
  };
}
