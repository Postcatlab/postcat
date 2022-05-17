import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { StorageHandleResult, StorageHandleStatus } from '../../../../../../../platform/browser/IndexedDB';
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
    // TODO 临时取值方式需要修改
    const url = window.eo.getModuleSettings('eolink.remoteServer.url');
    const secretKey = window.eo.getModuleSettings('eolink.remoteServer.token');
    const projectId = window.eo.getModuleSettings('eolink.remoteServer.projectId');
    if (module && module[action] && typeof module[action] === 'function') {
      this.storage.run('projectExport', [], async (result: StorageHandleResult) => {
        if (result.status === StorageHandleStatus.success) {
          result.data.version = packageJson.version;
          try {
            const output = await module[action](result.data, {
              url,
              projectId,
              secretKey,
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
