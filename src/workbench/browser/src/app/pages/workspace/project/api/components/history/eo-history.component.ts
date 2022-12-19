import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { NzTreeNodeKey } from 'ng-zorro-antd/core/tree';
import { Subject, takeUntil } from 'rxjs';

import { MessageService } from '../../../../../../shared/services/message';

@Component({
  selector: 'eo-history',
  templateUrl: './eo-history.component.html',
  styleUrls: ['./eo-history.component.scss']
})
export class HistoryComponent implements OnInit {
  TEXT_BY_PROTOCOL = {
    ws: 'WS'
  };
  historyList = [];
  nzSelectedKeys: NzTreeNodeKey[];
  colorHash = new Map().set('get', 'green').set('post', 'blue').set('delete', 'red').set('put', 'pink');
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private storage: StorageService, private router: Router, private message: MessageService, private store: StoreService) {}
  async ngOnInit() {
    const result = await this.loadAllTest();
    this.historyList = (result || []).reverse().map(n => ({ ...n, title: n.request?.uri, key: n.uuid }));
    this.message
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe(async ({ type }) => {
        if (type === 'updateHistory') {
          const data = await this.loadAllTest();
          this.historyList = data.reverse();
        }
      });
  }

  loadAllTest() {
    // return this.storageInstance.apiTestHistoryLoadAllByProjectID(1);
    return new Promise<any[]>(resolve => {
      this.storage.run('apiTestHistoryLoadAllByProjectID', [this.store.getCurrentProjectID], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          resolve(result.data);
        } else {
          console.error(result.data);
          resolve(result.data);
        }
      });
    });
  }

  methodColor(type) {
    return this.colorHash.get(type.toLowerCase());
  }

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
    const uuids = this.historyList.map(it => it.uuid);
    this.storage.run('apiTestHistoryBulkRemove', [uuids], (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        this.historyList = [];
      }
    });
  }
  cancel() {}
}
