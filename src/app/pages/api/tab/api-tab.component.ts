import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { TabItem } from './tab.model';
import { ApiTabService } from './api-tab.service';
import { filter, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'eo-api-tab',
  templateUrl: './api-tab.component.html',
  styleUrls: ['./api-tab.component.scss'],
})
export class ApiTabComponent implements OnInit, OnChanges, OnDestroy {
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
  MAX_LIMIT = 15;

  private destroy$: Subject<void> = new Subject<void>();
  constructor(private router: Router, private route: ActivatedRoute, private tabSerive: ApiTabService) {}

  ngOnInit(): void {
    this.watchApiAction();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.apiDataItems && !changes.apiDataItems.previousValue && changes.apiDataItems.currentValue) {
      this.initTab();
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
    let apiID = Number(this.route.snapshot.queryParams.uuid);
    if (apiID) {
      let hasApiExist = this.apiDataItems[apiID];
      if (!hasApiExist) {
        this.closeTab({ index: this.selectedIndex });
        return;
      }
      const tab = this.getTabInfo({
        id: apiID,
      });
      this.appendTab('unset', tab);
    } else {
      let module = Object.keys(this.defaultTabs).find((keyName) =>
        this.router.url.split('?')[0].includes(this.defaultTabs[keyName].path)
      );
      this.appendTab(module, this.route.snapshot.queryParams);
    }
  }
  /**
   * Push new tab.
   *
   * @param tab TabItem
   */
  appendTab(which = 'test', apiData: any = {}): void {
    if (this.tabs.length >= this.MAX_LIMIT) return;
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
      if (this.tabs[existTabIndex].path !== tab.path) {
        //exist api(same tab) change page
        this.tabs[existTabIndex].path = tab.path;
        this.switchTab();
      }
      return;
    }
    this.tabs.push(tab);
    // if index no change,manual change  reflesh content
    if (this.selectedIndex === this.tabs.length - 1) {
      this.switchTab();
      return;
    }
    this.selectedIndex = this.tabs.length - 1;
  }
  /**
   * Remove api data tabs.
   *
   * @param uuids Array<string|number>
   */
  removeApiDataTabs(uuids: Array<string | number>): void {
    const items = [];
    this.tabs.forEach((tab: TabItem, index: number) => {
      if (uuids.includes(tab.key)) {
        items.push({ index });
      }
    });
    items.reverse().forEach((item) => {
      this.closeTab(item);
    });
  }
  /**
   * Close Tab and keep tab status
   *
   * @param index number
   */
  closeTab({ index }: { index: number }): void {
    if (this.tabs[index]) {
      this.tabSerive.removeData(this.tabs[index].uuid);
    }
    this.tabs.splice(index, 1);
    //no tab left
    if (0 === this.tabs.length) {
      this.newTab();
      return;
    }
    //selectedIndex no change
    if (this.selectedIndex < this.tabs.length) {
      this.switchTab();
    }
  }
  /**
   * router change after switch the tab or tab content
   * @param {TabItem} inArg.tab
   * @param inArg.index
   */
  switchTab() {
    let tab = this.tabs[this.selectedIndex];
    this.tabSerive.tabChange$.next(tab);
    this.activeRoute(tab);
  }
  /**
   * Api Operation triggle tab change
   */
  private watchApiAction() {
    this.tabSerive.apiEvent$.pipe(takeUntil(this.destroy$)).subscribe((inArg) => {
      console.log('watchApiAction', inArg);
      switch (inArg.action) {
        case 'newApiTest':
        case 'testApi':
          this.appendTab('test', inArg.data.origin);
          break;
        case 'detailApi':
          this.appendTab('detail', inArg.data.origin);
          break;
        case 'editApi':
          this.appendTab('edit', inArg.data.origin);
          break;
        case 'newApi':
          this.appendTab('edit', inArg.data ? { groupID: inArg.data.key } : {});
          break;
        case 'addApiFromTest': {
          this.changeCurrentTab(
            this.getTabInfo({
              path: this.defaultTabs['edit'].path,
              apiData: inArg.data,
            })
          );
          break;
        }
        case 'addApiFinish':
        case 'editApiFinish': {
          this.changeCurrentTab(
            this.getTabInfo({
              path: this.defaultTabs['detail'].path,
              apiData: inArg.data,
            })
          );
          this.switchTab();
          break;
        }
        case 'removeApiDataTabs': {
          this.removeApiDataTabs(inArg.data);
          break;
        }
        case 'beforeChangeRouter': {
          this.changeCurrentTab(
            this.getTabInfo({
              id: Number(this.route.snapshot.queryParams.uuid),
            })
          );
          break;
        }
      }
    });
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
  private changeCurrentTab(tabInfo) {
    this.tabs[this.selectedIndex] = Object.assign(this.tabs[this.selectedIndex], tabInfo);
  }
  /**
   * Get tab info by api id or api data
   * @param inArg.id exist api id
   * @param apiData tab content api data
   * @returns {TabItem}
   */
  private getTabInfo(inArg: { id?: number; apiData?: any; path?: string }) {
    let apiData = inArg.apiData || this.apiDataItems[inArg.id];
    const result = {
      path: inArg.path || this.router.url.split('?')[0],
      title: apiData.name,
      method: apiData.method,
      key: apiData.uuid,
    };
    return result;
  }
}
