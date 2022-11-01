import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { SettingService } from 'eo/workbench/browser/src/app/core/services/settings/settings.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'eo-extension-setting',
  template: `
    <div
      class="bg-white sticky top-0 py-[10px] border-solid border-0 border-b-[1px] z-10 mb-[3px]"
      style="border-color: var(--BORDER)"
    >
      <button nz-button nzType="primary" (click)="handleSave()">Save</button>
    </div>

    <form nz-form [nzLayout]="'vertical'" [formGroup]="validateForm" class="form">
      <nz-form-item nz-col class="fg1" *ngFor="let field of objectKeys(properties)">
        <ng-container *ngIf="properties[field]?.title || properties[field]?.label">
          <nz-form-label nzFor="{{ field }}" [nzRequired]="properties[field]?.required" class="label">
            {{ properties[field]?.title || properties[field]?.label }}
          </nz-form-label>
        </ng-container>
        <!-- 二级说明 -->
        <div
          *ngIf="properties[field]?.type !== 'boolean' && properties[field]?.description"
          class="text-[12px] mb-[8px] text-gray-400"
        >
          {{ properties[field]?.description }}
        </div>
        <nz-form-control
          i18n-nzErrorTip
          nzErrorTip="Please Enter {{ properties[field]?.title || properties[field]?.label }}"
          class="form-control"
        >
          <!-- 字符串类型 -->
          <!-- <ng-container *ngIf="properties[field]?.type === 'string'"> -->
          <input
            type="text"
            nz-input
            id="{{ field }}"
            [disabled]="properties[field]?.disabled"
            i18n-placeholder
            placeholder="{{
              (properties[field]?.placeholder ?? 'Please Enter ' + properties[field]?.title) || properties[field]?.label
            }}"
            formControlName="{{ field }}"
            [(ngModel)]="localSettings[field]"
          />
          <!-- </ng-container> -->

          <!-- 布尔类型 -->
          <ng-container *ngIf="properties[field]?.type === 'boolean'">
            <label
              nz-checkbox
              [(ngModel)]="localSettings[field]"
              id="{{ field }}"
              [nzDisabled]="properties[field]?.disabled"
              formControlName="{{ field }}"
              >{{ properties[field]?.description }}</label
            >
          </ng-container>

          <!-- 数字类型 -->
          <ng-container *ngIf="properties[field]?.type === 'number'">
            <nz-input-number
              [(ngModel)]="localSettings[field]"
              id="{{ field }}"
              [nzDisabled]="properties[field]?.disabled"
              formControlName="{{ field }}"
            >
              {{ properties[field]?.description }}</nz-input-number
            >
          </ng-container>
        </nz-form-control>
      </nz-form-item>
    </form>
  `,
})
export class ExtensionSettingComponent implements OnInit {
  @Input() configuration = {} as any;
  @Input() extName: string;
  localSettings = {} as Record<string, any>;
  validateForm!: FormGroup;
  objectKeys = Object.keys;
  properties = {};

  constructor(
    public languageService: LanguageService,
    private fb: FormBuilder,
    private settingService: SettingService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.init();
  }

  private init() {
    this.formatProperties();
    this.localSettings = this.settingService.getSettings();
    const controls = {};

    this.setSettingsModel(this.properties, controls);

    this.validateForm = this.fb.group(controls);
  }

  formatProperties() {
    const prefix = `${this.extName}.`;
    this.properties = Object.entries(this.configuration?.properties).reduce((prev, [key, value]) => {
      const newKey = key.startsWith(prefix) ? key : `${prefix}${key}`;
      prev[newKey] = value;
      return prev;
    }, {});
  }

  /**
   * set data
   *
   * @param properties
   */
  private setSettingsModel(properties, controls) {
    //  Flat configuration object
    Object.keys(properties).forEach((fieldKey) => {
      const props = properties[fieldKey];
      this.localSettings[fieldKey] ??= props.default;
      // Extensible to add more default checks
      if (props.required) {
        controls[fieldKey] = [null, [Validators.required]];
      } else {
        controls[fieldKey] = [null];
      }
    });
  }

  handleSave = () => {
    this.settingService.saveSetting(this.localSettings);
    window.eo?.saveSettings?.({ ...this.localSettings });
    this.message.create('success', `Save Success`);
  };
}
