import { Component, OnInit } from '@angular/core';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service';
import { StorageService } from '../../../shared/services/storage';
import { FeatureType } from '../../types';
import { getDefaultValue, updateStrategy } from '../../../utils';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';

const optionList = [
  {
    value: 'import',
    type: 'string',
    default: '',
    label: '直接导入',
    description: '直接导入',
  },
  {
    value: 'add',
    type: 'string',
    default: true,
    label: '增量更新[推荐]',
    description: '增量更新',
  },
  {
    value: 'all',
    type: 'string',
    default: '',
    label: '全量更新[慎用]',
    description: '全量更新',
  },
  {
    value: 'new',
    type: 'string',
    default: '',
    label: '仅添加新 API',
    description: '仅添加新 API',
  },
];

@Component({
  selector: 'eo-import-api',
  template: `<extension-select
    [allowDrag]="true"
    [optionList]="optionList"
    [(currentOption)]="currentOption"
    [(extension)]="currentExtension"
    [extensionList]="supportList"
    (uploadChange)="uploadChange($event)"
  ></extension-select>`,
})
export class ImportApiComponent implements OnInit {
  supportList: Array<FeatureType> = [];
  currentExtension = '';
  currentOption = '';
  optionList = optionList;
  uploadData = null;
  featureMap = window.eo.getFeature('apimanage.import');
  constructor(
    private storage: StorageService,
    private message: EoMessageService,
    private messageService: MessageService
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
      this.currentOption = getDefaultValue(this.optionList, 'value');
    }
  }
  uploadChange(data) {
    this.uploadData = data;
  }
  getEoapiData() {
    return new Promise((resolve) => {
      this.storage.run('projectExport', [], (result: StorageRes) => {
        const isOk = result.status === StorageResStatus.success;
        resolve(isOk ? [result.data, null] : [null, true]);
      });
    });
  }
  async submit(callback) {
    // * this.currentExtension is extension's key, like 'eoapi-import-openapi'
    const feature = this.featureMap.get(this.currentExtension);
    const action = feature.action || null;
    const module = window.eo.loadFeatureModule(this.currentExtension);
    const data = module[action](this.uploadData);
    const [oldData, err]: any = await this.getEoapiData();
    if (err) {
      return;
    }
    const result = updateStrategy(oldData, data, this.currentOption);
    // this.messageService.send({
    //   type: 'importSuccess',
    //   data: JSON.stringify(data),
    // });
    console.log(JSON.stringify(result, null, 2));
    callback(true);
  }
}
