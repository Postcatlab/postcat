import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiTabStorageService } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab-storage.service';
import { BasicTab, TabItem } from 'eo/workbench/browser/src/app/pages/api/tab/tab.model';
import { filter } from 'rxjs';
/**
 * Api tab service operate tabs array add/replace/close...
 * Tab change by  url change(router event)
 */
@Injectable()
export class ApiTabOperateService {
  /**
   * Current selected tab index.
   */
  selectedIndex = 0;
  tabs: Array<TabItem> = [];
  /**
   * Tab basic info
   */
  BASIC_TABS: { [key: string]: BasicTab };
  constructor(private tabStorage: ApiTabStorageService, private router: Router) {
    this.BASIC_TABS = {
      test: { pathname: '/home/api/test', type: 'edit', title: $localize`New API` },
      edit: { pathname: '/home/api/edit', type: 'edit', title: $localize`New API` },
      detail: { pathname: '/home/api/detail', type: 'preview', title: $localize`:@@API Detail:Preview` },
      overview: {
        pathname: '/home/api/overview',
        type: 'preview',
        title: $localize`:@@API Index:Index`,
      },
      mock: { pathname: '/home/api/mock', type: 'preview', title: 'Mock' },
    };
    this.init();
    this.watchRouterChange();
  }

  /**
   * Add Default tab
   *
   * @returns tabItem
   */
  newDefaultTab() {
    const tabItem: TabItem = this.getTabFromUrl(this.BASIC_TABS.test.pathname);
    this.tabs.push(tabItem);
    //If selectIndex no change,manually change tab content url
    //Because if selectIndex change,tab component will call navigateTabRoute automatically
    if (this.selectedIndex === this.tabs.length - 1) {
      this.navigateTabRoute(tabItem);
      return;
    }
    this.selectedIndex = this.tabs.length - 1;
  }

  close(index) {
    this.tabStorage.remove(this.tabs[index].uuid);
    // If tab is last one,selectIndex will be change by component itself;
    this.tabs.splice(index, 1);

    if (this.tabs.length === 0) {
      this.newDefaultTab();
    }
  }
  batchClose(ids){

  }
  /**
   * Navigate  url to tab route
   *
   * @param tab
   */
  navigateTabRoute(tab: TabItem) {
    this.router.navigate([tab.pathname], {
      queryParams: { pageID: tab.uuid, ...tab.params },
    });
  }
  /**
   * Operate tab after router change,router triggle tab change
   * Such as new tab,pick tab,close tab...
   */
  private operateTabAfterRouteChange(res: { url: string }) {
    const tmpTabItem = this.getTabFromUrl(res.url);

    //Pick current router url as the first tab
    if (this.tabs.length === 0) {
      this.tabs.push(tmpTabItem);
      return;
    }
    //If exist tab,select that tab
    const existTabIndex = this.tabs.findIndex((val) => val.uuid === tmpTabItem.params.pageID);
    //Router has focus current tab
    if (this.selectedIndex === existTabIndex) {
      return;
    }
    //Pick tab
    if (existTabIndex !== -1) {
      this.selectedIndex = existTabIndex;
      return;
    }
    //If no exist,new tab or replace origin tab
    this.newOrReplaceTab(tmpTabItem);
  }
  /**
   * New or replace current tab
   * Avoid open too much tab,if tab[type==='preview'] or tab[type==='edit'] with no change,replace page in current tab
   *
   * @param tabItem tab need to be add
   */
  private newOrReplaceTab(tabItem) {
    const currentTab = this.tabs[this.selectedIndex];
    if (currentTab.type === 'preview' || (currentTab.type === 'edit' && !currentTab.hasChanged)) {
      this.tabs[this.selectedIndex] = tabItem;
      //If selectedIndex not change,need manual call selectTab to change content
      this.navigateTabRoute(tabItem);
    } else {
      this.tabs.push(currentTab);
    }
  }
  private watchRouterChange() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((res: NavigationEnd) => {
      this.operateTabAfterRouteChange(res);
    });
  }
  /**
   * Get tab info from url
   *
   * @param url
   * @returns tabInfo
   */
  private getTabFromUrl(url): TabItem {
    const urlArr = url.split('?');
    const params: any = {};
    const basicTab = Object.values(this.BASIC_TABS).find((val) => val.pathname === urlArr[0]);
    // Parse query params
    new URLSearchParams(urlArr[1]).forEach((value, key) => {
      if (key === 'pageID') {
        params[key] = Number(value);
        return;
      }
      params[key] = value;
    });
    const result = {
      uuid: Date.now(),
      pathname: urlArr[0],
      params,
      title: basicTab.title,
      type: basicTab.type,
    };
    return result;
  }
  //Init tab info
  //Maybe from tab cache info or router url
  private init() {
    this.operateTabAfterRouteChange({
      url: window.location.pathname + window.location.search,
    });
  }
}
