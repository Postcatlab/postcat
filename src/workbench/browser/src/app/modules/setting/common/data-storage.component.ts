import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { StorageUtil } from 'eo/workbench/browser/src/app/utils/storage/Storage';

@Component({
  selector: 'eo-data-storage',
  template: `
    <form nz-form nzLayout="vertical" [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <nz-form-item>
        <div class="text-[12px] mt-[8px] text-gray-400">
          <p>
            <span i18n>
              Cloud Storage: Store data on the cloud for team collaboration and product use across devices.</span
            >
            <a i18n href="https://docs.eoapi.io/docs/storage.html" target="_blank" class="eo_link"> Learn more..</a>
          </p>
        </div>
      </nz-form-item>
      <ng-container>
        <nz-form-item>
          <nz-form-label i18n>Host</nz-form-label>
          <nz-form-control i18n-nzErrorTip nzErrorTip="Please input your Host">
            <input
              eo-ng-input
              formControlName="eoapi-common.remoteServer.url"
              i18n-placeholder
              placeholder="your host"
            />
          </nz-form-control>
        </nz-form-item>
      </ng-container>
      <nz-form-item>
        <nz-form-control>
          <button eo-ng-button nzType="primary" [nzLoading]="loading" i18n>Connect</button>
        </nz-form-control>
      </nz-form-item>
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
export class DataStorageComponent implements OnInit, OnChanges {
  @Input() model: Record<string, any> = {};
  @Output() modelChange: EventEmitter<any> = new EventEmitter();

  validateForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private message: EoNgFeedbackMessageService,
    private messageS: MessageService,
    private dataSource: DataSourceService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      'eoapi-common.remoteServer.url': [this.model['eoapi-common.remoteServer.url'] || '', [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { model } = changes;

    if (model && this.validateForm?.value) {
      this.setFormValue(model.currentValue);
    }
  }
  async submitForm() {
    const isValid = this.validateForm.valid;
    if (!isValid) {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    this.model = {
      ...this.model,
      ...this.validateForm.value,
    };
    const isSuccess = await this.dataSource.pingCloudServerUrl(
      this.validateForm.value['eoapi-common.remoteServer.url']
    );
    this.messageS.send({ type: 'workspaceChange', data: {} });
    if (isSuccess) {
      this.message.success($localize`Successfully connect to cloud`);
      StorageUtil.set('IS_SHOW_DATA_SOURCE_TIP', 'false');
      //Relogin to update user info
      this.messageS.send({ type: 'login', data: {} });
      this.modelChange.emit(this.model);
    } else {
      this.message.error($localize`Failed to connect`);
    }
    this.messageS.send({ type: 'close-setting', data: {} });
  }

  async updateDataSource() {}

  setFormValue(model = {}) {
    Object.keys(model).forEach((key) => {
      this.validateForm.get(key)?.setValue(model[key]);
    });
  }
}
