import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { TabItem } from './tab.model';
import { ApiData } from '../../../shared/services/api-data/api-data.model';

import { ApiTabService } from './api-tab.service';

import { Subject, takeUntil } from 'rxjs';
import { Message, MessageService } from '../../../shared/services/message';
import { isConstructorDeclaration } from 'typescript/lib/tsserverlibrary';
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
    this.appendTab('test');
  }
  /**
   * Init tab data after load or update.
   */
  initTab() {
    let apiID = Number(this.route.snapshot.queryParams.uuid);
    let hasApiExist = this.apiDataItems[apiID];
    //delete api
    if (!hasApiExist) {
      this.closeTab({ index: this.selectedIndex });
      return;
    }
    if (apiID) {
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
    if (this.tabSerive.tabs.length >= this.MAX_TAB_LIMIT) return;
    let tab: TabItem = Object.assign(
      {
        uuid: new Date().getTime(),
      },
      which === 'unset' ? {} : this.defaultTabs[which],
      apiData
    );
    let existApiIndex = this.tabSerive.tabs.findIndex((val) => val.key === tab.key);
    if (tab.key && existApiIndex !== -1) {
      this.selectedIndex = existApiIndex;
      if (this.tabSerive.tabs[existApiIndex].path !== tab.path) {
        //* exist api in same tab change route,such as edit page to detail
        this.tabSerive.tabs[existApiIndex].path = tab.path;
        this.pickTab();
      }
      return;
    }
    this.tabSerive.tabs.push(tab);
    // if index no change,manual change  reflesh content
    if (this.selectedIndex === this.tabSerive.tabs.length - 1) {
      this.pickTab();
      return;
    }
    this.selectedIndex = this.tabSerive.tabs.length - 1;
  }
  /**
   * Remove api data tabs.
   *
   * @param uuids Array<string|number>
   */
  removeApiDataTabs(uuids: Array<string | number>): void {
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
  removeTabCache(index) {
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
        console.log('watchApiAction', inArg);
        switch (inArg.type) {
          case 'testApi':
            this.appendTab('test', inArg.data ? inArg.data.origin : {});
            break;
          case 'detailApi':
            this.appendTab('detail', inArg.data.origin);
            break;
          case 'gotoEditApi':
            this.appendTab('edit', inArg.data.origin);
            break;
          case 'copyApi':
          case 'gotoAddApi':
            this.appendTab('edit', inArg.data ? { groupID: inArg.data.key } : {});
            break;
          case 'addApiSuccess':
          case 'editApiSuccess':
            this.changeCurrentTab(
              this.getTabInfo({
                path: this.defaultTabs['detail'].path,
                apiData: inArg.data,
              })
            );
            this.pickTab();
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
            this.changeCurrentTab(
              this.getTabInfo({
                path: this.defaultTabs[inArg.data.routerLink].path,
                id: Number(this.route.snapshot.queryParams.uuid),
              })
            );
            break;
          }
          case 'addApiFromTest': {
            this.changeCurrentTab(
              this.getTabInfo({
                path: this.defaultTabs['edit'].path,
                apiData: inArg.data,
              })
            );
            this.pickTab();
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
    this.tabSerive.tabs[this.selectedIndex] = Object.assign(this.tabSerive.tabs[this.selectedIndex], tabInfo);
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
