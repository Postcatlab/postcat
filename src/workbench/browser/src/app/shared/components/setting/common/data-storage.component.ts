import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services/electron/electron.service';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'eo-data-storage',
  template: `
    <div class="font-bold text-lg mb-2" i18n="@@DataSource">Data Storage</div>
    <form nz-form nzLayout="vertical" [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <nz-form-item>
        <div class="text-[12px] mt-[8px] text-gray-400">
          <p i18n>
            Cloud: Store data on a cloud server to facilitate cross device use of the product. Only the client can
            connect to the cloud server. You need to download the client first.
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
          <button nz-button nzType="primary" [nzLoading]="loading" i18n>Save and Reload</button>
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
    private message: NzMessageService,
    private electronService: ElectronService,
    private dataSource: DataSourceService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      'eoapi-common.dataStorage': this.model['eoapi-common.dataStorage'] ?? 'local',
      'eoapi-common.remoteServer.url': [this.model['eoapi-common.remoteServer.url'] || '', [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { model } = changes;

    if (model && this.validateForm?.value) {
      this.setFormValue(model.currentValue);
    }
  }

  handleSelectDataStorage(val) {
    if (!this.electronService.isElectron && val === 'http') {
      this.validateForm.controls['eoapi-common.dataStorage'].setValue('local');
      return this.message.error(
        $localize`Only the client can connect to the cloud server. You need to download the client first.`
      );
    }
  }
  async submitForm() {
    const dataStorage = this.validateForm.value['eoapi-common.dataStorage'];
    const isRemote = dataStorage === 'http';
    const isValid = this.validateForm.valid;

    if (!this.electronService.isElectron && isRemote) {
      return this.message.error(
        $localize`Only the client can connect to the cloud server. You need to download the client first.`
      );
    }

    if (isValid && isRemote) {
      console.log('submit', this.validateForm.value);
      this.loading = true;
      const [isSuccess] = await this.dataSource.pingRmoteServerUrl();
      this.loading = false;
      if (isSuccess === true) {
        this.message.success($localize`The remote data source connection is successful!`);
      }
      this.updateDataSource();
    } else if (isValid) {
      this.updateDataSource();
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  async updateDataSource() {
    this.model = {
      ...this.model,
      ...this.validateForm.value,
    };
    this.modelChange.emit(this.model);
    await this.dataSource.switchDataSource(this.model['eoapi-common.dataStorage']);
  }

  setFormValue(model = {}) {
    Object.keys(model).forEach((key) => {
      this.validateForm.get(key)?.setValue(model[key]);
    });
  }
}
