import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IndexedDBStorage } from '../../../../../../../workbench/browser/src/app/shared/services/storage/IndexedDB/lib/index';
import { MessageService } from '../../../shared/services/message';

@Component({
  selector: 'eo-history',
  templateUrl: './eo-history.component.html',
  styleUrls: ['./eo-history.component.scss'],
})
export class HistoryComponent implements OnInit {
  historyList = [];
  colorHash = new Map().set('get', 'green').set('post', 'blue').set('delete', 'red').set('put', 'pink');
  constructor(public storageInstance: IndexedDBStorage, private router: Router, private message: MessageService) {}
  ngOnInit() {
    const observer = this.loadAllTest();
    observer.subscribe((result: any) => {
      // console.log(result.data);
      this.historyList = result.data.reverse();
    });
    this.message.get().subscribe(({ type }) => {
      if (type === 'updateHistory') {
        this.loadAllTest().subscribe((result: any) => {
          this.historyList = result.data.reverse();
        });
      }
    });
  }

  loadAllTest() {
    return this.storageInstance.apiTestHistoryLoadAllByProjectID(1);
  }

  methodColor(type) {
    return this.colorHash.get(type.toLowerCase());
  }

  gotoTestHistory(data) {
    this.router.navigate(['home/api/test'], {
      queryParams: {
        pageID: Date.now(),
        uuid:`history_${data.uuid}`
      },
    });
  }

  clearAllHistory() {
    const uuids = this.historyList.map((it) => it.uuid);
    this.historyList = [];
    this.storageInstance.apiTestHistoryBulkRemove(uuids);
  }
  cancel() {}
}
