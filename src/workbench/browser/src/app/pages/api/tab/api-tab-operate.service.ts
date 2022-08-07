import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiTabStorageService } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab-storage.service';
import { TabItem, TabOperate } from 'eo/workbench/browser/src/app/pages/api/tab/tab.model';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
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
  constructor(
    private tabStorage: ApiTabStorageService,
    private messageService: MessageService,
    private router: Router,
    private modal: ModalService
  ) {
    this.watchPageLeave();
  }
  //Init tab info
  //Maybe from tab cache info or router url
  init(BASIC_TABS) {
    this.BASIC_TABS = BASIC_TABS;
    const tabCache = this.tabStorage.getPersistenceStorage();
    if (tabCache) {
      this.tabStorage.tabOrder = tabCache.tabOrder;
      const tabsByID = new Map();
      Object.values(tabCache.tabsByID).forEach((tabItem) => {
        tabsByID.set(tabItem.uuid, tabItem);
      });
      this.tabStorage.tabsByID = tabsByID;
      const targetTab = this.getTabByIndex(tabCache.selectedIndex || 0);
      this.navigateTabRoute(targetTab);
    } else {
      this.operateTabAfterRouteChange({
        url: window.location.pathname + window.location.search,
      });
    }
  }
  /**
   * Add Default tab
   *
   * @returns tabItem
   */
  newDefaultTab() {
    const tabItem: TabItem = this.getBaiscTabFromUrl(Object.values(this.BASIC_TABS)[0].pathname);
    this.navigateTabRoute(tabItem);
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
    this.tabStorage.resetTabsByOrdr(tabOrder);
    if (this.tabStorage.tabOrder.length === 0) {
      this.newDefaultTab();
    }
  }
  closeTabByOperate(action: string | TabOperate) {
    switch (action) {
      case TabOperate.closeAll: {
        this.tabStorage.resetTabsByOrdr([]);
        this.newDefaultTab();
        break;
      }
      case TabOperate.closeOther: {
        this.tabStorage.resetTabsByOrdr([this.tabStorage.tabOrder[this.selectedIndex]]);
        break;
      }
      case TabOperate.closeLeft: {
        this.tabStorage.resetTabsByOrdr(this.tabStorage.tabOrder.slice(this.selectedIndex));
        break;
      }
      case TabOperate.closeRight: {
        this.tabStorage.resetTabsByOrdr(this.tabStorage.tabOrder.slice(0, this.selectedIndex + 1));
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
   * Get exist tab index
   *
   * @param type sameTab means has same {params.uuid}
   * @param tab
   * @returns
   */
  getTabIndex(type: 'sameTab' | 'sameContent' = 'sameTab', tab: TabItem): number {
    let result = -1;
    //Get exist TabIndex
    for (const tabInfo of this.tabStorage.tabsByID.values()) {
      if (tabInfo.uuid === tab.params.pageID) {
        result = this.tabStorage.tabOrder.findIndex((uuid) => uuid === tabInfo.uuid);
        break;
      }
      if (tabInfo.params.uuid && tabInfo.params.uuid === tab.params.uuid) {
        if (type === 'sameContent') {
          if (tabInfo.pathname === tab.pathname) {
            result = this.tabStorage.tabOrder.findIndex((uuid) => uuid === tabInfo.uuid);
            break;
          }
        } else {
          result = this.tabStorage.tabOrder.findIndex((uuid) => uuid === tabInfo.uuid);
        }
        break;
        //TODO how to replace current exist tab but editing
      }
    }
    return result;
  }
  /**
   * Get tab info from url
   *
   * @param url
   * @returns tabInfo
   */
  getBaiscTabFromUrl(url): TabItem {
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
  /**
   * Operate tab after router change,router triggle tab change
   * Such as new tab,pick tab,close tab...
   */
  operateTabAfterRouteChange(res: { url: string }) {
    const tmpTabItem = this.getBaiscTabFromUrl(res.url);
    console.log('operateTabAfterRouteChange',tmpTabItem);
    this.messageService.send({ type: 'tabContentInit', data: {} });
    //Pick current router url as the first tab
    if (this.tabStorage.tabOrder.length === 0) {
      this.tabStorage.addTab(tmpTabItem);
      return;
    }
    const existTabIndex = this.getTabIndex('sameContent', tmpTabItem);
    //Router has focus current tab
    if (this.selectedIndex === existTabIndex) {
      return;
    }
    //If exist tab,select it
    if (existTabIndex !== -1) {
      this.selectedIndex = existTabIndex;
      return;
    }
    //If no exist,new tab or replace origin tab
    this.newOrReplaceTab(tmpTabItem);
  }
  getTabByIndex(index) {
    const tabID = this.tabStorage.tabOrder[index];
    return this.tabStorage.tabsByID.get(tabID);
  }
  getCurrentTab() {
    return this.getTabByIndex(this.selectedIndex);
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

  private watchPageLeave() {
    window.addEventListener('beforeunload', function(e) {
      console.log('beforeunload');
    });
  }
}
