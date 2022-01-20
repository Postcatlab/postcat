import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { TabItem } from './tab.model';
import { ApiTabService } from './api-tab.service';
import { filter } from 'rxjs';
@Component({
  selector: 'eo-api-tab',
  templateUrl: './api-tab.component.html',
  styleUrls: ['./api-tab.component.scss'],
})
export class ApiTabComponent implements OnInit, OnChanges {
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

  constructor(private router: Router, private route: ActivatedRoute, private tabSerive: ApiTabService) {}

  ngOnInit(): void {
    this.watchChangeRouter();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.apiDataItems && changes.apiDataItems.currentValue) {
      this.initTab();
    }
  }
  /**
   * path change
   */
  watchChangeRouter() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.id = Number(this.route.snapshot.queryParams.uuid);
      if (!this.id) return;
      console.log('watchChangeRouter', this.tabs[this.selectedIndex]);
      this.tabs[this.selectedIndex] = Object.assign(
        {
          uuid: this.tabs[this.selectedIndex].uuid,
        },
        this.getTabInfoByID(this.id)
      );
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
    this.id = Number(this.route.snapshot.queryParams.uuid);
    if (this.id) {
      let apiHasDelete = !this.apiDataItems[this.id];
      if (apiHasDelete) {
        this.closeTab({ index: this.selectedIndex });
        return;
      }
      const tab = this.getTabInfoByID(this.id);
      this.appendTab('unset', tab);
    } else {
      let module = Object.keys(this.defaultTabs).find((keyName) =>
        this.router.url.split('?')[0].includes(this.defaultTabs[keyName].path)
      );
      this.appendTab(module,this.route.snapshot.queryParams);
    }
  }
  /**
   * Push new tab.
   *
   * @param tab TabItem
   */
  appendTab(which = 'test', apiData = {}): void {
    let tab: TabItem = Object.assign(
      {
        uuid: new Date().getTime(),
      },
      which === 'unset' ? {} : this.defaultTabs[which],
      apiData
    );
    let existTabIndex = this.tabs.findIndex((val) => val.key === tab.key);
    if (tab.key && existTabIndex !== -1) {
      this.selectedIndex = existTabIndex;
      return;
    }
    let hasTab = this.tabs.length > 0;
    this.tabs.push(tab);
    if (hasTab) {
      this.selectedIndex = this.tabs.length - 1;
    } else {
      this.switchTab();
    }
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
   * @param {TabItem} inArg.tab
   * @param inArg.index
   */
  switchTab() {
    let tab = this.tabs[this.selectedIndex];
    this.tabSerive.tabChange$.next(tab);
    this.activeRoute(tab);
  }

  /**
   * Action new tab route.
   *
   * @param tab
   */
  private activeRoute(tab) {
    this.router
      .navigate([tab.path], {
        queryParams: { uuid: tab.key, groupID: tab.groupID, projectID: tab.projectID },
      })
      .finally();
  }

  private getTabInfoByID(id) {
    const result = {
      path: this.router.url.split('?')[0],
      title: this.apiDataItems[id].name,
      method: this.apiDataItems[id].method,
      key: this.apiDataItems[id].uuid,
    };
    return result;
  }
}
