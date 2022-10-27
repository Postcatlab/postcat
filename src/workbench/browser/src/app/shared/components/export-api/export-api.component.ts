import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../shared/services/storage';
import { StorageRes, StorageResStatus } from '../../services/storage/index.model';
import packageJson from '../../../../../../../../package.json';
import { FeatureType } from '../../types';
import { ModuleInfo } from 'eo/platform/node/extension-manager';
import { ExtensionService } from 'eo/workbench/browser/src/app/pages/extension/extension.service';
import { ProjectService } from 'eo/workbench/browser/src/app/shared/services/project/project.service';
import { WebExtensionService } from 'eo/workbench/browser/src/app/shared/services/web-extension/webExtension.service';

@Component({
  selector: 'eo-export-api',
  template: ` <extension-select [(extension)]="currentExtension" [extensionList]="supportList"></extension-select> `,
})
export class ExportApiComponent implements OnInit {
  currentExtension = 'eoapi';
  supportList: Array<FeatureType> = [];
  featureMap = window.eo?.getFeature('apimanage.export') || this.webExtensionService.getFeatures('apimanage.export');
  constructor(
    private storage: StorageService,
    private projectService: ProjectService,
    public extensionService: ExtensionService,
    public webExtensionService: WebExtensionService
  ) {}
  ngOnInit(): void {
    this.featureMap?.forEach((data: FeatureType, key: string) => {
      if (this.extensionService.isEnable(data.name)) {
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
   * Default export
   *
   * @param callback
   */
  private exportEoapi(callback) {
    const params = [this.projectService.currentProjectID];
    this.storage.run('projectExport', params, (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        result.data.version = packageJson.version;
        this.transferTextToFile('Eoapi-export.json', result.data);
        callback(true);
      } else {
        callback(false);
      }
    });
  }

  /**
   * Module export
   * callback应该支持返回具体的错误信息显示
   *
   * @param callback
   */
  private async export(callback) {
    const feature = this.featureMap.get(this.currentExtension);
    const action = feature.action || null;
    const filename = feature.filename || null;
    const module: ModuleInfo =
      (await window.eo?.loadFeatureModule(this.currentExtension)) || globalThis[this.currentExtension];
    if (action && filename && module && module[action] && typeof module[action] === 'function') {
      const params = [this.projectService.currentProjectID];
      this.storage.run('projectExport', params, (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          console.log('result.data', result.data);
          result.data.version = packageJson.version;
          const output = module[action](result || {});
          this.transferTextToFile(filename, output);
          callback(true);
        } else {
          callback(false);
        }
      });
    } else {
      callback(false);
    }
  }
}
