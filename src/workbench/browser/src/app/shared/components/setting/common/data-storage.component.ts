import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { UserService } from 'eo/workbench/browser/src/app/shared/services/user/user.service';
@Component({
  selector: 'eo-data-storage',
  template: `
    <div class="font-bold text-lg mb-2" i18n="@@Cloud">Cloud Storage</div>
    <form nz-form nzLayout="vertical" [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <nz-form-item>
        <div class="text-[12px] mt-[8px] text-gray-400">
          <p i18n>
            Cloud Storage: Store data on the cloud for team collaboration and product use across devices.
            <a href="https://docs.eoapi.io/docs/storage.html" target="_blank" class="eo_link"> Learn more..</a>
          </p>
        </div>
      </nz-form-item>
      <ng-container>
        <nz-form-item>
          <nz-form-label i18n>Host</nz-form-label>
          <nz-form-control i18n-nzErrorTip nzErrorTip="Please input your Host">
            <input nz-input formControlName="eoapi-common.remoteServer.url" i18n-placeholder placeholder="your host" />
          </nz-form-control>
        </nz-form-item>
      </ng-container>
      <nz-form-item>
        <nz-form-control>
          <button nz-button nzType="primary" [nzLoading]="loading" i18n>Connect</button>
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
    private message: EoMessageService,
    private messageS: MessageService,
    private web: WebService,
    private electron: ElectronService,
    private dataSource: DataSourceService,
    private user: UserService
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
    if (isValid) {
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
        localStorage.setItem('IS_SHOW_DATA_SOURCE_TIP', 'false');
        const isLogin = this.user.isLogin;
        if (!isLogin) {
          this.messageS.send({ type: 'login', data: {} });
        }
        this.modelChange.emit(this.model);
      } else {
        this.message.error($localize`Failed to connect`);
      }
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
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
