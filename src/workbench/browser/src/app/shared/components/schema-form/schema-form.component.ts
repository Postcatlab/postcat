import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';

const compMap = {
  string: 'input',
  number: 'input-number',
  boolean: 'switch'
} as const;

@Component({
  selector: 'eo-schema-form',
  template: `
    <form nz-form [formGroup]="validateForm" [nzNoColon]="true" class="form">
      <nz-form-item nz-col class="flex-1" *ngFor="let field of objectKeys(properties)">
        <ng-container *ngIf="properties[field]?.label">
          <nz-form-label
            nzFor="{{ field }}"
            [nzSpan]="properties[field]?.span ?? 24"
            [nzRequired]="properties[field]?.required"
            class="label font-bold"
          >
            {{ properties[field]?.label }}
          </nz-form-label>
        </ng-container>
        <!-- Description -->
        <div *ngIf="properties[field]?.type !== 'boolean' && properties[field]?.description" class="text-[12px] mb-[8px] text-tips">
          {{ properties[field]?.description }}
        </div>
        <nz-form-control i18n-nzErrorTip nzErrorTip="Please Enter {{ properties[field]?.label }}" class="form-control">
          <!-- String -->
          <ng-container *ngIf="properties[field]?.['ui:widget'] === compMap.string">
            <input
              type="text"
              eo-ng-input
              id="{{ field }}"
              [disabled]="properties[field]?.disabled"
              i18n-placeholder
              placeholder="{{ properties[field]?.placeholder ?? 'Please Enter ' + (properties[field]?.label || '') }}"
              formControlName="{{ field }}"
              [(ngModel)]="model[field]"
            />
          </ng-container>

          <!-- Switch -->
          <ng-container *ngIf="properties[field]?.['ui:widget'] === compMap.boolean">
            <eo-ng-switch
              [(ngModel)]="model[field]"
              id="{{ field }}"
              [nzDisabled]="properties[field]?.disabled"
              formControlName="{{ field }}"
            >
              {{ properties[field]?.description }}
            </eo-ng-switch>
          </ng-container>

          <!-- Number -->
          <ng-container *ngIf="properties[field]?.['ui:widget'] === compMap.number">
            <nz-input-number
              [(ngModel)]="model[field]"
              id="{{ field }}"
              [nzDisabled]="properties[field]?.disabled"
              formControlName="{{ field }}"
            >
              {{ properties[field]?.description }}
            </nz-input-number>
          </ng-container>

          <!-- Radio -->
          <ng-container *ngIf="properties[field]?.type !== 'array' && properties[field]?.['ui:widget'] === 'radio'">
            <eo-ng-radio-group
              [(ngModel)]="model[field]"
              id="{{ field }}"
              [nzDisabled]="properties[field]?.disabled"
              formControlName="{{ field }}"
            >
              <label *ngFor="let item of properties[field]?.oneOf" eo-ng-radio [nzValue]="item.default || item.const">{{
                item.title
              }}</label>
            </eo-ng-radio-group>
          </ng-container>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class EoSchemaFormComponent implements OnInit {
  @Input() configuration = {} as any;
  @Input() model = {} as Record<string, any>;
  validateForm!: FormGroup;
  objectKeys = Object.keys;
  properties = {};
  compMap = compMap;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.validateForm = this.fb.group({});

    this.formatProperties();
    this.initIfThenElse(this.configuration);

    this.setSettingsModel(this.properties);
  }

  updateControls() {
    if (this.validateForm?.controls) {
      Object.keys(this.validateForm.controls).forEach(key => {
        if (!Reflect.has(this.properties, key)) {
          this.validateForm.removeControl(key);
        }
      });
    }
    Object.entries<any>(this.properties).forEach(([key, value]) => {
      if (value.required) {
        this.validateForm.addControl(key, new UntypedFormControl(null, Validators.required));
      } else {
        this.validateForm.addControl(key, new UntypedFormControl(null));
      }
    });
  }

  // https://json-schema.org/understanding-json-schema/reference/conditionals.html#if-then-else
  // 在线测试：https://jsonschema.dev/s/hpWFy
  initIfThenElse(configuration) {
    if (Array.isArray(configuration?.allOf)) {
      const ifFields = configuration.allOf.reduce((prev, curr) => {
        if (curr.if?.properties) {
          Object.entries<any>(curr.if.properties).forEach(([key, value]) => {
            if (Reflect.has(value, 'const')) {
              prev[key] ??= {};
              prev[key][value.const] = curr;
            }
          });
        }
        return prev;
      }, {});

      configuration.allOf.forEach(item => {
        if (item.if?.properties) {
          Object.entries<any>(item.if.properties).forEach(([key, value]) => {
            let __value;
            Object.defineProperty(this.model, key, {
              configurable: true,
              get: () => {
                return __value;
              },
              set: val => {
                const conf = ifFields[key]?.[val]?.then;
                if (val !== this.model[key]) {
                  if (conf?.properties) {
                    this.formatProperties({ ...configuration?.properties, ...conf.properties });
                  }
                  if (conf) {
                    this.initIfThenElse(conf);
                  }
                }
                __value = val;
              }
            });
          });
        }
      });
    }
  }

  formatProperties(properties = {}) {
    this.properties = Object.entries<any>({ ...this.configuration?.properties, ...properties }).reduce((prev, [key, value]) => {
      prev[key] = value;
      // 不指定组件 则默认根据数据类型生成对应组件
      value['ui:widget'] ??= compMap[value.type];
      return prev;
    }, {});
    this.updateControls();
  }

  /**
   * set data
   *
   * @param properties
   */
  private setSettingsModel(properties) {
    //  Flat configuration object
    Object.keys(properties).forEach(fieldKey => {
      const props = properties[fieldKey];
      this.model[fieldKey] ??= props.default || props.const;
    });
  }
}
