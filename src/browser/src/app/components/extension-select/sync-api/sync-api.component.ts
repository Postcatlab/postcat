import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { debounce } from 'lodash-es';
import { ExtensionService } from 'pc/browser/src/app/services/extensions/extension.service';
import { Message, MessageService } from 'pc/browser/src/app/services/message';
import { ApiService } from 'pc/browser/src/app/services/storage/api.service';
import { TraceService } from 'pc/browser/src/app/services/trace.service';
import { EoSchemaFormComponent } from 'pc/browser/src/app/shared/components/schema-form/schema-form.component';
import { FeatureInfo } from 'pc/browser/src/app/shared/models/extension-manager';
import { EffectService } from 'pc/browser/src/app/store/effect.service';
import { StoreService } from 'pc/browser/src/app/store/state.service';
import { Subject, takeUntil } from 'rxjs';

import { eoDeepCopy } from '../../../shared/utils/index.utils';
import { SYNC_API_SCHEMA } from './schema';

@Component({
  selector: 'eo-sync-api',
  template: `
    <extension-feedback [extensionLength]="supportList.length" suggest="@feature:pullAPI">
      <eo-schema-form #schemaForm [model]="model" [configuration]="schemaJson" (valueChanges)="handleValueChanges($event)" />
    </extension-feedback>
  `
})
export class SyncApiComponent implements OnInit, OnChanges {
  @Input() model = {} as Record<string, any>;
  @ViewChild('schemaForm') schemaForm: EoSchemaFormComponent;
  currentFormater;
  schemaJson = eoDeepCopy(SYNC_API_SCHEMA);
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
    this.getSyncSettingList();
    this.initData();
    this.messageService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((inArg: Message) => {
        if (inArg.type === 'extensionsChange') {
          this.initData(() => {
            if (this.supportList?.length) {
              const { key } = this.supportList.at(0);
              this.model.__formater = key || '';
            } else {
              this.model.__formater = '';
            }
          });
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    // 切换插件时更新表单数据
    if (changes.model.previousValue.__formater !== changes.model.currentValue.__formater) {
      this.updateExtensionModel();
    }
  }

  handleValueChanges(val) {
    if (val.__formater !== this.currentFormater?.pluginId) {
      this.model.__formater = val.__formater;
      this.updateExtensionModel();
    }
  }

  updateExtensionModel() {
    const currentFormater =
      this.store.getSyncSettingList.find(n => n.pluginId === this.model.__formater) || this.store.getSyncSettingList.at(0);
    // console.log('currentFormater', { ...currentFormater });
    if (currentFormater && (this.currentFormater !== currentFormater || this.model.__formater === '')) {
      this.currentFormater = currentFormater;
      this.model = {
        ...this.model,
        ...JSON.parse(this.currentFormater.pluginSettingJson),
        __formater: this.currentFormater.pluginId,
        __crontab: this.currentFormater.crontab
      };
    }
  }

  async getSyncSettingList() {
    await this.effectService.getSyncSettingList();
    this.updateExtensionModel();
  }

  initData = debounce((afterInitCallback?) => {
    this.featureMap = this.extensionService.getValidExtensionsByFature('pullAPI');
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
    this.schemaJson = { ...SYNC_API_SCHEMA };
    if (this.store.isLocal) {
      Reflect.deleteProperty(this.schemaJson.properties, '__crontab');
    }

    this.schemaJson.properties.__formater.oneOf = [];
    this.schemaJson.allOf = [];
    let index = 0;
    for (const [name, conf] of this.featureMap) {
      if (index++ === 0) {
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
          ...conf.configuration,
          properties: conf.configuration?.properties
        }
      });
    }
    afterInitCallback?.();
  });

  async syncNow(): Promise<boolean | string> {
    if (!this.validateForm?.valid) {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return false;
    }
    const feature = this.featureMap.get(this.model.__formater);
    const module = await this.extensionService.getExtensionPackage(this.model.__formater);

    if (typeof module[feature.action] !== 'function') return false;
    const [data, err] = await module[feature.action](this.validateForm?.value);
    console.log('data', data, err);
    if (err) {
      this.eoMessage.error($localize`Sync API from URL error: ${err}`);
      return 'stayModal';
    }
    // this.eoMessage.success($localize`Sync API from URL Successfully`);
    this.trace.report('sync_api_from_url_success');
    return true;
  }

  async submit(callback?, modal?) {
    if (!this.supportList.length) {
      return modal?.destroy?.();
    }
    if (!this.validateForm?.valid) {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      callback?.('stayModal');
      return;
    }
    const { __formater, __crontab, ...rest } = this.validateForm.value;
    const params = {
      id: this.currentFormater?.pluginId === __formater ? this.currentFormater?.id : undefined,
      pluginId: __formater,
      crontab: __crontab,
      pluginSettingJson: JSON.stringify(rest)
    };
    const [data, err] = await this.apiService[params.id ? 'api_projectUpdateSyncSetting' : 'api_projectCreateSyncSetting'](params);
    if (err) {
      this.eoMessage.error(err.msg);
      console.error(err.msg);
      callback?.('stayModal');
      return;
    }
    this.effectService.getSyncSettingList();
    const result = await this.syncNow();
    callback(result);
  }
}
