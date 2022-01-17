import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { TabItem } from './tab.model';

@Component({
  selector: 'eo-api-tab',
  templateUrl: './api-tab.component.html',
  styleUrls: ['./api-tab.component.scss'],
})
export class ApiTabComponent implements OnInit {
  @Input() apiDataItems;
  id: number;
  /**
   * Tab items.
   */
  tabs: Array<TabItem> = [];

  /**
   * Current selected tab index.
   */
  selectedIndex: number;
  /**
   * Default tabs of api.
   */
  defaultTabs = {
    edit: { path: '/home/api/edit', title: '新 API' },
    test: { path: '/home/api/test', title: '新 API' },
    detail: { path: '/home/api/detail', title: 'API 详情' },
  };

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.watchChangeRouter();
  }
  /**
   * Get current path to update tab
   */
  watchChangeRouter() {
    this.id = Number(this.route.snapshot.queryParams.uuid);
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.id = Number(this.route.snapshot.queryParams.uuid);
      this.tabs[this.selectedIndex] = this.getApiTabByID(this.id);
      //do something
    });
  }
  /**
   * Create a new tab.
   */
  newTab(): void {
    this.appendTab('test');
  }
  /**
   * Init tab data after load or update.
   */
  initTab() {
    if (!this.apiDataItems[this.id]) {
      this.appendTab('test');
      return;
    }
    const tab = this.getApiTabByID(this.id);
    this.tabs[this.selectedIndex] = tab;
  }
  /**
   * Push new tab.
   *
   * @param tab TabItem
   */
  appendTab(which = 'test', apiData = {}): void {
    let tab: TabItem = Object.assign({}, this.defaultTabs[which], apiData);
    this.tabs.push(tab);
    this.selectedIndex = this.tabs.length - 1;
    this.activeRoute(tab);
  }
  /**
   * Close current tab.
   *
   * @param index number
   */
  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index, 1);
    if (0 === this.tabs.length) {
      this.newTab();
    }
  }
  /**
   * Switch the tab.
   *
   * @param tab
   */
  tabSelect(tab) {
    this.activeRoute(tab);
  }

  /**
   * Action new tab route.
   *
   * @param tab
   */
  activeRoute(tab) {
    this.router
      .navigate([tab.path], { queryParams: { uuid: tab.key, groupID: tab.groupID, projectID: tab.projectID } })
      .finally();
  }
  /**
   * Remove api data tabs.
   *
   * @param uuids Array<string|number>
   */
  removeApiDataTabs(uuids: Array<string | number>): void {
    const items = [];
    this.tabs.forEach((tab: TabItem, index: number) => {
      if (uuids.indexOf(tab.key)) {
        items.push({ index });
      }
    });
    items.reverse().forEach((item) => {
      this.closeTab(item);
    });
  }
  private getApiTabByID(id) {
    const result = {
      path: this.router.url.split('?')[0],
      title: this.apiDataItems[id].name,
      method: this.apiDataItems[id].method,
      key: this.apiDataItems[id].uuid,
    };
    return result;
  }
}
