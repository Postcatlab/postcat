import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../shared/services/storage';
import { StorageRes, StorageResStatus } from '../../services/storage/index.model';
import packageJson from '../../../../../../../../package.json';
@Component({
  selector: 'eo-export-api',
  templateUrl: './export-api.component.html',
  styleUrls: ['./export-api.component.scss'],
})
export class ExportApiComponent implements OnInit {
  exportType: string = 'eoapi';
  supportList: Array<{
    key: string;
    image: string;
    title: string;
  }> = [
    {
      key: 'eoapi',
      image: '',
      title: 'Eoapi(.json)',
    },
  ];
  featureList = window.eo.getFeature('apimanage.export');
  constructor(private storage: StorageService) {}
  ngOnInit(): void {
    this.featureList?.forEach((feature: object, key: string) => {
      this.supportList.push({
        key,
        image: feature['icon'],
        title: feature['label'],
      });
    });
  }
  submit(callback: () => boolean) {
    console.log(this.exportType);
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
    this.storage.run('projectExport', [], (result: StorageRes) => {
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
   * @param callback
   */
  private export(callback) {
    const feature = this.featureList.get(this.exportType);
    const action = feature.action || null;
    const filename = feature.filename || null;
    const module = window.eo.loadFeatureModule(this.exportType);
    if (action && filename && module && module[action] && typeof module[action] === 'function') {
      this.storage.run('projectExport', [], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          result.data.version = packageJson.version;
          try {
            console.log(JSON.stringify(result, null, 2));
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
