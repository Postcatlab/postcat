import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'eo-sync-api',
  templateUrl: './sync-api.component.html',
  styleUrls: ['./sync-api.component.scss'],
})
export class SyncApiComponent implements OnInit {
  exportType: string = 'eolink';
  supportList: any[] = [];
  constructor(private modalRef: NzModalRef, private storage: StorageService) {}

  ngOnInit(): void {
    const extensionList = window.eo.getModules();
    this.supportList = Object.values([...extensionList])
      .map((it) => it[1])
      .filter((it) => it.moduleType === 'feature')
      .filter((it) => it.features['apimanager.sync'])
      .map((it: any) => ({
        key: it.moduleName,
        image: it.logo,
        title: it.features['apimanager.sync'].label,
      }));
  }
  async submit() {
    console.log('sync');
    // const res = await sync_to_remote(
    //   { a: 1 },
    //   {
    //     projectId: 'ZXXhzTG756db7e34a8d7c803f001edf1a1c545bcbf27719',
    //     SecretKey: 'SgAZ5Lk60f776c1a235a3c3e62543c3793c36d6cc511db9',
    //   }
    // );
    // console.log(res);
  }
}
