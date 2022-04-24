import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabItem } from './tab.model';
import { ApiData } from '../../../../../../../platform/browser/IndexedDB';
import { ApiTabService } from './api-tab.service';
import { Subject, takeUntil } from 'rxjs';
import { Message, MessageService } from '../../../shared/services/message';
@Component({
  selector: 'eo-api-tab',
  templateUrl: './api-tab.component.html',
  styleUrls: ['./api-tab.component.scss'],
})
export class ApiTabComponent implements OnInit, OnDestroy {
  apiDataItems: { [key: number | string]: ApiData };

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
    overview: { path: '/home/api/overview', title: '概况', key: 'overview' },
  };
  MAX_TAB_LIMIT = 15;

  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public tabSerive: ApiTabService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.watchApiAction();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  /**
   * Create a new tab.
   */
  newTab(): void {
    this.appendOrSwitchTab('test');
  }
  /**
   * Init tab data after load or update.
   */
  private initTab() {
    let apiID = Number(this.route.snapshot.queryParams.uuid);
    if (!apiID) {
      let module = Object.keys(this.defaultTabs).find((keyName) =>
        this.router.url.split('?')[0].includes(this.defaultTabs[keyName].path)
      );
      this.appendOrSwitchTab(module, this.route.snapshot.queryParams);
    } else {
      let isApiExist = this.apiDataItems[apiID];
      //not exist api or delete api
      if (!isApiExist) {
        this.closeTab({ index: this.selectedIndex });
        return;
      }
      const tab = this.getTabInfo({
        tabData: this.apiDataItems[apiID],
      });
      this.appendOrSwitchTab('unset', tab);
    }
  }
  /**
   * Append or switch tab
   * @param which test|detail|edit
   * @param tabContent
   */
  private appendOrSwitchTab(which = 'test', tabContent: any = {}): void {
    let tab: TabItem = Object.assign(
      {
        uuid: new Date().getTime(),
      },
      which === 'unset' ? {} : this.defaultTabs[which],
      tabContent
    );
    let existTabIndex = this.tabSerive.tabs.findIndex((val) => val.key === tab.key);
    if (tab.key && existTabIndex !== -1) {
      let switchTab = {};
      if (this.tabSerive.tabs[existTabIndex].path !== tab.path) {
        //* exist api in same tab change route,such as edit page to detail
        switchTab['path'] = tab.path;
      }
      this.switchTab(existTabIndex, switchTab);
      return;
    }
    // avoid open too much tab,if detail or no change,open page in current tab
    if (
      this.tabSerive.tabs.length &&
      this.tabSerive.currentTab?.path.includes('detail') &&
      tab.path.includes('detail')
    ) {
      this.switchTab(this.selectedIndex, tab);
      return;
    }
    this.appendTab(tab);
  }
  private appendTab(tab) {
    if (this.tabSerive.tabs.length >= this.MAX_TAB_LIMIT) return;
    this.tabSerive.tabs.push(tab);
    this.changeSelectIndex(this.tabSerive.tabs.length - 1);
  }
  /**
   * Switch to exist tab or replace exist tab content
   * @param selectIndex
   * @param tab
   */
  private switchTab(selectIndex, tab = {}) {
    Object.assign(this.tabSerive.tabs[selectIndex], tab);
    this.changeSelectIndex(selectIndex);
  }
  private changeSelectIndex(selectIndex) {
    // if index no change,manual change  reflesh content
    if (this.selectedIndex === selectIndex) {
      this.pickTab();
      return;
    }
    this.selectedIndex = selectIndex;
  }
  /**
   * Remove api data tabs.
   *
   * @param uuids Array<string|number>
   */
  private removeApiDataTabs(uuids: Array<string | number>): void {
    const items = [];
    this.tabSerive.tabs.forEach((tab: TabItem, index: number) => {
      if (uuids.includes(tab.key)) {
        items.push({ index });
      }
    });
    items.reverse().forEach((item) => {
      this.closeTab(item);
    });
  }
  private removeTabCache(index) {
    if (!this.tabSerive.tabs[index]) return;
    this.tabSerive.removeData(this.tabSerive.tabs[index].uuid);
  }
  /**
   * Close Tab and keep tab status
   *
   * @param index number
   */
  closeTab({ index }: { index: number }): void {
    let selectIndex =
      index <= this.selectedIndex ? (this.selectedIndex - 1 < 0 ? 0 : this.selectedIndex - 1) : this.selectedIndex;
    this.bulkCloseTab([index], selectIndex);
  }
  bulkCloseTab(closeTabs, selectIndex?) {
    closeTabs.forEach((index) => {
      this.removeTabCache(index);
    });
    this.tabSerive.tabs = this.tabSerive.tabs.filter((val, index) => !closeTabs.includes(index));
    if (0 === this.tabSerive.tabs.length) {
      this.newTab();
      return;
    }
    if (selectIndex !== this.selectedIndex) {
      this.selectedIndex = selectIndex;
    } else {
      this.pickTab();
    }
  }
  /**
   * Tab  Close operate
   * @param action closeOther|closeAll|closeLeft|closeRight
   */
  oeprateCloseTab(action) {
    let closeTabs = [...new Array(this.tabSerive.tabs.length).keys()],
      tmpSelectIndex = 0;
    switch (action) {
      case 'closeOther':
        closeTabs.splice(this.selectedIndex, 1);
        break;
      case 'closeLeft':
        closeTabs = closeTabs.slice(0, this.selectedIndex);
        break;
      case 'closeRight':
        closeTabs = closeTabs.slice(this.selectedIndex + 1);
        tmpSelectIndex = this.selectedIndex;
        break;
    }
    this.bulkCloseTab(closeTabs, tmpSelectIndex);
  }
  /**
   * Tab operate
   * @param action closeOther|closeAll|closeLeft|closeRight
   */
  operateTab(action) {
    if (action.includes('close')) {
      this.oeprateCloseTab(action);
    }
  }
  /**
   * Pick tab after switch the tab or tab content
   * @param {TabItem} inArg.tab
   * @param inArg.index
   */
  pickTab() {
    let tab = this.tabSerive.tabs[this.selectedIndex];
    this.tabSerive.tabChange$.next(tab);
    this.activeRoute(tab);
  }
  /**
   * Api Operation triggle tab change
   */
  private watchApiAction() {
    this.messageService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((inArg: Message) => {
        switch (inArg.type) {
          case 'testApi':
            this.appendOrSwitchTab('test', inArg.data ? inArg.data.origin : {});
            break;
          case 'detailApi':
            this.appendOrSwitchTab('detail', inArg.data.origin);
            break;
          case 'detailOverview': {
            console.log(inArg.data.origin);
            this.appendOrSwitchTab('overview', inArg.data.origin);
            break;
          }
          case 'gotoEditApi':
            this.appendOrSwitchTab('edit', inArg.data.origin);
            break;
          case 'copyApi':
          case 'gotoAddApi':
            this.appendOrSwitchTab('edit', inArg.data ? { groupID: inArg.data.key.replace('group-', '') } : {});
            break;
          case 'addApiSuccess':
          case 'editApiSuccess':
            //jump to detail page
            this.switchTab(
              this.selectedIndex,
              this.getTabInfo({
                path: this.defaultTabs['detail'].path,
                tabData: inArg.data,
              })
            );
            break;
          case 'deleteApiSuccess':
            this.removeApiDataTabs([inArg.data.uuid]);
            break;
          case 'bulkDeleteApiSuccess':
            this.removeApiDataTabs(inArg.data.uuids);
            break;
          case 'loadApi': {
            this.apiDataItems = inArg.data;
            this.initTab();
            break;
          }
          case 'beforeChangeRouter': {
            this.switchTab(
              this.selectedIndex,
              this.getTabInfo({
                path: this.defaultTabs[inArg.data.routerLink].path,
                tabData: this.apiDataItems[this.route.snapshot.queryParams.uuid],
              })
            );
            break;
          }
          case 'addApiFromTest': {
            this.switchTab(
              this.selectedIndex,
              this.getTabInfo({
                path: this.defaultTabs['edit'].path,
                tabData: inArg.data,
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
  /**
   * Get tab info by api id or api data
   * @param inArg.id exist api id
   * @param apiData tab content api data
   * @returns {TabItem}
   */
  private getTabInfo(inArg: { tabData: any; path?: string }) {
    const result = {
      path: inArg.path || this.router.url.split('?')[0],
      title: inArg.tabData.name,
      method: inArg.tabData.method,
      key: inArg.tabData.uuid?.toString(),
    };
    return result;
  }
}
