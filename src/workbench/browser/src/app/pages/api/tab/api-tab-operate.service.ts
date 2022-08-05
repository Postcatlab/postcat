import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiTabStorageService } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab-storage.service';
import { TabItem, TabOperate } from 'eo/workbench/browser/src/app/pages/api/tab/tab.model';
import { ModalService } from 'eo/workbench/browser/src/app/shared/services/modal.service';
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
  /**
   * Tab basic info
   */
  BASIC_TABS: { [key: string]: Partial<TabItem> };
  constructor(private tabStorage: ApiTabStorageService, private router: Router, private modal: ModalService) {}
  //Init tab info
  //Maybe from tab cache info or router url
  init(BASIC_TABS) {
    this.BASIC_TABS = BASIC_TABS;
    // const tabCache = this.tabStorage.getPersistenceStorage();
    // if (tabCache) {
    //   this.tabStorage.setTabs(tabCache.tabs);
    //   this.navigateTabRoute(tabCache.tabs[tabCache.selectIndex || 0]);
    // } else {
    this.operateTabAfterRouteChange({
      url: window.location.pathname + window.location.search,
    });
    // }
  }
  /**
   * Add Default tab
   *
   * @returns tabItem
   */
  newDefaultTab() {
    const tabItem: TabItem = this.getTabFromUrl(Object.values(this.BASIC_TABS)[0].pathname);
    this.tabStorage.addTab(tabItem);
    this.selectedIndex = this.tabStorage.tabOrder.length - 1;
  }

  closeTab(index: number) {
    // If tab is last one,selectIndex will be change by component itself;
    this.tabStorage.closeTab(index);
    if (this.tabStorage.tabOrder.length === 0) {
      this.newDefaultTab();
    }
  }
  /**
   * Close tab by ID
   * */
  batchClose(ids) {
    const tabOrder = this.tabStorage.tabOrder.filter((uuid) => !ids.includes(uuid));
    this.tabStorage.setTabs(tabOrder);
    if (this.tabStorage.tabOrder.length === 0) {
      this.newDefaultTab();
    }
  }
  closeTabByOperate(action: string | TabOperate) {
    switch (action) {
      case TabOperate.closeAll: {
        this.tabStorage.setTabs([]);
        this.newDefaultTab();
        break;
      }
      case TabOperate.closeOther: {
        this.tabStorage.setTabs([this.tabStorage.tabOrder[this.selectedIndex]]);
        break;
      }
      case TabOperate.closeLeft: {
        this.tabStorage.setTabs(this.tabStorage.tabOrder.slice(this.selectedIndex));
        break;
      }
      case TabOperate.closeRight: {
        this.tabStorage.setTabs(this.tabStorage.tabOrder.slice(0, this.selectedIndex + 1));
        break;
      }
    }
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
  operateTabAfterRouteChange(res: { url: string }) {
    const tmpTabItem = this.getTabFromUrl(res.url);
    //Pick current router url as the first tab
    if (this.tabStorage.tabOrder.length === 0) {
      this.tabStorage.addTab(tmpTabItem);
      return;
    }
    let existTabIndex = -1;
    //Get existTabIndex
    //If exist tab,select it
    for (const tabInfo of this.tabStorage.tabsByID.values()) {
      let isSameContent = false;
      if (tabInfo.params.uuid && tabInfo.params.uuid === tmpTabItem.params.uuid) {
        if (tabInfo.pathname === tmpTabItem.pathname) {
          isSameContent = true;
        }
        //TODO how to replace current exist tab but editing
      }
      if (tabInfo.uuid === tmpTabItem.params.pageID || isSameContent) {
        existTabIndex = this.tabStorage.tabOrder.findIndex((uuid) => uuid === tabInfo.uuid);
        break;
      }
    }
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
  getCurrentTab() {
    const currentID = this.tabStorage.tabOrder[this.selectedIndex];
    return this.tabStorage.tabsByID.get(currentID);
  }
  /**
   * New or replace current tab
   *
   * @param tabItem tab need to be add
   */
  private newOrReplaceTab(tabItem: TabItem) {
    const currentTab = this.getCurrentTab();
    //* Avoid open too much tab,if tab[type==='preview'] or tab[type==='edit'] with no change,replace page in current tab
    const canbeReplace =
      !currentTab.isFixed && (currentTab.type === 'preview' || (currentTab.type === 'edit' && !currentTab.hasChanged));
    if (canbeReplace) {
      // Same uuid means same tab data
      //*Prevent toggling splash screen with empty tab title
      if (tabItem.params?.uuid === currentTab.params?.uuid) {
        ['title', 'extends', 'isLoading'].forEach((keyName) => {
          //Dont't replace is loading tab content
          if (tabItem[keyName] && !tabItem.isLoading) {
            return;
          }
          tabItem[keyName] = currentTab[keyName];
        });
        tabItem.isLoading = false;
      }
      this.tabStorage.updateTab(this.selectedIndex, tabItem);
    } else {
      this.tabStorage.addTab(tabItem);
      this.selectedIndex = this.tabStorage.tabOrder.length - 1;
    }
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
    if (!basicTab) {
      throw new Error(`EO_ERROR: Please check this router has added in BASIC_TABS,current route:${url}`);
    }
    // Parse query params
    new URLSearchParams(urlArr[1]).forEach((value, key) => {
      if (key === 'pageID') {
        params[key] = Number(value);
        return;
      }
      params[key] = value;
    });
    const result = {
      //If data need load from ajax/indexeddb,add loading
      uuid: params.pageID || Date.now(),
      isLoading: params.uuid ? true : false,
      pathname: urlArr[0],
      params,
    };
    ['title', 'icon', 'type', 'extends'].forEach((keyName) => {
      result[keyName] = basicTab[keyName];
    });
    return result as TabItem;
  }
}
