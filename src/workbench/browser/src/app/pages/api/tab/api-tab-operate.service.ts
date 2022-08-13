import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiTabStorageService } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab-storage.service';
import { TabItem, TabOperate } from 'eo/workbench/browser/src/app/pages/api/tab/tab.model';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service';
import { ModalService } from 'eo/workbench/browser/src/app/shared/services/modal.service';
import { debug } from 'console';
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
  BASIC_TABS:  Partial<TabItem>[];
  constructor(
    private tabStorage: ApiTabStorageService,
    private messageService: MessageService,
    private router: Router,
    private message: EoMessageService,
    private modal: ModalService
  ) {}
  //Init tab info
  //Maybe from tab cache info or router url
  init(BASIC_TABS) {
    this.BASIC_TABS = BASIC_TABS;
    const tabCache = this.tabStorage.getPersistenceStorage();
    if (tabCache && tabCache.tabOrder?.length) {
      this.tabStorage.tabOrder = tabCache.tabOrder.filter((uuid) => tabCache.tabsByID.hasOwnProperty(uuid));
      const tabsByID = new Map();
      Object.values(tabCache.tabsByID).forEach((tabItem) => {
        tabsByID.set(tabItem.uuid, tabItem);
      });
      this.tabStorage.tabsByID = tabsByID;
      const targetTab = this.getTabByIndex(tabCache.selectedIndex || 0);
      this.selectedIndex = tabCache.selectedIndex;
      this.navigateTabRoute(targetTab);
    } else {
      this.operateTabAfterRouteChange({
        url: this.router.url,
      });
    }
  }
  /**
   * Add Default tab
   *
   * @returns tabItem
   */
  newDefaultTab() {
    const tabItem: TabItem = this.getBaiscTabFromUrl(this.BASIC_TABS[0].pathname);
    tabItem.uuid = tabItem.params.pageID = Date.now();
    this.tabStorage.addTab(tabItem);
    this.navigateTabRoute(tabItem);
  }

  closeTab(index: number) {
    // If tab is last one,selectIndex will be change by component itself;
    this.tabStorage.closeTab(index);
    if (this.tabStorage.tabOrder.length === 0) {
      this.newDefaultTab();
    } else {
      this.navigateTabRoute(this.getCurrentTab());
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
    const tabsObj = {
      hasChanged: this.tabStorage.tabOrder.filter((uuid) => this.tabStorage.tabsByID.get(uuid).hasChanged),
      left: [],
    };
    switch (action) {
      case TabOperate.closeAll: {
        tabsObj.left = tabsObj.hasChanged;
        if (tabsObj.left.length === 0) {
          this.newDefaultTab();
        }
        break;
      }
      case TabOperate.closeOther: {
        tabsObj.left = this.tabStorage.tabOrder.filter(
          (uuid) =>
            this.tabStorage.tabsByID.get(uuid).hasChanged || uuid === this.tabStorage.tabOrder[this.selectedIndex]
        );
        break;
      }
      case TabOperate.closeLeft: {
        tabsObj.left = [
          ...this.tabStorage.tabOrder
            .slice(0, this.selectedIndex)
            .filter((uuid) => this.tabStorage.tabsByID.get(uuid).hasChanged),
          ...this.tabStorage.tabOrder.slice(this.selectedIndex),
        ];
        break;
      }
      case TabOperate.closeRight: {
        tabsObj.left = [
          ...this.tabStorage.tabOrder.slice(0, this.selectedIndex + 1),
          ...this.tabStorage.tabOrder
            .slice(this.selectedIndex + 1)
            .filter((uuid) => this.tabStorage.tabsByID.get(uuid).hasChanged),
        ];
        break;
      }
    }
    this.tabStorage.resetTabsByOrdr(tabsObj.left);
    if (tabsObj.hasChanged.length) {
      this.message.warn($localize`Program will not close unsaved tabs`);
    }
  }
  /**
   * Navigate  url to tab route
   *
   * @param tab
   */
  navigateTabRoute(tab: TabItem) {
    if (!tab) {
      return;
    }
    this.router.navigate([tab.pathname], {
      queryParams: { pageID: tab.uuid, ...tab.params },
    });
  }
  /**
   * Get exist tab index
   *
   * @param type sameTab means has same pageID and same {params.uuid}
   * @param tab
   * @returns
   */
  getSameContentTab(tab: Partial<TabItem>): TabItem | null {
    let result = null;
    if (!tab.params.uuid) {
      const sameTabIDTab = this.tabStorage.tabsByID.get(tab.uuid);
      if (sameTabIDTab && sameTabIDTab.pathname === tab.pathname) {
        return sameTabIDTab;
      }
      return result;
    }
    //Get exist params.uuid content tab,same pathname and uuid match
    const mapObj = Object.fromEntries(this.tabStorage.tabsByID);
    for (const key in mapObj) {
      if (Object.prototype.hasOwnProperty.call(mapObj, key)) {
        const tabInfo = mapObj[key];
        if (tabInfo.params.uuid === tab.params.uuid && tabInfo.pathname === tab.pathname) {
          result = tabInfo;
          break;
        }
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
  getTabInfoFromUrl(url): { uuid: number; pathname: string; params: any } {
    const urlArr = url.split('?');
    const params: any = {};
    const basicTab = this.BASIC_TABS.find((val) => urlArr[0].includes(val.pathname));
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
      uuid: params.pageID,
      pathname: basicTab.pathname,
      params,
    };
    return result;
  }
  /**
   * Get basic tab info from url
   *
   * @param url
   * @returns tabInfo
   */
  getBaiscTabFromUrl(url): TabItem {
    const result = this.getTabInfoFromUrl(url);
    const basicTab = this.BASIC_TABS.find((val) => result.pathname === val.pathname);
    if (!basicTab) {
      throw new Error(`EO_ERROR: Please check this router has added in BASIC_TABS,current route:${url}`);
    }
    result.params.pageID = result.params.pageID || Date.now();
    Object.assign(result, basicTab);
    return result as TabItem;
  }

  /**
   * Operate tab after router change,router triggle tab change
   * Such as new tab,pick tab,close tab...
   *
   * @param res.url location.pathname+location.search
   */
  operateTabAfterRouteChange(res: { url: string }) {
    const pureTab = this.getTabInfoFromUrl(res.url);
    const nextTab = this.getBaiscTabFromUrl(res.url);
    const existTab = this.getSameContentTab(pureTab);
    //!Every tab must has pageID
    //If lack pageID,Jump to exist tab item to keep same  pageID and so on
    if (!pureTab.uuid) {
      if (existTab) {
        pureTab.uuid = pureTab.params.pageID = existTab.uuid;
      }
      this.navigateTabRoute(nextTab);
      return;
    }

    if (this.tabStorage.tabOrder.length === 0) {
      this.tabStorage.addTab(nextTab);
      this.updateChildView();
      return;
    }

    //same tab content,selected it
    if (existTab) {
      this.selectedIndex = this.tabStorage.tabOrder.findIndex((uuid) => uuid === existTab.uuid);
      this.updateChildView();
      return;
    }
    //!Same params.uuid can only open one Tab
    //If has same  subTab (same {params.uuid}), merge data and replace it
    if (nextTab.params?.uuid) {
      const hasFind = this.jumpToSameSubTab(nextTab);
      if (hasFind) {
        return;
      }
    }
    //Determine whether to replace the current Tab
    let canbeReplaceTab = null;
    if (this.tabStorage.tabsByID.has(pureTab.uuid)) {
      //If the same tab exists, directly replace
      canbeReplaceTab = nextTab;
    } else {
      canbeReplaceTab = this.findTabCanbeReplace();
    }
    if (canbeReplaceTab) {
      this.selectedIndex = this.tabStorage.tabOrder.findIndex((uuid) => uuid === canbeReplaceTab.uuid);
      this.tabStorage.updateTab(this.selectedIndex, nextTab);
      this.updateChildView();
      return;
    }

    //No one can be replace,add tab
    this.tabStorage.addTab(nextTab);
    this.selectedIndex = this.tabStorage.tabOrder.length - 1;
    this.updateChildView();
  }
  //*Prevent toggling splash screen with empty tab title
  private preventBlankTab(origin, target) {
    const result = target;
    /**
     * Keyname effect show tab
     */
    ['title', 'hasChanged', 'isLoading'].forEach((keyName) => {
      result[keyName] = origin[keyName];
    });
    return result;
  }
  canbeReplace(tabItem: TabItem) {
    if (tabItem.isFixed) {
      return false;
    }
    return true;
  }
  getTabByIndex(index): TabItem | null {
    if (index <= -1) {
      return null;
    }
    const tabID = this.tabStorage.tabOrder[index];
    return this.tabStorage.tabsByID.get(tabID);
  }
  getCurrentTab() {
    return this.getTabByIndex(this.selectedIndex);
  }
  /**
   * Same sub means tab has same {params.uuid}
   *
   * @param inTab
   * @returns hasFind
   */
  private jumpToSameSubTab(inTab): boolean {
    const mapObj = Object.fromEntries(this.tabStorage.tabsByID);
    for (const key in mapObj) {
      if (Object.prototype.hasOwnProperty.call(mapObj, key)) {
        const tab = mapObj[key];
        if (tab.params.uuid && tab.params.uuid === inTab.params.uuid) {
          const mergeTab = this.preventBlankTab(tab, inTab);
          mergeTab.content = tab.content;
          mergeTab.baseContent = tab.baseContent;
          mergeTab.extends = Object.assign(mergeTab.extends || {}, tab.extends);
          this.selectedIndex = this.tabStorage.tabOrder.findIndex((uuid) => uuid === tab.uuid);
          this.tabStorage.updateTab(this.selectedIndex, mergeTab);
          this.updateChildView();
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Find can be replace tab
   *
   * @returns
   */
  private findTabCanbeReplace(): TabItem {
    const mapObj = Object.fromEntries(this.tabStorage.tabsByID);
    const currentTab = this.getCurrentTab();
    //* Replace current tab first
    const result =
      currentTab && this.canbeReplace(currentTab)
        ? currentTab
        : Object.values(mapObj).find((val) => this.canbeReplace(val));
    return result;
  }
  private updateChildView() {
    this.messageService.send({ type: 'tabContentInit', data: {} });
  }
}
