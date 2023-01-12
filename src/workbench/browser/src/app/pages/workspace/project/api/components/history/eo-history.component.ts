import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { NzTreeNodeKey } from 'ng-zorro-antd/core/tree';

@Component({
  selector: 'eo-history',
  templateUrl: './eo-history.component.html',
  styleUrls: ['./eo-history.component.scss']
})
export class HistoryComponent {
  TEXT_BY_PROTOCOL = {
    ws: 'WS'
  };
  nzSelectedKeys: NzTreeNodeKey[];

  constructor(private router: Router, public store: StoreService, private effect: EffectService) {}

  gotoTestHistory(e) {
    this.nzSelectedKeys = [];
    const origin = e.node.origin;
    const protocol = origin.request?.protocol === 'ws' ? 'ws' : 'http';
    this.router.navigate([`home/workspace/project/api/${protocol}/test`], {
      queryParams: {
        uuid: `history_${origin.uuid}`
      }
    });
  }

  clearAllHistory() {
    this.effect.deleteHistory();
  }
}
