import { trigger, transition, animate, style } from '@angular/animations';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { debounce } from 'lodash-es';

const compMap = {
  string: 'input',
  number: 'input-number',
  boolean: 'switch'
} as const;
@Component({
  selector: 'eo-schema-form',
  animations: [
    trigger('animateTrigger', [
      transition(':enter', [style({ opacity: 0 }), animate('100ms', style({ opacity: 1 }))]),
      transition(':leave', [animate('100ms', style({ opacity: 0 }))])
    ])
  ],
  styles: [
    `
      form {
        min-height: 200px;
        display: none;
      }
      form:last-of-type {
        display: block;
      }
    `
  ],
  template: `
    <form @animateTrigger *ngIf="isInited && validateForm" nz-form [formGroup]="validateForm" [nzNoColon]="true" class="form">
      <nz-form-item nz-col class="flex-1" *ngFor="let item of properties">
        <ng-container *ngIf="item?.label">
          <nz-form-label nzFor="{{ item.key }}" [nzSpan]="item?.span ?? 24" [nzRequired]="item?.required" class="label font-bold">
            {{ item?.label }}
          </nz-form-label>
        </ng-container>

        <nz-form-control nzErrorTip="{{ placeholderTips }} {{ item?.label }}" class="form-control">
          <!-- Description -->
          <div *ngIf="item?.type !== 'boolean' && item?.description" class="text-[12px] mb-[8px] text-tips">
            {{ item?.description }}
          </div>
          <!-- String -->
          <ng-container *ngIf="item.ui.widget === compMap.string">
            <input
              type="text"
              eo-ng-input
              id="{{ item.key }}"
              [disabled]="item?.disabled"
              placeholder="{{ item?.placeholder ?? placeholderTips + (item?.label || '') }}"
              formControlName="{{ item.key }}"
              [(ngModel)]="model[item.key]"
              maxlength="65535"
            />
          </ng-container>

          <!-- String -->
          <ng-container *ngIf="item.ui.widget === 'textarea'">
            <textarea
              type="text"
              eo-ng-input
              id="{{ item.key }}"
              [disabled]="item?.disabled"
              placeholder="{{ item?.placeholder ?? placeholderTips + (item?.label || '') }}"
              formControlName="{{ item.key }}"
              [rows]="item.ui.rows ?? 4"
              [(ngModel)]="model[item.key]"
            ></textarea>
          </ng-container>

          <!-- Switch -->
          <ng-container *ngIf="item.ui.widget === compMap.boolean">
            <eo-ng-switch [(ngModel)]="model[item.key]" id="{{ item.key }}" [nzDisabled]="item?.disabled" formControlName="{{ item.key }}">
              {{ item?.description }}
            </eo-ng-switch>
          </ng-container>

          <!-- Number -->
          <ng-container *ngIf="item?.ui.widget === compMap.number">
            <nz-input-number
              [(ngModel)]="model[item.key]"
              id="{{ item.key }}"
              [nzDisabled]="item?.disabled"
              formControlName="{{ item.key }}"
            >
              {{ item?.description }}
            </nz-input-number>
          </ng-container>

          <!-- Radio -->
          <ng-container *ngIf="item?.type !== 'array' && item.ui.widget === 'radio'">
            <eo-ng-radio-group
              [(ngModel)]="model[item.key]"
              id="{{ item.key }}"
              [nzDisabled]="item?.disabled"
              formControlName="{{ item.key }}"
            >
              <label *ngFor="let item of item?.oneOf" eo-ng-radio [nzValue]="item.default ?? item.const">
                {{ item.title }}
              </label>
            </eo-ng-radio-group>
          </ng-container>

          <!-- Select -->
          <ng-container *ngIf="item.ui.widget === 'select'">
            <eo-ng-select [(ngModel)]="model[item.key]" id="{{ item.key }}" [nzDisabled]="item?.disabled" formControlName="{{ item.key }}">
              <eo-ng-option *ngFor="let item of item?.enum" [nzValue]="item.value" [nzLabel]="item.label"></eo-ng-option>
            </eo-ng-select>
          </ng-container>

          <!-- Checkbox -->
          <ng-container *ngIf="item?.type === 'boolean' && item.ui.widget === 'checkbox'">
            <label
              eo-ng-checkbox
              [(ngModel)]="model[item.key]"
              id="{{ item.key }}"
              [nzDisabled]="item?.disabled"
              formControlName="{{ item.key }}"
              >{{ item?.title }}</label
            >
          </ng-container>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class EoSchemaFormComponent implements OnChanges {
  @Input() configuration = {} as any;
  @Input() model = {} as Record<string, any>;
  @Output() readonly valueChanges: EventEmitter<any> = new EventEmitter<any>();
  validateForm!: FormGroup;
  objectKeys = Object.keys;
  properties = [];
  compMap = compMap;
  isInited = true;
  thenMap = {};
  placeholderTips = $localize`Please enter `;
  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({});
    this.initEmitter();
  }

  ngOnChanges(changes: SimpleChanges) {
    const modelIsNotEqual = !Object.is(changes.model?.previousValue, changes.model?.currentValue);
    const configurationIsNotEqual = !Object.is(changes.configuration?.previousValue, changes.configuration?.currentValue);
    if (modelIsNotEqual || configurationIsNotEqual) {
      this.init();
    }
  }

  init = debounce(() => {
    this.isInited = false;
    this.formatProperties();
    this.initIfThenElse(this.configuration);

    setTimeout(() => {
      this.isInited = true;
      this.properties2Model(this.properties);
    });
  });

  initEmitter() {
    this.validateForm.valueChanges.subscribe(
      debounce(val => {
        this.valueChanges.emit(val);
      })
    );
  }

  updateControls() {
    if (this.validateForm?.controls) {
      Object.keys(this.validateForm.controls).forEach(key => {
        if (this.properties.findIndex(item => item.key === key) === -1) {
          this.validateForm.removeControl(key);
        }
      });
    }
    this.properties.forEach(item => {
      if (item.required) {
        this.validateForm.addControl(item.key, new UntypedFormControl(null, Validators.required));
      } else {
        this.validateForm.addControl(item.key, new UntypedFormControl(null));
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
            } else if (Reflect.has(value, 'enum')) {
              prev[key] ??= {};
              value.enum.forEach(ele => {
                prev[key][ele] = curr;
              });
            }
          });
        }
        return prev;
      }, {});

      configuration.allOf.forEach(item => {
        if (item.if?.properties) {
          Object.entries<any>(item.if.properties).forEach(([key, value]) => {
            let isInit = true;
            let __value = this.model[key];
            Object.defineProperty(this.model, key, {
              configurable: true,
              enumerable: true,
              get: () => {
                return __value;
              },
              set: val => {
                const conf = ifFields[key]?.[val]?.then;
                this.thenMap[key] = { then: conf };
                if (isInit || val !== this.model[key]) {
                  if (conf?.properties) {
                    const propertiesArr: any = Object.entries(this.configuration?.properties);
                    Object.entries(this.thenMap).forEach(([key, value]) => {
                      const findIndex = propertiesArr.findIndex(ele => ele[0] === key);
                      propertiesArr.splice(findIndex + 1, 0, ...Object.entries((value as { then: any }).then.properties));
                    });
                    this.formatProperties(propertiesArr);
                    isInit = false;
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

  formatProperties(properties: any = []) {
    const propertiesArr = properties.length > 0 ? properties : Object.entries(this.configuration?.properties);
    // const propertiesArr = [...Object.entries(this.configuration?.properties), ...properties];
    this.properties = propertiesArr.map(([key, value]) => {
      value.ui = {
        widget: compMap[value.type],
        ...value.ui
      };
      return { ...value, key: key };
    });
    this.updateControls();
  }

  /**
   * set data
   *
   * @param properties
   */
  private properties2Model(properties) {
    //  Flat configuration object
    this.properties.forEach(item => {
      this.model[item.key] ??= item.default ?? item.const;
    });
  }
}
