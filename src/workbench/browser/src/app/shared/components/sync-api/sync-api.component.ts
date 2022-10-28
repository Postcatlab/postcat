import { Component, OnInit } from '@angular/core';
import { StorageRes, StorageResStatus } from '../../services/storage/index.model';
import { StorageService } from '../../services/storage';
import packageJson from '../../../../../../../../package.json';
import { FeatureInfo } from 'eo/platform/node/extension-manager/types';
import { ExtensionService } from 'eo/workbench/browser/src/app/pages/extension/extension.service';

@Component({
  selector: 'eo-sync-api',
  template: `<extension-select [(extension)]="currentExtension" [extensionList]="supportList"></extension-select>`,
})
export class SyncApiComponent implements OnInit {
  currentExtension = '';
  supportList: any[] = [];
  featureMap = window.eo.getFeature('apimanage.sync');
  constructor(private storage: StorageService, public extensionService: ExtensionService) {}

  ngOnInit(): void {
    this.featureMap?.forEach((data: FeatureInfo, key: string) => {
      if (this.extensionService.isEnable(data.extensionName)) {
        this.supportList.push({
          key,
          ...data,
        });
      }
    });
    {
      const { key } = this.supportList.at(0);
      this.currentExtension = key || '';
    }
  }
  async submit() {
    const feature = this.featureMap.get(this.currentExtension);
    const action = feature.action || null;
    const module = window.eo.loadFeatureModule(this.currentExtension);
    // TODO 临时取值方式需要修改
    const { token: secretKey, projectId } = window.eo?.getModuleSettings(
      'eoapi-feature-push-eolink.eolink.remoteServer'
    );
    if (module && module[action] && typeof module[action] === 'function') {
      this.storage.run('projectExport', [], async (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          result.data.version = packageJson.version;
          try {
            const output = await module[action](result.data, {
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
