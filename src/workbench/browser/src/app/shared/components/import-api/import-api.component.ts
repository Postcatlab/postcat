import { Component, OnInit } from '@angular/core';
import { StorageHandleResult, StorageHandleStatus } from 'eo/platform/browser/IndexedDB';
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service';
import { StorageService } from '../../../shared/services/storage';
import { FeatureType } from '../../types';
import { parserProperties, getDefaultValue } from '../../../utils';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';

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
  optionList = [];
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
    const [target] = this.supportList;
    this.currentExtension = target.key;
    this.optionList = parserProperties(target.properties);
    this.currentOption = getDefaultValue(this.optionList, 'value');
  }
  getEoapiData() {
    return new Promise((resolve) => {
      this.storage.run('projectExport', [], (result: StorageHandleResult) => {
        const isOk = result.status === StorageHandleStatus.success;
        resolve(isOk ? [result.data, null] : [null, true]);
      });
    });
  }
  uploadChange(data) {
    this.uploadData = data;
  }
  async submit() {
    const [eoapiData, err]: any = await this.getEoapiData();
    if (err) {
      this.message.error('获取本地数据失败');
      return;
    }
    // * this.currentExtension is extension's key, like 'eoapi-import-openapi'
    const feature = this.featureMap.get(this.currentExtension);
    const action = feature.action || null;
    // const filename = feature.filename || null;
    const module = window.eo.loadFeatureModule(this.currentExtension);
    const data = module[action](eoapiData, this.uploadData, this.currentOption);
    // this.storage.run('groupBulkRemove', [[9]], (result: StorageHandleResult) => {
    //   console.log('=>', result);
    // });
    // this.storage.run('apiDataBulkRemove', [[60, 61]], (result: StorageHandleResult) => {
    //   console.log('=!!>', result);
    // });
    this.message.success('导入成功');
    this.messageService.send({
      type: 'importSuccess',
      data: JSON.stringify(data),
    });
    console.log(JSON.stringify(data));
  }
}
