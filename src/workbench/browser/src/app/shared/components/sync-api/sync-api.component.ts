import { Component, OnInit } from '@angular/core';
import { StorageHandleResult, StorageHandleStatus } from 'eo/platform/browser/IndexedDB';
import { StorageService } from '../../services/storage';
import packageJson from '../../../../../../../../package.json';
import { FeatureType } from '../../types';

@Component({
  selector: 'eo-sync-api',
  template: `<extension-select [(extension)]="pushType" [extensionList]="supportList"></extension-select>`,
})
export class SyncApiComponent implements OnInit {
  pushType = '';
  supportList: any[] = [];
  featureMap = window.eo.getFeature('apimanage.sync');
  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    this.featureMap?.forEach((data: FeatureType, key: string) => {
      this.supportList.push({
        key,
        ...data,
      });
    });
  }
  async submit() {
    const feature = this.featureMap.get(this.pushType);
    const action = feature.action || null;
    const module = window.eo.loadFeatureModule(this.pushType);
    // TODO 临时取值方式需要修改
    const {
      url,
      token: secretKey,
      projectId,
    } = window.eo.getModuleSettings('eoapi-feature-push-eolink.eolink.remoteServer');
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
