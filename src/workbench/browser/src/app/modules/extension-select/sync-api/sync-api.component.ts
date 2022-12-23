import { Component, OnInit } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { SettingService } from 'eo/workbench/browser/src/app/modules/system-setting/settings.service';
import { ExtensionService } from 'eo/workbench/browser/src/app/pages/extension/extension.service';
import { FeatureInfo } from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { has } from 'lodash-es';

import packageJson from '../../../../../../../../package.json';
import { StorageRes, StorageResStatus } from '../../../shared/services/storage/index.model';

@Component({
  selector: 'eo-sync-api',
  template: `<extension-select [(extension)]="currentExtension" [extensionList]="supportList"></extension-select>`
})
export class SyncApiComponent implements OnInit {
  currentExtension = '';
  supportList: any[] = [];
  featureMap = this.extensionService.getValidExtensionsByFature('syncAPI');
  constructor(
    private storage: StorageService,
    private extensionService: ExtensionService,
    private settingService: SettingService,
    private eoMessage: EoNgFeedbackMessageService
  ) {}

  ngOnInit(): void {
    this.featureMap?.forEach((data: FeatureInfo, key: string) => {
      this.supportList.push({
        key,
        ...data
      });
    });
    {
      const { key } = this.supportList?.at(0);
      this.currentExtension = key || '';
    }
  }
  async submit(callback) {
    const feature = this.featureMap.get(this.currentExtension);
    if (!feature) {
      callback(false);
    }
    const action = feature.action || null;
    const module = await this.extensionService.getExtensionPackage(this.currentExtension);
    if (module?.[action] && typeof module[action] === 'function') {
      this.storage.run('projectExport', [], async (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          result.data.version = packageJson.version;
          try {
            const output = await module[action](result.data);
            if (has(output, 'status') && output.status !== 0) {
              this.eoMessage.error(output.message);
              callback('stayModal');
              return;
            }
            callback(true);
          } catch (e) {
            console.log(e);
            callback(false);
          }
        }
      });
    }
  }
}
