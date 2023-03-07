import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { Group } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';

export const noAuth = {
  name: 'No Auth'
};

export const inheritAuth = {
  name: 'Inherit auth from parent'
};

@Component({
  selector: 'authorization-extension-form',
  template: `
    <form nz-form nzLayout="vertical" [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <nz-form-item>
        <nz-form-label i18n>Type</nz-form-label>
        <nz-form-control>
          <eo-ng-radio-group formControlName="authType">
            <label *ngFor="let item of authTypeList" eo-ng-radio [nzValue]="item.name">
              {{ item.name }}
            </label>
          </eo-ng-radio-group>
        </nz-form-control>
      </nz-form-item>
    </form>
    <nz-divider></nz-divider>
    <ng-container *ngIf="inheritAuth.name === validateForm.value.authType">
      <div class="text-tips my-[16px]" i18n>
        This API Request is using <b>{{ validateForm.value.authType }}</b> from <a>{{ groupInfo?.name }}</a>
      </div>
    </ng-container>
    <eo-ng-feedback-alert class="tips block mt-[20px]" nzType="default" [nzMessage]="templateRefMsg" nzShowIcon></eo-ng-feedback-alert>
    <ng-template #templateRefMsg>
      <div class="text" i18n>
        These parameters hold sensitive data. To keep this data secure while working in a collaborative environment, we recommend using
        variables. Learn more about
        <a href="https://docs.postcat.com/docs/global-variable.html" target="_blank" rel="noopener noreferrer">variables</a>
      </div>
    </ng-template>
  `,
  styles: [
    `
      :host .tips {
        background-color: rgba(249, 224, 199, 1);
      }
    `
  ]
})
export class AuthorizationExtensionFormComponent implements OnInit, OnChanges {
  @Input() authType = noAuth;
  @Input() groupID: number;

  groupInfo: Group;

  inheritAuth = inheritAuth;
  validateForm!: UntypedFormGroup;

  get authTypeList() {
    return [this.authType, ...this.extensionList];
  }

  extensionList = [
    {
      name: 'Basic Auth'
    },
    {
      name: 'JWT Bearer'
    }
  ];

  constructor(private fb: UntypedFormBuilder, private apiService: ApiService) {}

  ngOnChanges(changes: SimpleChanges) {
    const { authType, groupID } = changes;
    if (authType?.currentValue?.name) {
      this.validateForm?.get('authType')?.setValue?.(authType.currentValue.name);
    }

    if (groupID?.currentValue !== groupID?.previousValue) {
      this.getGroupInfo();
    }
  }

  async getGroupInfo() {
    const [res, err]: any = await this.apiService.api_groupDetail({ id: this.groupID });
    console.log('res', res);
    this.groupInfo = res;
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  get isHorizontal(): boolean {
    return this.validateForm.controls.formLayout?.value === 'horizontal';
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      authType: this.authType.name,
      fieldA: [null, [Validators.required]],
      filedB: [null, [Validators.required]]
    });
  }
}
