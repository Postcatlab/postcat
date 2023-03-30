import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { autorun } from 'mobx';
import { NzTreeNodeKey } from 'ng-zorro-antd/core/tree';
import { PageUniqueName } from 'pc/browser/src/app/pages/workspace/project/api/api-tab.service';
import {
  BASIC_TABS_INFO,
  Protocol,
  requestMethodMap,
  TabsConfig
} from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { TraceService } from 'pc/browser/src/app/services/trace.service';

import { ApiEffectService } from '../../store/api-effect.service';
import { ApiStoreService } from '../../store/api-state.service';
@Component({
  selector: 'eo-history',
  templateUrl: './eo-history.component.html',
  styleUrls: ['./eo-history.component.scss']
})
export class HistoryComponent implements OnInit {
  TEXT_BY_PROTOCOL = {
    [Protocol.WEBSOCKET]: 'WS',
    [Protocol.HTTP]: 'HTTP'
  };
  requestMethodMap = requestMethodMap;
  nzSelectedKeys: NzTreeNodeKey[];
  getTestHistory = [];
  constructor(
    private router: Router,
    private store: ApiStoreService,
    private trace: TraceService,
    private effect: ApiEffectService,
    @Inject(BASIC_TABS_INFO) public tabsConfig: TabsConfig
  ) {}

  ngOnInit(): void {
    this.effect.getHistoryList();
    autorun(() => {
      this.getTestHistory = this.store.getTestHistory;
    });
  }
  getRequestMethodText(node) {
    return this.requestMethodMap[node.origin?.request?.apiAttrInfo?.requestMethod];
  }
  renderRequestMethodText(node) {
    if (node.origin?.request?.protocol === Protocol.WEBSOCKET) return 'WS';
    const method = this.getRequestMethodText(node);
    if (!method) return 'HTTP';
    return method.length > 5 ? method.slice(0, 3) : method;
  }
  gotoTestHistory(e) {
    this.trace.report('click_api_test_history');
    this.nzSelectedKeys = [];
    const origin = e.node.origin;
    const path =
      origin.request?.protocol === Protocol.WEBSOCKET
        ? this.tabsConfig.pathByName[PageUniqueName.WsTest]
        : this.tabsConfig.pathByName[PageUniqueName.HttpTest];
    this.router.navigate([path], {
      queryParams: {
        uuid: `history_${origin.id}`
      }
    });
  }

  clearAllHistory() {
    this.effect.deleteHistory();
  }
}
