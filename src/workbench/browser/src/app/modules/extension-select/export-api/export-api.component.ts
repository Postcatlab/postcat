import { Component, OnInit } from '@angular/core';
import { ExtensionService } from 'eo/workbench/browser/src/app/pages/extension/extension.service';
import { ModuleInfo, FeatureInfo } from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import StorageUtil from 'eo/workbench/browser/src/app/utils/storage/Storage';
import { has } from 'lodash-es';

import { StorageRes, StorageResStatus } from '../../../shared/services/storage/index.model';

@Component({
  selector: 'eo-export-api',
  template: `<extension-select [(extension)]="currentExtension" [extensionList]="supportList"></extension-select> `
})
export class ExportApiComponent implements OnInit {
  currentExtension = StorageUtil.get('export_api_modal');
  supportList: any[] = [];
  featureMap: Map<string, FeatureInfo>;
  constructor(private storage: StorageService, private store: StoreService, private extensionService: ExtensionService) {
    this.featureMap = this.extensionService.getValidExtensionsByFature('exportAPI');
  }
  ngOnInit(): void {
    this.featureMap?.forEach((data: FeatureInfo, key: string) => {
      this.supportList.push({
        key,
        ...data
      });
    });
    {
      const { key } = this.supportList.at(0);
      if (!(this.currentExtension && this.supportList.find(val => val.key === this.currentExtension))) {
        this.currentExtension = key || '';
      }
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
    StorageUtil.set('export_api_modal', this.currentExtension);
    const feature = this.featureMap.get(this.currentExtension);
    const action = feature.action || null;
    const filename = feature.filename || 'export.json';
    const module = await this.extensionService.getExtensionPackage(this.currentExtension);
    if (action && module?.[action] && typeof module[action] === 'function') {
      const params = [this.store.getCurrentProjectID];
      this.storage.run('projectExport', params, (result: StorageRes) => {
        console.log(result);
        if (result.status === StorageResStatus.success) {
          console.log('projectExport result', result.data);
          try {
            let output = module[action](result || {});
            //Change format
            if (has(output, 'status') && output.status === 0) {
              output = output.data;
            }
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
