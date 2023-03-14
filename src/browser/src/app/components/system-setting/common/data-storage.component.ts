import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { DataSourceService } from 'pc/browser/src/app/services/data-source/data-source.service';
import { MessageService } from 'pc/browser/src/app/services/message';
import { StorageUtil } from 'pc/browser/src/app/shared/utils/storage/storage.utils';

import { SettingService } from '../settings.service';

@Component({
  selector: 'eo-data-storage',
  template: `
    <form nz-form nzLayout="vertical" [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <nz-form-item>
        <div class="text-[12px] mt-[8px] text-tips">
          <p>
            <span i18n> Cloud Storage: Store data on the cloud for team collaboration and product use across devices.</span>
            <a i18n href="https://docs.postcat.com/docs/storage.html" target="_blank"> Learn more..</a>
          </p>
        </div>
      </nz-form-item>
      <ng-container>
        <nz-form-item>
          <nz-form-label i18n>Host</nz-form-label>
          <nz-form-control i18n-nzErrorTip nzErrorTip="Please input your Host">
            <input eo-ng-input formControlName="backend.url" i18n-placeholder placeholder="Your host" />
          </nz-form-control>
        </nz-form-item>
      </ng-container>
      <nz-form-item>
        <nz-form-control>
          <button eo-ng-button nzType="primary" [disabled]="!validateForm.valid" [nzLoading]="loading" i18n>Connect</button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `,
  styles: [
    `
      [nz-form]:not(.ant-form-inline):not(.ant-form-vertical) {
        max-width: 600px;
      }
    `
  ]
})
export class DataStorageComponent implements OnInit {
  model;
  validateForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private message: EoNgFeedbackMessageService,
    private messageS: MessageService,
    private dataSource: DataSourceService,
    private settingService: SettingService
  ) {
    this.model = this.settingService.settings;
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      'backend.url': [this.model['backend.url'] || '', [Validators.required]]
    });
  }

  async submitForm() {
    const isValid = this.validateForm.valid;
    if (!isValid) {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    this.model = {
      ...this.model,
      ...this.validateForm.value
    };
    const isSuccess = await this.dataSource.pingCloudServerUrl(this.validateForm.value['backend.url']);
    if (isSuccess) {
      this.message.success($localize`Successfully connect to cloud`);
      StorageUtil.set('IS_SHOW_DATA_SOURCE_TIP', 'false');
      //Relogin to update user info
      this.messageS.send({ type: 'login', data: {} });
      this.saveConf();
    } else {
      this.message.error($localize`Failed to connect`);
    }
  }

  async updateDataSource() {}

  setFormValue(model = {}) {
    Object.keys(model).forEach(key => {
      this.validateForm.get(key)?.setValue(model[key]);
    });
  }
  saveConf() {
    this.settingService.saveSetting(this.model);
  }
}
