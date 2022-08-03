import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ApiTabOperateService } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab-operate.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { ApiTabStorageService } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab-storage.service';
import { TabItem, TabOperate } from 'eo/workbench/browser/src/app/pages/api/tab/tab.model';
import { ModalService } from '../../../shared/services/modal.service';
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
    private router: Router
  ) {}
  ngOnInit(): void {
    this.tabOperate.init(this.list);
    this.watchRouterChange();
  }
  newTab() {
    if (this.tabStorage.tabs.length >= this.MAX_TAB_LIMIT) {
      return;
    }
    this.tabOperate.newDefaultTab();
  }
  /**
   * Select tab
   */
  selectChange() {
    this.tabOperate.navigateTabRoute(this.tabStorage.tabs[this.tabOperate.selectedIndex]);
  }
  closeTab({ index, tab }) {
    if (tab.hasChanged) {
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
      return;
    }
    this.tabOperate.closeTab(index);
  }
  getTabs() {
    return this.tabStorage.tabs;
  }
  getCurrentTab() {
    return this.tabStorage.tabs[this.tabOperate.selectedIndex];
  }
  batchCloseTab(uuids) {
    this.tabOperate.batchClose(uuids);
  }
  updateTab(tabItem: TabItem) {
    const currentTab = this.getCurrentTab();
    this.tabStorage.updateTab(this.tabOperate.selectedIndex, Object.assign({}, currentTab, tabItem));
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
    this.routerSubscribe.unsubscribe();
  }
}
