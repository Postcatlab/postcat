import { Component, OnInit } from '@angular/core'

import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms'

@Component({
  selector: 'eo-account',
  template: ` <form
      nz-form
      [formGroup]="validatePasswordForm"
      nzLayout="vertical"
    >
      <nz-form-item>
        <nz-form-control nzErrorTip="Please input your current password !">
          <nz-form-label [nzSpan]="4">Current password</nz-form-label>
          <input
            type="password"
            nz-input
            formControlName="a"
            placeholder=""
            nzRequired
          />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-control nzErrorTip="Please input your new password !">
          <nz-form-label [nzSpan]="4">New password</nz-form-label>
          <input
            type="password"
            nz-input
            formControlName="b"
            placeholder=""
            nzRequired
          />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-control nzErrorTip="Please input your confirm new password !">
          <nz-form-label [nzSpan]="4">Confirm new password</nz-form-label>
          <input
            type="password"
            nz-input
            formControlName="c"
            placeholder=""
            nzRequired
          />
        </nz-form-control>
      </nz-form-item>
    </form>
    <button nz-button nzType="primary" (click)="btngkxclyCallback()" i18n>
      Change
    </button>`
})
export class AccountComponent implements OnInit {
  validatePasswordForm
  constructor(public fb: UntypedFormBuilder) {
    this.validatePasswordForm = UntypedFormGroup
  }
  ngOnInit(): void {
    // * Init Password form
    this.validatePasswordForm = this.fb.group({
      a: [null, [Validators.required]],
      b: [null, [Validators.required]],
      c: [null, [Validators.required]]
    })
  }
  async btngkxclyCallback() {
    // * click event callback
  }
}
