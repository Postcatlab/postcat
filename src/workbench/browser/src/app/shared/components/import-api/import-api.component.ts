import { Component, OnInit } from '@angular/core';
import { FeatureType } from '../../types';
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';

// const optionList = [
//   {
//     value: 'import',
//     type: 'string',
//     default: '',
//     label: '直接导入',
//     description: '直接导入',
//   },
//   {
//     value: 'add',
//     type: 'string',
//     default: true,
//     label: '增量更新[推荐]',
//     description: '增量更新',
//   },
//   {
//     value: 'all',
//     type: 'string',
//     default: '',
//     label: '全量更新[慎用]',
//     description: '全量更新',
//   },
//   {
//     value: 'new',
//     type: 'string',
//     default: '',
//     label: '仅添加新 API',
//     description: '仅添加新 API',
//   },
// ];

@Component({
  selector: 'eo-import-api',
  template: `<extension-select
    [allowDrag]="true"
    [(extension)]="currentExtension"
    [extensionList]="supportList"
    (uploadChange)="uploadChange($event)"
  ></extension-select>`,
})
export class ImportApiComponent implements OnInit {
  supportList: Array<FeatureType> = [];
  currentExtension = '';
  uploadData = null;
  featureMap = window.eo.getFeature('apimanage.import');
  constructor(
    private messageService: MessageService,
    private storage: StorageService,
    private eoMessage: EoMessageService
  ) {}
  ngOnInit(): void {
    this.featureMap?.forEach((data: FeatureType, key: string) => {
      this.supportList.push({
        key,
        ...data,
      });
    });
    {
      const { key } = this.supportList.at(0);
      this.currentExtension = key || '';
    }
  }
  uploadChange(data) {
    this.uploadData = data;
  }
  async submit(callback) {
    if(!this.uploadData){
      this.eoMessage.error($localize `Please import the file first`);
      return;
    }
    // * this.currentExtension is extension's key, like 'eoapi-import-openapi'
    const feature = this.featureMap.get(this.currentExtension);
    const action = feature.action || null;
    const module = await window.eo.loadFeatureModule(this.currentExtension);
    const { name, content } = this.uploadData;
    const [data, err] = module[action](content);
    if (err) {
      console.error(err.msg);
      callback(false);
      return;
    }
    this.storage.run('projectImport', [1, data], (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        this.messageService.send({
          type: 'importSuccess',
          data: { },
        });
      }
    });
    callback(true);
  }
}
