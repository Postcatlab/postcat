import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ApiTabOperateService } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab-operate.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { ApiTabStorageService } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab-storage.service';
import { TabItem, TabOperate } from 'eo/workbench/browser/src/app/pages/api/tab/tab.model';
import { ModalService } from '../../../shared/services/modal.service';
import { KeyValue } from '@angular/common';
@Component({
  selector: 'eo-api-tab',
  templateUrl: './api-tab.component.html',
  styleUrls: ['./api-tab.component.scss'],
})
export class ApiTabComponent implements OnInit, OnDestroy {
  @Input() list;
  @Output() beforeClose = new EventEmitter<boolean>();
  MAX_TAB_LIMIT = 15;
  routerSubscribe: Subscription;
  // private destroy$: Subject<void> = new Subject<void>();
  constructor(
    public tabStorage: ApiTabStorageService,
    public tabOperate: ApiTabOperateService,
    private modal: ModalService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.tabOperate.init(this.list);
    this.watchRouterChange();
  }
  newTab() {
    if (this.tabStorage.tabOrder.length >= this.MAX_TAB_LIMIT) {
      return;
    }
    this.tabOperate.newDefaultTab();
  }
  sortTab(_left: KeyValue<number, any>, _right: KeyValue<number, any>): number {
    const leftIndex = this.tabStorage.tabOrder.findIndex((uuid) => uuid === _left.key);
    const rightIndex = this.tabStorage.tabOrder.findIndex((uuid) => uuid === _right.key);
    return leftIndex - rightIndex;
  }
  /**
   * Select tab
   */
  selectChange() {
    this.tabOperate.navigateTabRoute(this.getCurrentTab());
  }
  closeTab({ $event, index, tab }: { $event: Event;index: number; tab: any }) {
    $event.stopPropagation();
    if (!tab.hasChanged) {
      this.tabOperate.closeTab(index);
      return;
    }
    const modal = this.modal.create({
      nzTitle: $localize`Do you want to save the changes?`,
      nzContent: $localize`Your changes will be lost if you don't save them.`,
      nzClosable: false,
      nzFooter: [
        {
          label: $localize`Save`,
          type: 'primary',
          onClick: () => {
            this.beforeClose.emit(true);
            modal.destroy();
            this.tabOperate.closeTab(index);
          },
        },
        {
          label: $localize`Don't Save`,
          onClick: () => {
            this.beforeClose.emit(false);
            modal.destroy();
            this.tabOperate.closeTab(index);
          },
        },
        {
          label: $localize`Cancel`,
          onClick: () => {
            modal.destroy();
          },
        },
      ],
    });
  }
  //Quick see tabs change in templete,for debug,can be deleted
  getConsoleTabs() {
    const tabs = [];
    this.tabStorage.tabOrder.forEach((uuid) => {
      const tab = this.tabStorage.tabsByID.get(uuid);
      if (!tab) {
        return;
      }
      tabs.push({ uuid: tab.uuid, title: tab.title, pathname: tab.pathname, params: tab.params });
    });
    return tabs;
  }
  getTabs() {
    // console.log('getTabs');
    const tabs = [];
    this.tabStorage.tabOrder.forEach((uuid) => tabs.push(this.tabStorage.tabsByID.get(uuid)));
    return tabs;
  }
  getTabByUrl(url: string): TabItem | null {
    const tabItem = this.tabOperate.getBaiscTabFromUrl(url);
    const existTabIndex = this.tabOperate.getTabIndex('sameContent', tabItem);
    if (existTabIndex === -1) {
      return null;
    }
    return this.tabStorage.tabsByID.get(this.tabStorage.tabOrder[existTabIndex]);
  }
  getCurrentTab() {
    return this.tabOperate.getCurrentTab();
  }
  batchCloseTab(uuids) {
    this.tabOperate.batchClose(uuids);
  }
  updatePartialTab(url: string, tabItem: Partial<TabItem>) {
    const originTab = this.getTabByUrl(url);
    if (!originTab) {
      return;
    }
    const index = this.tabStorage.tabOrder.findIndex((uuid) => uuid === originTab.uuid);
    this.tabStorage.updateTab(index, Object.assign({}, originTab, tabItem));
    //! Prevent rendering delay
    this.cdRef.detectChanges();
  }
  /**
   * Cache tab header/tabs content for restore when page close or component destroy
   */
  cacheData() {
    this.tabStorage.setPersistenceStorage(this.tabOperate.selectedIndex);
  }
  /**
   * Tab  Close Operate
   *
   * @param action
   */
  closeTabByOperate(action: TabOperate | string) {
    this.tabOperate.closeTabByOperate(action);
  }
  private watchRouterChange() {
    this.routerSubscribe = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((res: NavigationEnd) => {
        this.tabOperate.operateTabAfterRouteChange(res);
      });
  }
  ngOnDestroy(): void {
    this.routerSubscribe?.unsubscribe();
    this.cacheData();
  }
}
