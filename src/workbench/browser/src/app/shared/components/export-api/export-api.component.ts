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
  supportList: any[] = [
    // {
    //   key: 'eoapi',
    //   image: '',
    //   title: 'Eoapi(.json)',
    // },
  ];
  constructor(private storage: StorageService) {}
  ngOnInit(): void {
    const extensionList = window.eo.getModules();
    console.log(
      '==>',
      JSON.stringify(
        Object.values([...extensionList]).map((it) => it[1].features),
        null,
        2
      )
    );
    this.supportList = Object.values([...extensionList])
      .map((it) => it[1])
      .filter((it) => it.moduleType === 'feature')
      .filter((it) => it.features['apimanager.export'])
      .map((it: any) => ({
        key: it.moduleName,
        image: it.logo,
        title: it.features['apimanager.export'].label,
      }));
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
  submit(callback: () => boolean) {
    switch (this.exportType) {
      case 'eoapi': {
        this.exportEoapi(callback);
        break;
      }
    }
  }
}
