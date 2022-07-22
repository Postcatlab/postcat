import { Injectable } from '@angular/core';
import { ApiModule } from 'eo/workbench/browser/src/app/pages/api/api.module';
import { ReplaySubject, Subject } from 'rxjs';
import { TabItem } from './tab.model';

@Injectable({
  providedIn: ApiModule,
})
/**
 * Storage api tab data
 */
export class ApiTabStorageService {
  tabs: Array<TabItem> = [];
  currentTab: TabItem;
  tabCache = {};
  /**
   * Tab Or Tab Content Change
   */
  tabChange$: ReplaySubject<TabItem> = new ReplaySubject(1);
  get tabID(): number {
    return this.currentTab.uuid;
  }
  constructor() {
    this.tabChange$.subscribe((tab) => {
      this.currentTab = tab;
    });
  }
  addData(inData) {
    this.tabCache[inData.tab.uuid] = inData.data;
  }
  removeData(tabID) {
    if (!this.tabCache.hasOwnProperty(tabID)) {
      return;
    }
    delete this.tabCache[tabID];
  }
  destroy() {
    this.tabChange$.complete();
    this.tabs = [];
    this.tabCache = {};
  }
}
