import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiTabStorageService } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab-storage.service';
@Component({
  selector: 'eo-api-tab',
  templateUrl: './api-tab.component.html',
  styleUrls: ['./api-tab.component.scss'],
})
export class ApiTabComponent implements OnInit, OnDestroy {
  /**
   * Current selected tab index.
   */
  selectedIndex = 0;
  MAX_TAB_LIMIT = 15;
  constructor(public tabSerive: ApiTabStorageService) {}
  ngOnInit(): void {}
  ngOnDestroy(): void {}
  newTab() {}
  pickTab() {}
  closeTab($event) {}
  /**
   * Tab  Close Operate
   * @param action
   */
  operateCloseTab(action: 'closeOther' | 'closeAll' | 'closeLeft' | 'closeRight') {}
}
