import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';

@Component({
  selector: 'eo-extension-setting',
  template: `
    <form nz-form [nzLayout]="'vertical'" [formGroup]="validateForm" class="form">
      <div *ngFor="let module of extensitonConfigurations">
        <h2 class="title" *ngIf="module.title">{{ module.title }}</h2>
        <nz-form-item nz-col class="fg1" *ngFor="let field of objectKeys(module.properties || {})">
          <ng-container *ngIf="module.properties[field]?.label">
            <nz-form-label nzFor="{{ field }}" [nzRequired]="module.properties[field]?.required" class="label">
              {{ module.properties[field]?.label }}
            </nz-form-label>
          </ng-container>
          <!-- 二级说明 -->
          <div
            *ngIf="module.properties[field]?.type !== 'boolean' && module.properties[field]?.description"
            class="description"
          >
            <eo-shadow-dom [text]="module.properties[field]?.description || ''"></eo-shadow-dom>
          </div>
          <nz-form-control
            i18n-nzErrorTip
            nzErrorTip="Please Enter {{ module.properties[field]?.label }}"
            class="form-control"
          >
            <!-- 字符串类型 -->
            <ng-container *ngIf="module.properties[field]?.type === 'string'">
              <input
                type="text"
                nz-input
                id="{{ field }}"
                [disabled]="module.properties[field]?.disabled"
                i18n-placeholder
                placeholder="{{
                  module.properties[field]?.placeholder ?? 'Please Enter ' + module.properties[field]?.label
                }}"
                formControlName="{{ field }}"
                [(ngModel)]="model[field]"
              />
            </ng-container>

            <!-- 布尔类型 -->
            <ng-container *ngIf="module.properties[field]?.type === 'boolean'">
              <label
                nz-checkbox
                [(ngModel)]="model[field]"
                id="{{ field }}"
                [nzDisabled]="module.properties[field]?.disabled"
                formControlName="{{ field }}"
                >{{ module.properties[field]?.description }}</label
              >
            </ng-container>

            <!-- 数字类型 -->
            <ng-container *ngIf="module.properties[field]?.type === 'number'">
              <nz-input-number
                [(ngModel)]="model[field]"
                id="{{ field }}"
                [nzDisabled]="module.properties[field]?.disabled"
                formControlName="{{ field }}"
              >
                {{ module.properties[field]?.description }}</nz-input-number
              >
            </ng-container>
          </nz-form-control>
        </nz-form-item>
      </div>
    </form>
  `,
  styles: [
    `
      [nz-form]:not(.ant-form-inline):not(.ant-form-vertical) {
        max-width: 600px;
      }
    `,
  ],
})
export class ExtensionSettingComponent implements OnInit {
  @Input() model: object = {};
  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  @Input() validateForm!: FormGroup;
  @Input() extensitonConfigurations = [];
  objectKeys = Object.keys;

  constructor(public languageService: LanguageService) {}

  ngOnInit(): void {
    console.log('extensitonConfigurations', this.extensitonConfigurations);
    this.model['eoapi-language'] = this.languageService.systemLanguage;
  }

  handleChange(localeID) {
    this.model['eoapi-language'] = localeID;
    this.modelChange.emit(this.model);
    this.languageService.changeLanguage(localeID);
  }
}
