import { Component, OnInit } from '@angular/core'

import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms'

@Component({
  selector: 'eo-account',
  template: `<h2 class="text-lg flex justify-between items-center">
      <span class="font-bold text-lg mb-2" i18n>Account</span>
    </h2>
    <section class="w-1/2">
      <form nz-form [formGroup]="validatePasswordForm" nzLayout="vertical">
        <nz-form-item>
          <nz-form-control nzErrorTip="Please input your current password !">
            <nz-form-label [nzSpan]="12" i18n>Current password</nz-form-label>
            <input
              type="password"
              nz-input
              formControlName="a"
              placeholder=""
              i18n-placeholder
              nzRequired
            />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-control nzErrorTip="Please input your new password !">
            <nz-form-label [nzSpan]="12" i18n>New password</nz-form-label>
            <input
              type="password"
              nz-input
              formControlName="b"
              placeholder=""
              i18n-placeholder
              nzRequired
            />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-control
            nzErrorTip="Please input your confirm new password !"
          >
            <nz-form-label [nzSpan]="12" i18n
              >Confirm new password</nz-form-label
            >
            <input
              type="password"
              nz-input
              formControlName="c"
              placeholder=""
              i18n-placeholder
              nzRequired
            />
          </nz-form-control>
        </nz-form-item>
      </form>
    </section>
    <button nz-button nzType="primary" (click)="btnkti9inCallback()" i18n>
      Change
    </button>
    <section class="h-4"></section>`
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
  async btnkti9inCallback() {
    // * click event callback
  }
}
