import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { StorageHandleResult, StorageHandleStatus } from '../../services/storage/index.model';
import { StorageService } from '../../services/storage';
import packageJson from '../../../../../../../../package.json';

@Component({
  selector: 'eo-sync-api',
  templateUrl: './sync-api.component.html',
  styleUrls: ['./sync-api.component.scss'],
})
export class SyncApiComponent implements OnInit {
  pushType: '';
  supportList: any[] = [];
  featureList = window.eo.getFeature('apimanager.sync');
  constructor(private modalRef: NzModalRef, private storage: StorageService) {}

  ngOnInit(): void {
    this.featureList?.forEach((feature: object, key: string) => {
      this.supportList.push({
        key: key,
        image: feature['icon'],
        title: feature['label'],
      });
    });
  }
  async submit() {
    const feature = this.featureList.get(this.pushType);
    const action = feature.action || null;
    const module = window.eo.loadFeatureModule(this.pushType);
    if (module && module[action] && typeof module[action] === 'function') {
      this.storage.run('projectExport', [], async (result: StorageHandleResult) => {
        if (result.status === StorageHandleStatus.success) {
          result.data.version = packageJson.version;
          try {
            const output = await module[action](result.data, {
              projectId: 'ZXXhzTG756db7e34a8d7c803f001edf1a1c545bcbf27719',
              SecretKey: 'SgAZ5Lk60f776c1a235a3c3e62543c3793c36d6cc511db9',
            });
            console.log(output);
          } catch (e) {
            console.log(e);
          }
        }
      });
    }
  }
}
