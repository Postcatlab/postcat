import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { StorageRes, StorageResStatus } from '../../services/storage/index.model';
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
  featureList = window.eo.getFeature('apimanage.sync');
  constructor(private modalRef: NzModalRef, private storage: StorageService) {}

  ngOnInit(): void {
    console.log('featureList', this.featureList);
    this.featureList?.forEach((feature: object, key: string) => {
      this.supportList.push({
        key,
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
    const {
      url,
      token: secretKey,
      projectId,
    } = window.eo.getModuleSettings('eoapi-feature-push-eolink.eolink.remoteServer');
    if (module && module[action] && typeof module[action] === 'function') {
      this.storage.run('projectExport', [], async (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
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
