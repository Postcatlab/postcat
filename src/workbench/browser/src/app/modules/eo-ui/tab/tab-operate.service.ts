import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { TabStorageService } from 'eo/workbench/browser/src/app/modules/eo-ui/tab/tab-storage.service';
import { storageTab, TabItem, TabOperate } from 'eo/workbench/browser/src/app/modules/eo-ui/tab/tab.model';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { eoDeepCopy } from 'eo/workbench/browser/src/app/utils/index.utils';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';
/**
 * Tab service operate tabs array add/replace/close...
 * Tab change by  url change(router event)
 */
@Injectable()
export class TabOperateService {
  /**
   * Current selected tab index.
   */
  selectedIndex = 0;
  beforeLeave = true;
  /**
   * Tab basic info
   */
  BASIC_TABS: Array<Partial<TabItem>>;
  setting = {
    //* Cache pagedata in tab
    disabledCache: false,
    //* Allow development mode debug not exist router at init
    allowNotExistRouter: !APP_CONFIG.production,
    //* Allow open new tab by url at init
    allowOpenNewTabByUrl: false
  };
  constructor(
    private tabStorage: TabStorageService,
    private messageService: MessageService,
    private router: Router,
    private message: EoNgFeedbackMessageService
  ) {}
  //Init tab info
  //Maybe from tab cache info or router url
  init(inArg: { basicTabs: Array<Partial<TabItem>>; handleDataBeforeGetCache }) {
    this.BASIC_TABS = inArg.basicTabs;
    const tabStorage = this.setting.disabledCache
      ? null
      : this.tabStorage.getPersistenceStorage({
          handleDataBeforeGetCache: inArg.handleDataBeforeGetCache
        });
    //parse result for router change
    const tabCache = this.filterValidTab(tabStorage);
    const validTabItem = this.generateTabFromUrl(this.router.url);
    const executeWhenNoTab = () => {
      if (!validTabItem) {
        this.newDefaultTab();
        return;
      }
      this.operateTabAfterRouteChange({
        url: this.router.url
      });
    };
    //No cache
    if (!tabCache?.tabOrder?.length) {
      executeWhenNoTab();
      return;
    }
    //Restore tab data from cache
    //Judge if  uuid match the cache
    this.tabStorage.tabOrder = tabCache.tabOrder.filter(uuid => tabCache.tabsByID.hasOwnProperty(uuid));
    const tabsByID = new Map();
    Object.values(tabCache.tabsByID).forEach((tabItem: TabItem) => {
      //Tabstorage has error route
      if (this.BASIC_TABS.findIndex(val => val.pathname === tabItem.pathname) === -1) {
        this.tabStorage.tabOrder.splice(
          this.tabStorage.tabOrder.findIndex(val => val === tabItem.uuid),
          1
        );
        tabCache.selectedIndex = 0;
        return;
      }
      tabsByID.set(tabItem.uuid, tabItem);
    });
    this.tabStorage.tabsByID = tabsByID;
    //After filter unvalid tab,Still no tab item can be selected
    if (!this.tabStorage.tabOrder?.length) {
      executeWhenNoTab();
      return;
    }

    //If current url is valid tab url,select it
    if (validTabItem && this.setting.allowOpenNewTabByUrl) {
      this.operateTabAfterRouteChange({
        url: this.router.url
      });
      return;
    }
    if (!validTabItem && this.setting.allowNotExistRouter) {
      return;
    }
    //Tab from last choose
    const targetTab = this.getTabByIndex(tabCache.selectedIndex || 0);
    this.selectedIndex = tabCache.selectedIndex;
    this.navigateTabRoute(targetTab);
  }
  /**
   * Add Default tab
   *
   * @returns tabItem
   */
  newDefaultTab(routerStr?) {
    const tabItem = {
      ...eoDeepCopy(this.BASIC_TABS.find(val => val.pathname.includes(routerStr)) || this.BASIC_TABS[0])
    };
    tabItem.params = {};
    tabItem.uuid = tabItem.params.pageID = Date.now();
    Object.assign(tabItem, { isLoading: false });
    this.tabStorage.addTab(tabItem);
    this.navigateTabRoute(tabItem as TabItem);
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
    const tabOrder = this.tabStorage.tabOrder.filter(uuid => !ids.includes(uuid));
    this.tabStorage.resetTabsByOrdr(tabOrder);
    if (this.tabStorage.tabOrder.length === 0) {
      this.newDefaultTab();
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
    const queryParams = { pageID: tab.uuid, ...tab.params };
    this.router.navigate([tab.pathname], {
      queryParams
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
  getBasicInfoFromUrl(url): { uuid: number; pathname: string; params: any } {
    const urlArr = url.split('?');
    const params: any = {};
    const basicTab = this.BASIC_TABS.find(val => urlArr[0].includes(val.pathname));
    if (!basicTab) {
      console.log(this.BASIC_TABS);
      pcConsole.error(`: Please check this router has added in BASIC_TABS,current route: ${urlArr[0]}`);
      return;
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
      icon: basicTab.icon,
      params
    };
    return result;
  }
  /**
   * Get basic tab info from url
   *
   * @param url
   * @returns tabInfo
   */
  generateTabFromUrl(url): TabItem {
    const result = this.getBasicInfoFromUrl(url);
    if (!result) {
      pcConsole.error(`: Please check this router has added in BASIC_TABS,current route:${url}`);
      return;
    }
    const basicTab = eoDeepCopy(this.BASIC_TABS.find(val => result.pathname === val.pathname));
    if (!basicTab) {
      pcConsole.error(`: Please check this router has added in BASIC_TABS,current route:${url}`);
      return;
    }
    result.params.pageID = result.params.pageID || Date.now();
    Object.assign(result, { isLoading: true }, basicTab);
    return result as TabItem;
  }

  /**
   * Operate tab after router change,router triggle tab change
   * Such as new tab,pick tab,close tab...
   *
   * @param res.url location.pathname+location.search
   */
  operateTabAfterRouteChange(res: { url: string }) {
    const pureTab = this.getBasicInfoFromUrl(res.url);
    const existTab = this.getSameContentTab(pureTab);

    const nextTab = this.generateTabFromUrl(res.url);
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
      this.selectedIndex = this.tabStorage.tabOrder.findIndex(uuid => uuid === existTab.uuid);
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
      this.selectedIndex = this.tabStorage.tabOrder.findIndex(uuid => uuid === canbeReplaceTab.uuid);
      this.tabStorage.updateTab(this.selectedIndex, nextTab);
      this.updateChildView();
      return;
    }

    //No one can be replace,add tab
    this.tabStorage.addTab(nextTab);
    this.selectedIndex = this.tabStorage.tabOrder.length - 1;
    this.updateChildView();
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
  closeTabByOperate(action: string | TabOperate) {
    const currentTabID = this.tabStorage.tabOrder[this.selectedIndex];
    let tabsObj = {
      //Close tab has hasChanged tab
      needTips: false,
      selectedIndex: 0,
      left: []
    };
    switch (action) {
      case TabOperate.closeAll: {
        tabsObj = this.closeTabByDuration([0, this.tabStorage.tabOrder.length]);
        if (tabsObj.left.length === 0) {
          this.newDefaultTab();
        }
        break;
      }
      case TabOperate.closeOther: {
        tabsObj = this.closeTabByDuration([0, this.tabStorage.tabOrder.length], currentTabID);
        break;
      }
      case TabOperate.closeLeft: {
        tabsObj = this.closeTabByDuration([0, this.selectedIndex], currentTabID);
        break;
      }
      case TabOperate.closeRight: {
        tabsObj = this.closeTabByDuration([this.selectedIndex + 1, this.tabStorage.tabOrder.length], currentTabID);
        break;
      }
    }
    this.tabStorage.resetTabsByOrdr(tabsObj.left);
    this.selectedIndex = tabsObj.selectedIndex;
    if (tabsObj.needTips) {
      this.message.warning($localize`Program will not close unsaved tabs`);
    }
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
          this.selectedIndex = this.tabStorage.tabOrder.findIndex(uuid => uuid === tab.uuid);
          this.tabStorage.updateTab(this.selectedIndex, mergeTab);
          this.updateChildView();
          return true;
        }
      }
    }
    return false;
  }
  /**
   * Close tab by need close duration
   */
  private closeTabByDuration(duration, keepID?) {
    const tabsObj = {
      //Close tab has hasChanged tab
      needTips: false,
      selectedIndex: 0,
      left: []
    };
    const start = duration[0];
    const end = duration[1];
    tabsObj.left = [
      ...this.tabStorage.tabOrder.slice(0, start),
      ...this.tabStorage.tabOrder.slice(start, end).filter(uuid => {
        if (keepID && uuid === keepID) {
          return true;
        }
        if (this.tabStorage.tabsByID.get(uuid).hasChanged) {
          tabsObj.needTips = true;
          return true;
        }
      }),
      ...this.tabStorage.tabOrder.slice(end)
    ];
    if (keepID) {
      tabsObj.selectedIndex = tabsObj.left.findIndex(uuid => uuid === keepID);
    }
    return tabsObj;
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
    const result = currentTab && this.canbeReplace(currentTab) ? currentTab : Object.values(mapObj).find(val => this.canbeReplace(val));
    return result;
  }
  //*Prevent toggling splash screen with empty tab title
  private preventBlankTab(origin, target) {
    const result = target;
    /**
     * Keyname effect show tab
     */
    ['title', 'hasChanged', 'isLoading'].forEach(keyName => {
      result[keyName] = origin[keyName];
    });
    return result;
  }
  private updateChildView() {
    this.messageService.send({ type: 'tabContentInit', data: {} });
  }
  /**
   * Get valid tab item
   *
   * @param cache
   * @returns
   */
  private filterValidTab(cache: storageTab) {
    if (!cache) {
      return;
    }
    //If router not exist basic tab,filter it
    cache.tabOrder = cache.tabOrder.filter(id => {
      const tabItem = cache.tabsByID[id];
      if (!tabItem) {
        return false;
      }
      const validTab = this.BASIC_TABS.find(val => val.id === tabItem.id);
      if (!validTab) {
        delete cache.tabsByID[id];
      } else {
        tabItem.pathname = validTab.pathname;
      }
      return validTab;
    });
    return cache;
  }
}
