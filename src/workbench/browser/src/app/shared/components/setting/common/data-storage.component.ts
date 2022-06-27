import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
          <nz-form-control nzErrorTip="Please input your Host!">
            <input nz-input formControlName="remoteServer.url" placeholder="your host" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label>Security Token</nz-form-label>
          <nz-form-control nzErrorTip="Please input your Security Token!">
            <input nz-input formControlName="remoteServer.token" placeholder="your security token" />
          </nz-form-control>
        </nz-form-item>
      </ng-container>
      <nz-form-item>
        <nz-form-control>
          <button nz-button nzType="primary">Change Data Storage</button>
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
  @Input() model: object;
  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  validateForm!: FormGroup;

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      dataStorage: 'remote-server',
      'remoteServer.url': [null, [Validators.required]],
      'remoteServer.token': [null, [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { model } = changes;
    if (model) {
      Object.assign(this.validateForm.value, model.currentValue);
    }
  }
}
