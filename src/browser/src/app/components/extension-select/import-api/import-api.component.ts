import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { ExtensionService } from 'pc/browser/src/app/services/extensions/extension.service';
import { ApiService } from 'pc/browser/src/app/services/storage/api.service';
import { parseAndCheckCollections, parseAndCheckEnv } from 'pc/browser/src/app/services/storage/db/validate/validate';
import { TraceService } from 'pc/browser/src/app/services/trace.service';
import { IMPORT_API } from 'pc/browser/src/app/shared/constans/featureName';
import { ExtensionChange } from 'pc/browser/src/app/shared/decorators';
import { FeatureInfo } from 'pc/browser/src/app/shared/models/extension-manager';
import { StoreService } from 'pc/browser/src/app/shared/store/state.service';

import StorageUtil from '../../../shared/utils/storage/storage.utils';

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
    tipsType="importAPI"
    [(extension)]="currentExtension"
    (extensionChange)="selectChange($event)"
    [extensionList]="supportList"
    (uploadChange)="uploadChange($event)"
  ></extension-select>`
})
export class ImportApiComponent implements OnInit {
  supportList: any[] = [];
  currentExtension = StorageUtil.get('import_api_modal');
  uploadData = null;
  isValid = true;
  featureMap: Map<string, FeatureInfo>;

  constructor(
    private router: Router,
    private trace: TraceService,
    private feedback: EoNgFeedbackMessageService,
    private extensionService: ExtensionService,
    private store: StoreService,
    private apiService: ApiService
  ) {}
  ngOnInit(): void {
    this.initData();
  }
  selectChange($event) {
    StorageUtil.set('import_api_modal', this.currentExtension);
  }
  @ExtensionChange(IMPORT_API, true)
  initData() {
    this.featureMap = this.extensionService.getValidExtensionsByFature(IMPORT_API);
    this.supportList = [];
    this.featureMap?.forEach((data: FeatureInfo, key: string) => {
      this.supportList.push({
        key,
        ...data
      });
    });
    if (!this.supportList.length) return;
    const { key } = this.supportList.at(0);
    if (!(this.currentExtension && this.supportList.find(val => val.key === this.currentExtension))) {
      this.currentExtension = key || '';
    }
  }
  uploadChange(data) {
    this.uploadData = data;
  }
  async submit(callback) {
    if (!this.uploadData) {
      this.feedback.error($localize`Please import the file first`);
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
      console.log('import data', window.structuredClone?.(data));
      if (err) {
        this.feedback.error(err.msg);
        console.error(err.msg);
        callback('stayModal');
        return;
      }

      try {
        data.collections = parseAndCheckCollections(data.collections || []);
        if (!data.collections?.length && !data.environmentList?.length) {
          this.feedback.warning($localize`The imported file contains ${data.collections.length} APIs, which will be ignored`);
          callback('stayModal');
          return;
        }
        data.environmentList = (data.environmentList || []).filter(n => {
          const { validate, data } = parseAndCheckEnv(n);
          if (validate) {
            return data;
          }
          return false;
        });
        const [result, err] = await this.apiService.api_projectImport({
          ...data,
          projectUuid: this.store.getCurrentProjectID,
          workSpaceUuid: this.store.getCurrentWorkspaceUuid
        });
        console.log('result', result, err);
        if (err) {
          callback(false);
          return;
        }
        callback(true);
        // * For trace
        const sync_platform = this.currentExtension;
        const workspace_type = this.store.isLocal ? 'local' : 'remote';
        this.trace.report('import_project_success', { sync_platform, workspace_type });
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
