import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiTabService } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab.service';
@Component({
  selector: 'eo-api-tab',
  templateUrl: './api-tab.component.html',
  styleUrls: ['./api-tab.component.scss'],
})
export class ApiTabComponent implements OnInit, OnDestroy {
  MAX_TAB_LIMIT = 15;
  constructor(public apiTab: ApiTabService) {}
  ngOnInit(): void {
  }
  newTab() {
    if (this.apiTab.tabs.length >= this.MAX_TAB_LIMIT) return;
    this.apiTab.newDefaultTab();
  }
  /**
   * After select tab
   */
  selectChange() {
    this.apiTab.navigateTabRoute(this.apiTab.tabs[this.apiTab.selectedIndex]);
  }
  closeTab({index}) {
    this.apiTab.closeTab(index)
  }
  /**
   * Tab  Close Operate
   * @param action
   */
  operateCloseTab(action: 'closeOther' | 'closeAll' | 'closeLeft' | 'closeRight') {}
  ngOnDestroy(): void {}
}
