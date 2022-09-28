import { Component, OnInit } from '@angular/core';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'eo-account',
  template: ` <form nz-form [formGroup]="validatePasswordForm" nzLayout="horizontal">
      <nz-form-item>
        <nz-form-control nzErrorTip="Please input your current password !">
          <nz-form-label [nzSpan]="4">Current password</nz-form-label>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-control nzErrorTip="Please input your new password !">
          <nz-form-label [nzSpan]="4">New password</nz-form-label>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-control nzErrorTip="Please input your confirm new password !">
          <nz-form-label [nzSpan]="4">Confirm new password</nz-form-label>
        </nz-form-control>
      </nz-form-item>
    </form>
    <button nz-button nzType="primary" (click)="btngrqv1oCallback()" i18n>Change</button>`,
})
export class AccountComponent implements OnInit {
  validatePasswordForm;
  constructor(public fb: UntypedFormBuilder) {
    this.validatePasswordForm = UntypedFormGroup;
  }
  ngOnInit(): void {
    // * Init Password form
    this.validatePasswordForm = this.fb.group({
      FcCurrentPassword: [null, [Validators.required]],
      FcNewPassword: [null, [Validators.required]],
      FcConfirmNewPassword: [null, [Validators.required]],
    });
  }
  async btngrqv1oCallback() {
    // * click event callback
  }
}
