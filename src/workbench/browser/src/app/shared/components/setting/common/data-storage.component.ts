import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';

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

  constructor(private fb: FormBuilder, private dataSource: DataSourceService) {}

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
      this.modelChange.emit(this.model);
      await this.dataSource.switchDataSource('http');
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  async updateDataSource() {}

  setFormValue(model = {}) {
    Object.keys(model).forEach((key) => {
      this.validateForm.get(key)?.setValue(model[key]);
    });
  }
}
