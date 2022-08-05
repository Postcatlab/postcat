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
  getCurrentTabStorage(){
    const currentTab=this.getCurrentTab();
    // return currentTab.content;
    return null;
  }
  newTab() {
    if (this.tabStorage.tabOrder.length >= this.MAX_TAB_LIMIT) {
      return;
    }
    this.tabOperate.newDefaultTab();
  }
  sortTab(_left: KeyValue<number, any>, _right: KeyValue<number, any>): number {
    console.log('sortTab', arguments);
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
  closeTab({ index, tab }: { index: number; tab: any }) {
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
  getTabs() {
    const tabs=[];
    this.tabStorage.tabOrder.forEach(uuid=>tabs.push(this.tabStorage.tabsByID.get(uuid)));
    return tabs;
  }
  getCurrentTab() {
    return this.tabOperate.getCurrentTab();
  }
  batchCloseTab(uuids) {
    this.tabOperate.batchClose(uuids);
  }
  updatePartialTab(tabItem: Partial<TabItem>) {
    const currentTab = this.getCurrentTab();
    this.tabStorage.updateTab(this.tabOperate.selectedIndex, Object.assign({}, currentTab, tabItem));

    //! Prevent rendering delay
    this.cdRef.detectChanges();
  }
  /**
   * Cache tab header/tabs content for restore when page close or component destroy
   */
  cacheData() {}
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
    this.routerSubscribe.unsubscribe();
    this.cacheData();
  }
}
