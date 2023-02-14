import { Component, OnInit } from '@angular/core';
import { FeatureInfo } from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { ExtensionService } from 'eo/workbench/browser/src/app/shared/services/extensions/extension.service';
import { Message, MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { TraceService } from 'eo/workbench/browser/src/app/shared/services/trace.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import StorageUtil from 'eo/workbench/browser/src/app/utils/storage/storage.utils';
import { has } from 'lodash-es';
import { Subject, takeUntil } from 'rxjs';

// shit angular-cli 配不明白
// import { version } from '../../../../../../../../package.json' assert { type: 'json' };
import pkgInfo from '../../../../../../../../package.json';

@Component({
  selector: 'eo-export-api',
  template: `<extension-select [(extension)]="currentExtension" tipsType="exportAPI" [extensionList]="supportList"></extension-select> `
})
export class ExportApiComponent implements OnInit {
  currentExtension = StorageUtil.get('export_api_modal');
  supportList: any[] = [];
  featureMap: Map<string, FeatureInfo>;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private extensionService: ExtensionService,
    private apiService: ApiService,
    private messageService: MessageService,
    private trace: TraceService,
    private store: StoreService
  ) {}
  ngOnInit(): void {
    this.initData();
    this.messageService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((inArg: Message) => {
        if (inArg.type === 'installedExtensionsChange') {
          this.initData();
        }
      });
  }
  initData = () => {
    this.featureMap = this.extensionService.getValidExtensionsByFature('exportAPI');
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
  };
  submit(callback: () => boolean) {
    this.export(callback);
  }
  private transferTextToFile(fileName: string, exportData: any) {
    const file = new Blob([JSON.stringify(exportData)], { type: 'data:text/plain;charset=utf-8' });
    const element = document.createElement('a');
    const url = URL.createObjectURL(file);
    element.href = url;
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    Promise.resolve().then(() => {
      document.body.removeChild(element);
      window.URL.revokeObjectURL(url);
    });
  }
  /**
   * Module export
   * TODO callback show support specific error tips
   *
   * @param callback
   */
  private async export(callback) {
    StorageUtil.set('export_api_modal', this.currentExtension);
    const feature = this.featureMap.get(this.currentExtension);
    const action = feature.action || null;
    const filename = feature.filename || 'export.json';
    const module = await this.extensionService.getExtensionPackage(this.currentExtension);
    if (action && module?.[action] && typeof module[action] === 'function') {
      const [data] = await this.apiService.api_projectExportProject({});
      if (data) {
        console.log('projectExport result', data);
        try {
          data.postcatVersion = pkgInfo.version;
          let output = module[action]({ data: data || {} });
          //Change format
          if (has(output, 'status') && output.status === 0) {
            output = output.data;
          }
          if (filename) {
            this.transferTextToFile(filename, output);
          }
          const workspace_type = this.store.isLocal ? 'local' : 'remote';
          this.trace.report('export_project_success', { sync_platform: this.currentExtension, workspace_type });
          callback(true);
        } catch (e) {
          console.error(e);
          callback(false);
        }
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  }
}
