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
  selectedIndex: number = 0;
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
    this.id = Number(this.route.snapshot.queryParams.uuid);
    this.watchChangeRouter();
  }
  /**
   * Get current path to update tab
   */
  watchChangeRouter() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.id = Number(this.route.snapshot.queryParams.uuid);
      if (!this.id) return;
      this.tabs[this.selectedIndex] = this.getCurrentTabByID(this.id);
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
      this.closeTab({ index: this.selectedIndex });
      return;
    }
    let module = Object.keys(this.defaultTabs).find((keyName) =>
      this.router.url.split('?')[0].includes(this.defaultTabs[keyName].path)
    );
    const tab = this.getCurrentTabByID(this.id);
    if (this.tabs.length < 1) {
      this.appendTab(module, tab);
    } else {
      this.tabs[this.selectedIndex] = tab;
    }
  }
  /**
   * Push new tab.
   *
   * @param tab TabItem
   */
  appendTab(which = 'test', apiData = {}): void {
    let tab: TabItem = Object.assign({}, this.defaultTabs[which], apiData);
    let existTabIndex = this.tabs.findIndex((val) => val.key === tab.key);
    if (tab.key && existTabIndex !== -1) {
      this.tabSelect({ index: existTabIndex, tab: tab });
    } else {
      this.tabs.push(tab);
      this.tabSelect({ index: this.tabs.length - 1, tab: tab });
    }
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
   * @param {TabItem} inArg.tab
   * @param inArg.index
   */
  tabSelect(inArg) {
    this.selectedIndex = inArg.index;
    this.activeRoute(inArg.tab);
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
  private getCurrentTabByID(id) {
    const result = {
      path: this.router.url.split('?')[0],
      title: this.apiDataItems[id].name,
      method: this.apiDataItems[id].method,
      key: this.apiDataItems[id].uuid,
    };
    return result;
  }
}
