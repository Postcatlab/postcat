import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { old2new } from 'eo/workbench/browser/src/app/modules/extension-select/import-api/old2new';
import { FeatureInfo } from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { ExtensionService } from 'eo/workbench/browser/src/app/shared/services/extensions/extension.service';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

import StorageUtil from '../../../utils/storage/storage.utils';

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
  ></extension-select>`
})
export class ImportApiComponent implements OnInit {
  supportList: any[] = [];
  currentExtension = StorageUtil.get('import_api_modal');
  uploadData = null;
  featureMap: Map<string, FeatureInfo>;
  constructor(
    private router: Router,
    private eoMessage: EoNgFeedbackMessageService,
    private extensionService: ExtensionService,
    private store: StoreService,
    private effectService: EffectService,
    private apiService: ApiService
  ) {
    this.featureMap = this.extensionService.getValidExtensionsByFature('importAPI');
    console.log(this.featureMap);
  }
  ngOnInit(): void {
    this.featureMap?.forEach((data: FeatureInfo, key: string) => {
      this.supportList.push({
        key,
        ...data
      });
    });
    {
      const { key } = this.supportList.at(0);
      if (!(this.currentExtension && this.supportList.find(val => val.key === this.currentExtension))) {
        this.currentExtension = key || '';
      }
    }
  }
  uploadChange(data) {
    this.uploadData = data;
  }
  async submit(callback) {
    StorageUtil.set('import_api_modal', this.currentExtension);
    if (!this.uploadData) {
      this.eoMessage.error($localize`Please import the file first`);
      callback('stayModal');
      return;
    }
    // * this.currentExtension is extension's key, like 'postcat-import-openapi'
    const feature = this.featureMap.get(this.currentExtension);
    const action = feature.action || null;
    const module = await this.extensionService.getExtensionPackage(this.currentExtension);
    let { name, content } = this.uploadData;
    try {
      const [data, err] = module[action](content);
      // console.log('import data', window.structuredClone?.(data));
      if (err) {
        console.error(err.msg);
        callback(false);
        return;
      }

      try {
        const projectUuid = this.store.getCurrentProjectID;
        const workSpaceUuid = this.store.getCurrentWorkspaceUuid;
        console.log('content', content);
        // TODO 兼容旧数据
        if (Reflect.has(data, 'collections') && Reflect.has(data, 'environments')) {
          content = old2new(data, projectUuid, workSpaceUuid);
          console.log('new content', content);
        }
        await this.apiService.api_projectImport({
          ...content,
          projectUuid: this.store.getCurrentProjectID,
          workSpaceUuid: this.store.getCurrentWorkspaceUuid
        });
        callback(true);
        this.router.navigate(['home/workspace/project/api']);
      } catch (error) {
        callback(false);
        pcConsole.error('Import Error', error);
      }
    } catch (e) {
      console.error(e);
      callback(false);
    }
  }
}
