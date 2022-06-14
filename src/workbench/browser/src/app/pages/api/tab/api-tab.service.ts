import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { AppModule } from '../../../app.module';
import { TabItem } from './tab.model';

@Injectable({
  providedIn:AppModule
})
export class ApiTabService {
  tabs: Array<TabItem> = [];
  currentTab: TabItem;
  tabCache = {};
  /**
   * Tab Or Tab Content Change
   */
  tabChange$: ReplaySubject<TabItem> = new ReplaySubject(1);
  saveTabData$: Subject<{ tab: TabItem; data: any }> = new Subject();
  get tabID(): number {
    return this.currentTab.uuid;
  }
  constructor() {
    this.saveTabData$.subscribe((inData) => {
      this.addData(inData);
    });
    this.tabChange$.subscribe((tab) => {
      this.currentTab = tab;
    });
  }
  addData(inData) {
    this.tabCache[inData.tab.uuid] = inData.data;
  }
  removeData(tabID) {
    if (!this.tabCache.hasOwnProperty(tabID)) return;
    delete this.tabCache[tabID];
  }
  destroy(){
    this.saveTabData$.complete();
    this.tabChange$.complete();
    this.tabs=[];
    this.tabCache={};
  }
}
