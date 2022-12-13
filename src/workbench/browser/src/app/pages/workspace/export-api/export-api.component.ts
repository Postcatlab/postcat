import { Component, OnInit } from '@angular/core';
import { ExtensionService } from 'eo/workbench/browser/src/app/pages/extension/extension.service';
import { ModuleInfo, FeatureInfo } from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { WebExtensionService } from 'eo/workbench/browser/src/app/shared/services/web-extension/webExtension.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

import packageJson from '../../../../../../../../package.json';
import { StorageRes, StorageResStatus } from '../../../shared/services/storage/index.model';

@Component({
  selector: 'eo-export-api',
  template: `<extension-select [(extension)]="currentExtension" [extensionList]="supportList"></extension-select> `
})
export class ExportApiComponent implements OnInit {
  currentExtension = 'eoapi';
  supportList: any[] = [];
  featureMap = this.webExtensionService.getFeatures('exportAPI') || this.webExtensionService.getFeatures('apimanage.export');
  constructor(
    private storage: StorageService,
    private store: StoreService,
    public extensionService: ExtensionService,
    public webExtensionService: WebExtensionService
  ) {}
  ngOnInit(): void {
    this.featureMap?.forEach((data: FeatureInfo, key: string) => {
      if (this.webExtensionService.isEnable(key)) {
        this.supportList.push({
          key,
          ...data
        });
      }
    });
    {
      const { key } = this.supportList?.at(0);
      this.currentExtension = key || '';
    }
  }
  submit(callback: () => boolean) {
    this.export(callback);
  }
  private transferTextToFile(fileName: string, exportData: any) {
    const file = new Blob([JSON.stringify(exportData)], { type: 'data:text/plain;charset=utf-8' });
    const element = document.createElement('a');
    const url = URL.createObjectURL(file);
    element.href = url;
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    setTimeout(() => {
      document.body.removeChild(element);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
  /**
   * Module export
   * TODO callback show support specific error tips
   *
   * @param callback
   */
  private async export(callback) {
    const feature = this.featureMap.get(this.currentExtension);
    const action = feature.action || null;
    const filename = feature.filename || null;
    const module: ModuleInfo = await window.eo?.loadFeatureModule?.(this.currentExtension);
    if (action && filename && module && module[action] && typeof module[action] === 'function') {
      const params = [this.store.getCurrentProjectID];
      this.storage.run('projectExport', params, (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          console.log('projectExport result', result.data);
          result.data.version = packageJson.version;
          try {
            const output = module[action](result || {});
            if (filename) {
              this.transferTextToFile(filename, output);
            }
            callback(true);
          } catch (e) {
            console.error(e);
            callback(false);
          }
        } else {
          callback(false);
        }
      });
    } else {
      callback(false);
    }
  }
}
