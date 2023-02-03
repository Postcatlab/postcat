import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Protocol, requestMethodMap } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { eoDeepCopy } from 'eo/workbench/browser/src/app/utils/index.utils';
import { autorun } from 'mobx';
import { NzTreeNodeKey } from 'ng-zorro-antd/core/tree';

import { ApiEffectService } from '../../service/store/api-effect.service';
import { ApiStoreService } from '../../service/store/api-state.service';
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
  constructor(private router: Router, private store: ApiStoreService, private effect: ApiEffectService) {}

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
    this.nzSelectedKeys = [];
    const origin = e.node.origin;
    const protocol = origin.request?.protocol === Protocol.WEBSOCKET ? 'ws' : 'http';
    this.router.navigate([`home/workspace/project/api/${protocol}/test`], {
      queryParams: {
        uuid: `history_${origin.id}`
      }
    });
  }

  clearAllHistory() {
    this.effect.deleteHistory();
  }
}
