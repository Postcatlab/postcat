import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../shared/services/storage';
import { StorageHandleResult, StorageHandleStatus } from 'eo/platform/browser/IndexedDB';
import packageJson from '../../../../../../../../package.json';
import { FeatureType } from '../../types';

@Component({
  selector: 'eo-export-api',
  template: ` <extension-select [(extension)]="exportType" [extensionList]="supportList"></extension-select> `,
})
export class ExportApiComponent implements OnInit {
  exportType = 'eoapi';
  supportList: Array<FeatureType> = [
    {
      key: 'eoapi',
      icon: 'assets/images/logo.svg',
      label: 'Eoapi',
      description: '',
    },
  ];
  featureMap = window.eo.getFeature('apimanage.export');
  constructor(private storage: StorageService) {}
  ngOnInit(): void {
    this.featureMap?.forEach((data: FeatureType, key: string) => {
      this.supportList.push({
        key,
        ...data,
      });
    });
  }
  submit(callback: () => boolean) {
    if ('eoapi' === this.exportType) {
      this.exportEoapi(callback);
    } else {
      this.export(callback);
    }
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
   * @param callback
   */
  private exportEoapi(callback) {
    this.storage.run('projectExport', [], (result: StorageHandleResult) => {
      if (result.status === StorageHandleStatus.success) {
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
   * @param callback
   */
  private export(callback) {
    const feature = this.featureMap.get(this.exportType);
    const action = feature.action || null;
    const filename = feature.filename || null;
    const module = window.eo.loadFeatureModule(this.exportType);
    if (action && filename && module && module[action] && typeof module[action] === 'function') {
      this.storage.run('projectExport', [], (result: StorageHandleResult) => {
        if (result.status === StorageHandleStatus.success) {
          result.data.version = packageJson.version;
          try {
            const output = module[action](result || {});
            this.transferTextToFile(filename, output);
            callback(true);
          } catch (e) {
            console.log(e);
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
