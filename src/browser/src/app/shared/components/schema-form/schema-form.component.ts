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
    {{ model | json }}

    <form @animateTrigger *ngIf="isInited && validateForm" nz-form [formGroup]="validateForm" [nzNoColon]="true" class="form">
      {{ payload }}
      <input type="text" [(ngModel)]="payload" />
      <nz-form-item nz-col class="flex-1" *ngFor="let item of properties">
        {{ item | json }}

        <ng-container *ngIf="item[1]?.label">
          <nz-form-label nzFor="{{ item[0] }}" [nzSpan]="item[1]?.span ?? 24" [nzRequired]="item[1]?.required" class="label font-bold">
            {{ item[1]?.label }}
          </nz-form-label>
        </ng-container>

        <nz-form-control nzErrorTip="{{ placeholderTips }} {{ item[1]?.label }}" class="form-control">
          <!-- Description -->
          <div *ngIf="item[1]?.type !== 'boolean' && item[1]?.description" class="text-[12px] mb-[8px] text-tips">
            {{ item[1]?.description }}
          </div>
          <!-- String -->
          <ng-container *ngIf="item[1].ui.widget === compMap.string">
            <input
              type="text"
              eo-ng-input
              id="{{ item[0] }}"
              [disabled]="item[1]?.disabled"
              placeholder="{{ item[1]?.placeholder ?? placeholderTips + (item[1]?.label || '') }}"
              [formControlName]="item[0]"
              [(ngModel)]="model[item[0]]"
              maxlength="65535"
            />
          </ng-container>

          <!-- String -->
          <ng-container *ngIf="item[1].ui.widget === 'textarea'">
            itemvalue: {{ item | json }}
            <textarea
              type="text"
              eo-ng-input
              id="{{ item[0] }}"
              [disabled]="item[1]?.disabled"
              placeholder="{{ item[1]?.placeholder ?? placeholderTips + (item[1]?.label || '') }}"
              [formControlName]="item[0]"
              [rows]="item[1].ui.rows ?? 4"
              [(ngModel)]="model.payload"
            ></textarea>
          </ng-container>

          <!-- Switch -->
          <ng-container *ngIf="item[1].ui.widget === compMap.boolean">
            <eo-ng-switch [(ngModel)]="model[item[0]]" id="{{ item[0] }}" [nzDisabled]="item[1]?.disabled" formControlName="{{ item[0] }}">
              {{ item[1]?.description }}
            </eo-ng-switch>
          </ng-container>

          <!-- Number -->
          <ng-container *ngIf="item[1]?.ui.widget === compMap.number">
            <nz-input-number
              [(ngModel)]="model[item[0]]"
              id="{{ item[0] }}"
              [nzDisabled]="item[1]?.disabled"
              formControlName="{{ item[0] }}"
            >
              {{ item[1]?.description }}
            </nz-input-number>
          </ng-container>

          <!-- Radio -->
          <ng-container *ngIf="item[1]?.type !== 'array' && item[1].ui.widget === 'radio'">
            <eo-ng-radio-group
              [(ngModel)]="model[item[0]]"
              id="{{ item[0] }}"
              [nzDisabled]="item[1]?.disabled"
              formControlName="{{ item[0] }}"
            >
              <label *ngFor="let item of item[1]?.oneOf" eo-ng-radio [nzValue]="item.default ?? item.const">
                {{ item.title }}
              </label>
            </eo-ng-radio-group>
          </ng-container>

          <!-- Select -->
          <ng-container *ngIf="item[1].ui.widget === 'select'">
            <eo-ng-select [(ngModel)]="model[item[0]]" id="{{ item[0] }}" [nzDisabled]="item[1]?.disabled" formControlName="{{ item[0] }}">
              <eo-ng-option *ngFor="let item of item[1]?.enum" [nzValue]="item.value" [nzLabel]="item.label"></eo-ng-option>
            </eo-ng-select>
          </ng-container>

          <!-- Checkbox -->
          <ng-container *ngIf="item[1]?.type === 'boolean' && item[1].ui.widget === 'checkbox'">
            <label
              eo-ng-checkbox
              [(ngModel)]="model[item[0]]"
              id="{{ item[0] }}"
              [nzDisabled]="item[1]?.disabled"
              formControlName="{{ item[0] }}"
              >{{ item[1]?.title }}</label
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
  payload: string;
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
    console.log(this.validateForm);
    if (this.validateForm?.controls) {
      Object.keys(this.validateForm.controls).forEach(key => {
        if (this.properties.findIndex(item => item[0] === key) === -1) {
          this.validateForm.removeControl(key);
        }
        // if (!Reflect.has(this.properties, key)) {
        //   this.validateForm.removeControl(key);
        // }
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
              console.log(value, 555);
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
      console.log(ifFields, 999);

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
                    const thenProperties = Object.entries(this.thenMap).reduce((prev, [key, value]) => {
                      return { ...prev, ...(value as { then: any }).then?.properties };
                    }, {});
                    const propertiesArr: any = Object.entries(configuration?.properties);
                    Object.entries(this.thenMap).forEach(([key, value]) => {
                      console.log(key, value);
                      const findIndex = propertiesArr.findIndex(ele => ele[0] === key);
                      console.log(findIndex);
                      propertiesArr.splice(findIndex + 1, 0, ...Object.entries((value as { then: any }).then.properties));
                    });

                    console.log(propertiesArr, 999);

                    // const handleToProperties = propertiesArr.reduce((pre, [key, value]) => {
                    //   return { ...pre, [key]: value };
                    // }, {});

                    // console.log(handleToProperties, 222);

                    this.formatProperties(propertiesArr);
                    isInit = false;
                  }
                  if (conf) {
                    this.initIfThenElse(conf);
                  }
                }
                __value = val;
                console.log(this.model, 555);
              }
            });
          });
        }
      });
    }
  }

  formatProperties(properties: any = []) {
    console.log(Object.entries(this.configuration?.properties));
    console.log(properties, 789);
    this.properties = [...Object.entries(this.configuration?.properties), ...properties];
    this.properties.forEach(([key, value]) => {
      value.ui = {
        widget: compMap[value.type],
        ...value.ui
      };
    });
    console.log(this.properties, 333);

    // this.properties = Object.entries<any>({ ...this.configuration?.properties, ...properties }).reduce((prev, [key, value]) => {
    //   prev[key] = value;
    //   // 不指定组件 则默认根据数据类型生成对应组件
    //   value.ui = {
    //     widget: compMap[value.type],
    //     ...value.ui
    //   };
    //   return prev;
    // }, {});
    this.updateControls();
  }

  /**
   * set data
   *
   * @param properties
   */
  private properties2Model(properties) {
    //  Flat configuration object
    this.properties.forEach(([fieldKey, fieldValue]) => {
      this.model[fieldKey] ??= fieldValue.default ?? fieldValue.const;
    });
  }
}
