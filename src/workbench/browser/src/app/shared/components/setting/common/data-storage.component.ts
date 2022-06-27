import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'eo-data-storage',
  template: `
    <div class="font-bold text-lg mb-2">Data Storage</div>
    <form nz-form nzLayout="vertical" [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <nz-form-item>
        <nz-form-control>
          <nz-select formControlName="dataStorage" nzPlaceHolder="Data Storage">
            <nz-option nzValue="remote-server" nzLabel="Remote Server"></nz-option>
            <nz-option nzValue="localhost" nzLabel="Localhost"></nz-option>
          </nz-select>
        </nz-form-control>
        <div class="text-[12px] mt-[8px] text-gray-400">
          <p>Localhost: Store the data locally. You can only use the product on the current computer.</p>
          <p>
            Remote Server: Store data on a remote server to facilitate cross device use of the product.
            <a href="" class="text-blue-400">Learn more...</a>
          </p>
        </div>
      </nz-form-item>
      <ng-container *ngIf="validateForm.value.dataStorage === 'remote-server'">
        <nz-form-item>
          <nz-form-label>Host</nz-form-label>
          <nz-form-control nzErrorTip="Please input your Host">
            <input nz-input formControlName="remoteServer.url" placeholder="your host" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label>Security Token</nz-form-label>
          <nz-form-control nzErrorTip="Please input your Security Token">
            <input nz-input formControlName="remoteServer.token" placeholder="your security token" />
          </nz-form-control>
        </nz-form-item>
      </ng-container>
      <nz-form-item>
        <nz-form-control>
          <button nz-button nzType="primary" [nzLoading]="loading">Change Data Storage</button>
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
      dataStorage: this.model.dataStorage ?? 'remote-server',
      'remoteServer.url': [this.model['remoteServer.url'], [Validators.required]],
      'remoteServer.token': [this.model['remoteServer.token'], [Validators.required]],
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
    const dataStorage = this.validateForm.value.dataStorage;
    const remoteUrl = this.validateForm.value['remoteServer.url'];
    const token = this.validateForm.value['remoteServer.token'];

    if (dataStorage !== 'remote-server') {
      return Promise.reject(false);
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
      this.message.create('success', '远程服务器地址设置成功！');
      return Promise.resolve(true);
    } catch (error) {
      console.error(error);
      this.message.create('error', '远程服务器连接失败！');
      return Promise.reject(false);
    }
  }

  async submitForm() {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.loading = true;
      const result = await this.pingRmoteServerUrl().finally(() => (this.loading = false));
      if (Object.is(result, true)) {
        this.message.success('远程数据源连接成功');
      }
      this.model = this.validateForm.value;
      this.modelChange.emit(this.validateForm.value);
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
