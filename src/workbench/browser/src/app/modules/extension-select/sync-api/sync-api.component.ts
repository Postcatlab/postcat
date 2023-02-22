import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { EoSchemaFormComponent } from 'eo/workbench/browser/src/app/shared/components/schema-form/schema-form.component';
import { FeatureInfo } from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { ExtensionService } from 'eo/workbench/browser/src/app/shared/services/extensions/extension.service';
import { Message, MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { TraceService } from 'eo/workbench/browser/src/app/shared/services/trace.service';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { Subject, takeUntil } from 'rxjs';

import schemaJson from './schema.json';

@Component({
  selector: 'eo-sync-api',
  template: `
    <ng-container *ngIf="supportList.length; else empty">
      <eo-schema-form #schemaForm [model]="model" [configuration]="schemaJson" />
    </ng-container>
    <ng-template #empty>
      <div class="mb-4" i18n>
        This feature requires plugin support, please open <a (click)="openExtension()"> Extensions Hub </a>
        download or open exist extensions.
      </div>
    </ng-template>

    <ng-container *ngIf="supportList.length">
      <eo-ng-feedback-alert class="block mt-[15px]" nzType="default" [nzMessage]="templateRefMsg" nzShowIcon></eo-ng-feedback-alert>
      <ng-template #templateRefMsg>
        <div class="text" i18n
          >Can't find the format you want?
          <a (click)="openExtension()">find more...</a>
        </div>
      </ng-template>
    </ng-container>
  `
})
export class SyncApiComponent implements OnInit, OnChanges {
  @Input() model = {} as Record<string, any>;
  @ViewChild('schemaForm') schemaForm: EoSchemaFormComponent;
  currentExtension = '';
  currentFormater;
  schemaJson = structuredClone(schemaJson);
  supportList: any[] = [];
  featureMap: Map<string, FeatureInfo>;

  get isValid() {
    return this.schemaForm?.validateForm?.valid;
  }

  get validateForm() {
    return this.schemaForm?.validateForm;
  }

  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private extensionService: ExtensionService,
    private eoMessage: EoNgFeedbackMessageService,
    private apiService: ApiService,
    private messageService: MessageService,
    private store: StoreService,
    private effectService: EffectService,
    private trace: TraceService
  ) {}

  ngOnInit(): void {
    this.initData();
    this.getSyncSettingList();
    this.messageService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((inArg: Message) => {
        if (inArg.type === 'installedExtensionsChange') {
          this.initData();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    // 切换插件时更新表单数据
    if (changes.model.previousValue.__formater !== changes.model.currentValue.__formater) {
      this.updateExtensionModel();
    }
  }

  openExtension() {
    this.messageService.send({
      type: 'open-extension',
      data: { suggest: '@feature:pullAPI' }
    });
  }

  updateExtensionModel() {
    this.currentFormater = this.store.getSyncSettingList.find(n => n.pluginId === this.model.__formater);
    if (this.currentFormater) {
      Object.assign(this.model, JSON.parse(this.currentFormater.pluginSettingJson), { __crontab: this.currentFormater.crontab });
    }
  }

  async getSyncSettingList() {
    await this.effectService.getSyncSettingList();
    this.updateExtensionModel();
  }

  initData = () => {
    this.featureMap = this.extensionService.getValidExtensionsByFature('updateAPI');
    this.supportList = [];
    this.featureMap?.forEach((data: FeatureInfo, key: string) => {
      this.supportList.push({
        key,
        ...data
      });
    });

    if (!this.supportList.length) {
      return;
    }

    const { key } = this.supportList?.at(0);
    this.currentExtension = key || '';

    if (this.store.isLocal) {
      Reflect.deleteProperty(this.schemaJson.properties, '__crontab');
    }

    this.schemaJson.properties.__formater.oneOf = [];
    this.schemaJson.allOf = [];
    let index = 0;
    for (const [name, conf] of this.featureMap) {
      console.log('name, conf', name, conf);
      if (index++ == 0) {
        this.schemaJson.properties.__formater.default = name;
      }
      // 创建 formater 单选框组
      this.schemaJson.properties.__formater.oneOf.push({
        type: 'string',
        title: conf.label,
        default: conf.extensionID,
        const: conf.extensionID
      });
      // 创建 切换 formater 时，应该切换到对应的插件配置
      this.schemaJson.allOf.push({
        if: {
          properties: {
            __formater: {
              const: conf.extensionID
            }
          }
        },
        then: {
          properties: conf.configuration?.properties
        }
      });
    }
    console.log('featureMap', this.featureMap);
  };

  async syncNow(apiGroupTree) {
    const feature = this.featureMap.get(this.currentExtension);
    const module = await this.extensionService.getExtensionPackage(this.currentExtension);

    if (typeof module[feature.action] === 'function') {
      await this.submit();
      await module[feature.action]();
      this.trace.report('sync_api_from_url_success');
      apiGroupTree?.effect?.getGroupList();
    }
  }

  async submit(callback?, modal?) {
    if (!this.supportList.length) {
      return modal?.destroy?.();
    }
    if (this.validateForm?.valid) {
      const { __formater, __crontab, ...rest } = this.validateForm.value;
      console.log('submit', this.validateForm.value);
      const params = {
        id: this.currentFormater?.id,
        pluginId: __formater,
        crontab: __crontab,
        pluginSettingJson: JSON.stringify(rest)
      };
      const [data, err] = await this.apiService[params.id ? 'api_projectUpdateSyncSetting' : 'api_projectCreateSyncSetting'](params);

      if (err) {
        console.error(err.msg);
        callback?.('stayModal');
        return;
      }
      this.effectService.getSyncSettingList();

      callback?.(true);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      callback?.('stayModal');
    }
  }
}
