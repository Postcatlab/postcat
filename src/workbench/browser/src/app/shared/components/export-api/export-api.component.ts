import { Component, Input, OnInit } from '@angular/core';
import { StorageService } from '../../../shared/services/storage';
import { StorageHandleResult, StorageHandleStatus } from '../../../../../../../platform/browser/IndexedDB';
import packageJson from '../../../../../../../../package.json';
@Component({
  selector: 'eo-export-api',
  templateUrl: './export-api.component.html',
  styleUrls: ['./export-api.component.scss'],
})
export class ExportApiComponent implements OnInit {
  exportType: string = 'eoapi';
  supportList: Array<object> = [
    {
      key: 'eoapi',
      image: '',
      title: 'Eoapi(.json)'
    }
  ];
  featureList = window.eo.getFeature('apimanager.export');
  constructor(private storage: StorageService) {}
  ngOnInit(): void {
    this.featureList?.forEach((feature: object, key: string) => {
      this.supportList.push({
        key: key,
        image: feature['icon'],
        title: feature['label']
      });
    });
  }
  private transferTextToFile(fileName: string, exportData: any) {
    let file = new Blob([JSON.stringify(exportData)], { type: 'data:text/plain;charset=utf-8' });
    let element = document.createElement('a'),
      url = URL.createObjectURL(file);
    element.href = url;
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    setTimeout(function () {
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
    const feature = this.featureList.get(this.exportType);
    const action = feature.action || null;
    const filename = feature.filename || null;
    const module = window.eo.loadFeatureModule(this.exportType);
    if (action && filename && module && module[action] && typeof module[action] === 'function') {
      this.storage.run('projectExport', [], (result: StorageHandleResult) => {
        if (result.status === StorageHandleStatus.success) {
          result.data.version = packageJson.version;
          try {
            const output = module[action](result);
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

  submit(callback: () => boolean) {
    console.log(this.exportType);
    if ('eoapi' === this.exportType) {
      this.exportEoapi(callback); 
    } else {
      this.export(callback);
    }
  }
}
