import { ReplaySubject, Subject } from 'rxjs';
import { TabItem } from './tab.model';

export class ApiTabService {
  currentTab: TabItem;
  tabs = {};
  tabChange$: ReplaySubject<TabItem> = new ReplaySubject(1);
  saveTabData$: Subject<{ tab: TabItem; data: any }> = new Subject();
  constructor() {
    this.saveTabData$.subscribe((inData) => {
      this.tabs[inData.tab.uuid] = inData.data;
    });
    this.tabChange$.subscribe((tab) => {
      this.currentTab = tab;
    });
  }
}
