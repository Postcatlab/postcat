import { Component, OnInit } from '@angular/core';
import { FeatureType } from '../../types';
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { ExtensionService } from 'eo/workbench/browser/src/app/pages/extension/extension.service';

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
  featureMap = window.eo?.getFeature('apimanage.import');
  constructor(
    private messageService: MessageService,
    private storage: StorageService,
    private eoMessage: EoMessageService,
    public extensionService: ExtensionService
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
  uploadChange(data) {
    this.uploadData = data;
  }
  async submit(callback) {
    if (!this.uploadData) {
      this.eoMessage.error($localize`Please import the file first`);
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
    //The datastructure may has circular reference,decycle by reset object;
    const decycle = (obj, parent?) => {
      const parentArr = parent || [obj];
      for (const i in obj) {
        if (typeof obj[i] === 'object') {
          parentArr.forEach((pObj) => {
            if (pObj === obj[i]) {
              obj[i] = {
                description: $localize`Same as the parent's field ${obj[i].name}`,
                example: '',
                name: obj[i].name,
                required: true,
                type: obj[i].type,
              };
            }
          });
          decycle(obj[i], [...parentArr, obj[i]]);
        }
      }
      return obj;
    };
    this.storage.run('projectImport', [1, decycle(data)], (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        this.messageService.send({
          type: 'importSuccess',
          data: {},
        });
      }
    });
    callback(true);
  }
}
