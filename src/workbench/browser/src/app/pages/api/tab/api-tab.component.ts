import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ApiTabOperateService } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab-operate.service';
@Component({
  selector: 'eo-api-tab',
  templateUrl: './api-tab.component.html',
  styleUrls: ['./api-tab.component.scss'],
})
export class ApiTabComponent implements OnInit, OnDestroy {
  MAX_TAB_LIMIT = 15;
  constructor(public tabOperate: ApiTabOperateService) {}
  ngOnInit(): void {
  }
  newTab() {
    if (this.tabOperate.tabs.length >= this.MAX_TAB_LIMIT) {return;}
    this.tabOperate.newDefaultTab();
  }
  /**
   * After select tab
   */
  selectChange() {
    this.tabOperate.navigateTabRoute(this.tabOperate.tabs[this.tabOperate.selectedIndex]);
  }
  closeTab({index}) {
    this.tabOperate.close(index);
  }
  /**
   * Tab  Close Operate
   *
   * @param action
   */
  operateCloseTab(action: 'closeOther' | 'closeAll' | 'closeLeft' | 'closeRight') {}
  ngOnDestroy(): void {}
}
