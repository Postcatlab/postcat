import { Component, OnInit } from '@angular/core';
import { StorageRes, StorageResStatus } from '../../../shared/services/storage/index.model';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import packageJson from '../../../../../../../../package.json';
import { FeatureInfo } from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { ExtensionService } from 'eo/workbench/browser/src/app/pages/extension/extension.service';
import { WebExtensionService } from 'eo/workbench/browser/src/app/shared/services/web-extension/webExtension.service';
import { SettingService } from 'eo/workbench/browser/src/app/modules/setting/settings.service';

@Component({
  selector: 'eo-sync-api',
  template: `<extension-select [(extension)]="currentExtension" [extensionList]="supportList"></extension-select>`,
})
export class SyncApiComponent implements OnInit {
  currentExtension = '';
  supportList: any[] = [];
  featureMap =
    this.webExtensionService.getFeatures('syncAPI') || this.webExtensionService.getFeatures('apimanage.sync');
  constructor(
    private storage: StorageService,
    public extensionService: ExtensionService,
    public webExtensionService: WebExtensionService,
    private settingService: SettingService
  ) {}

  ngOnInit(): void {
    this.featureMap?.forEach((data: FeatureInfo, key: string) => {
      if (this.webExtensionService.isEnable(key)) {
        this.supportList.push({
          key,
          ...data,
        });
      }
    });
    {
      const { key } = this.supportList?.at(0);
      this.currentExtension = key || '';
    }
  }
  async submit(callback) {
    const feature = this.featureMap.get(this.currentExtension);
    const action = feature.action || null;
    const module = window.eo.loadFeatureModule(this.currentExtension);
    const { token: secretKey, projectId } = this.settingService.getConfiguration(this.currentExtension);
    if (module && module[action] && typeof module[action] === 'function') {
      this.storage.run('projectExport', [], async (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          result.data.version = packageJson.version;
          try {
            const output = await module[action](result.data, {
              projectId,
              secretKey,
            });
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
