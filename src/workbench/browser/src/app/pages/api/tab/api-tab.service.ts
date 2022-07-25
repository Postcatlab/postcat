import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiTabStorageService } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab-storage.service';
import { TabItem } from 'eo/workbench/browser/src/app/pages/api/tab/tab.model';
import { Message, MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { filter } from 'rxjs';

@Injectable()
export class ApiTabService {
  /**
   * Current selected tab index.
   */
  selectedIndex = 0;
  tabs: Array<TabItem> = [];
  /**
   * Tab basic info
   */
  BASIC_TABS = {
    edit: { pathname: '/home/api/edit', type: 'edit', title: $localize`New API` },
    test: { pathname: '/home/api/test', type: 'edit', title: $localize`New API` },
    detail: { pathname: '/home/api/detail', type: 'preview', title: $localize`:@@API Detail:Preview` },
    overview: {
      pathname: '/home/api/overview',
      type: 'preview',
      title: $localize`:@@API Index:Index`,
      key: 'overview',
    },
    mock: { pathname: '/home/api/mock', type: 'preview', title: 'Mock', key: 'mock' },
  };
  constructor(
    private apiTabStorage: ApiTabStorageService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.operateTabAfterRouteChange();
  }
  /**
   * Add first default tab
   */
  addDefaultTab() {
    this.tabs.push(
      Object.assign(
        {
          uuid: new Date().getTime(),
          params: {},
          extends: {
            method: 'POST',
          },
        },
        this.BASIC_TABS.test
      )
    );
    this.selectedIndex = this.tabs.length - 1;
  }
  /**
   * Operate tab after router change,router triggle tab change
   * Such as new tab,pick tab,close tab...
   */
  operateTabAfterRouteChange() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((res: any) => {
      console.log('api tab service:', res);
      let tab = this.getTabFromUrl(res.url);
      //If exist tab,select that tab
      let existTabIndex = this.tabs.findIndex((val) => val.uuid === tab.params.pageID);
      if (existTabIndex !== -1 && this.selectedIndex !== existTabIndex) {
        this.selectedIndex = existTabIndex;
        return;
      }
      //Add tab or replace tab
      //Avoid open too much tab,if tab[type==='preview'] or tab[type==='edit'] with no change,replace page in current tab
      let currentTab = this.tabs[this.selectedIndex];
      console.log(currentTab, this.tabs, this.selectedIndex);
      if (currentTab.type === 'preview' || (currentTab.type === 'edit' && !currentTab.hasChanged)) {
        this.tabs[this.selectedIndex] = tab;
        //  this.selectTab(tab);
      }
    });
  }
  /**
   * Operate tab from api change which router no change
   * Such as delete api
   */
  operateTabAfterApiChange() {
    this.messageService.get().subscribe((inArg: Message) => {
      switch (inArg.type) {
        case 'deleteApiSuccess': {
          break;
        }
        case 'bulkDeleteApiSuccess': {
          break;
        }
      }
    });
  }
  selectTab(tab: TabItem) {
    this.router
      .navigate([tab.pathname], {
        queryParams: { pageID: tab.uuid, ...tab.params },
      })
      .finally();
  }
  closeTab(index) {
    this.apiTabStorage.remove(this.tabs[index].uuid);
    // If tab is last one,selectIndex will be change by component itself;
    this.tabs.splice(index, 1);
  }
  private getTabFromUrl(url): TabItem {
    const urlArr = url.split('?');
    const params = {};
    const basicTab = Object.values(this.BASIC_TABS).find((val) => val.pathname === urlArr[0]);
    new URLSearchParams(urlArr[1]).forEach((value, key) => (params[key] = value));
    const result = {
      uuid: new Date().getTime(),
      pathname: urlArr[0],
      params: params,
      title: basicTab.title,
      type: basicTab.type,
    };
    return result;
  }
}
