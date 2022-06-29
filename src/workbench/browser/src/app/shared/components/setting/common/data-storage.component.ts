import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'eo-data-storage',
  template: `
    <div class="font-bold text-lg mb-2" i18n>数据源</div>
    <form nz-form nzLayout="vertical" [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <nz-form-item>
        <nz-form-control>
          <nz-select formControlName="eoapi-common.dataStorage" i18n-nzPlaceHolder nzPlaceHolder="数据源">
            <nz-option nzValue="http" i18n-nzLabel nzLabel="远程数据源"></nz-option>
            <nz-option nzValue="local" nzLabel="Localhost"></nz-option>
          </nz-select>
        </nz-form-control>
        <div class="text-[12px] mt-[8px] text-gray-400">
          <p i18n>本地数据源：将数据存储在本地，你只能在当前计算机使用产品数据。</p>
          <p i18n>
            远程服务器：将数据存储在远程服务器上，方便跨设备使用产品。
            <a href="https://eoapi.io/docs/storage.html" target="_blank" class="eo_link"> 了解更多...</a>
          </p>
        </div>
      </nz-form-item>
      <ng-container *ngIf="validateForm.value['eoapi-common.dataStorage'] === 'http'">
        <nz-form-item>
          <nz-form-label i18n>远程服务器地址</nz-form-label>
          <nz-form-control i18n-nzErrorTip nzErrorTip="请输入你的远程服务器地址">
            <input
              nz-input
              formControlName="eoapi-common.remoteServer.url"
              i18n-placeholder
              placeholder="你的远程服务器地址"
            />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label>Token</nz-form-label>
          <nz-form-control i18n-nzErrorTip nzErrorTip="请输入你的 Token">
            <input
              nz-input
              formControlName="eoapi-common.remoteServer.token"
              i18n-placeholder
              placeholder="你的认证 Token"
            />
          </nz-form-control>
        </nz-form-item>
      </ng-container>
      <nz-form-item>
        <nz-form-control>
          <button nz-button nzType="primary" [nzLoading]="loading" i18n>修改数据源</button>
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

  constructor(private fb: FormBuilder, private message: NzMessageService) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      'eoapi-common.dataStorage': this.model['eoapi-common.dataStorage'] ?? 'local',
      'eoapi-common.remoteServer.url': [
        this.model['eoapi-common.remoteServer.url'] || 'http://localhost:3000',
        [Validators.required],
      ],
      'eoapi-common.remoteServer.token': [
        this.model['eoapi-common.remoteServer.token'] || '1ab2c3d4e5f61ab2c3d4e5f6',
        [Validators.required],
      ],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { model } = changes;

    if (model && this.validateForm?.value) {
      this.setFormValue(model.currentValue);
    }
  }

  /**
   * 测试远程服务器地址是否可用
   */
  async pingRmoteServerUrl() {
    const dataStorage = this.validateForm.value['eoapi-common.dataStorage'];
    const remoteUrl = this.validateForm.value['eoapi-common.remoteServer.url'];
    const token = this.validateForm.value['eoapi-common.remoteServer.token'];

    if (dataStorage !== 'http') {
      return Promise.resolve(false);
    }

    try {
      const url = `${remoteUrl}/system/status`.replace(/(?<!:)\/{2,}/g, '/');
      const response = await fetch(url, {
        headers: {
          'x-api-key': token,
        },
      });
      const result = await response.json();
      console.log('result', result);
      if (result.statusCode !== 200) {
        throw result;
      }
      // await result.json();
      // this.message.create('success', $localize`连接远程数据源成功!`);
      return Promise.resolve(true);
    } catch (error) {
      console.error(error);
      this.message.create('error', $localize`连接远程数据源失败!`);
      return Promise.reject(false);
    }
  }

  async submitForm() {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.loading = true;
      const result = await this.pingRmoteServerUrl().finally(() => (this.loading = false));
      if (Object.is(result, true)) {
        this.message.success($localize`连接远程数据源成功！`);
      }
      this.model = {
        ...this.model,
        ...this.validateForm.value,
      };
      this.modelChange.emit(this.model);
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  setFormValue(model = {}) {
    Object.keys(model).forEach((key) => {
      this.validateForm.get(key)?.setValue(model[key]);
    });
  }
}
