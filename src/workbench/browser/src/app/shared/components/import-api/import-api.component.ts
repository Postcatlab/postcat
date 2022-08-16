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
    // console.log(JSON.stringify(data, null, 2));
    const projectData = {
      items: [
        {
          name: '文件夹',
          items: [
            {
              name: '子文件夹1',
              items: [
                {
                  name: 'fdsf Copy Copy Copy Copy Copy Copy Copy Copy Copy Copy',
                  projectID: 1,
                  uri: 'fsdf/',
                  groupID: 0,
                  protocol: 'http',
                  method: 'POST',
                  requestBodyType: 'json',
                  requestBodyJsonType: 'object',
                  requestBody: [],
                  queryParams: [],
                  restParams: [],
                  requestHeaders: [],
                  responseHeaders: [],
                  responseBodyType: 'json',
                  responseBodyJsonType: 'object',
                  responseBody: [],
                  createdAt: '2022-08-15T07:23:08.507Z',
                  updatedAt: '2022-08-15T07:23:08.507Z',
                  uuid: 19,
                },
              ],
            },
            {
              name: '子文件夹',
            },
            {
              name: 'fdsf Copy Copy Copy Copy Copy Copy Copy Copy Copy Copy',
              projectID: 1,
              uri: 'fsdf/',
              groupID: 0,
              protocol: 'http',
              method: 'POST',
              requestBodyType: 'json',
              requestBodyJsonType: 'object',
              requestBody: [],
              queryParams: [],
              restParams: [],
              requestHeaders: [],
              responseHeaders: [],
              responseBodyType: 'json',
              responseBodyJsonType: 'object',
              responseBody: [],
              createdAt: '2022-08-15T07:23:08.507Z',
              updatedAt: '2022-08-15T07:23:08.507Z',
              uuid: 19,
            },
          ],
        },
      ],
      envList: [],
    };
    this.storage.run('projectImport', [1, projectData], (result: StorageRes) => {
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
