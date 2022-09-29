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
    <h2 class="text-lg flex justify-between items-center">
      <span class="font-bold text-base mb-2" i18n>Username</span>
    </h2>
    <section class="w-1/2">
      <form nz-form [formGroup]="validateUsernameForm" nzLayout="vertical">
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
      </form>
      <button
        nz-button
        class="w-[120px]"
        nzType="primary"
        (click)="btnxbv3kcCallback()"
        i18n
      >
        Save
      </button>
      <section class="h-4"></section>
    </section>
    <h2 class="text-lg flex justify-between items-center">
      <span class="font-bold text-base mb-2" i18n>Password</span>
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
    <button
      nz-button
      class="w-[120px]"
      nzType="primary"
      (click)="btn4jwvh8Callback()"
      i18n
    >
      Reset
    </button>
    <section class="h-4"></section>`
})
export class AccountComponent implements OnInit {
  validateUsernameForm
  validatePasswordForm
  constructor(public fb: UntypedFormBuilder) {
    this.validateUsernameForm = UntypedFormGroup
    this.validatePasswordForm = UntypedFormGroup
  }
  ngOnInit(): void {
    // * Init Username form
    this.validateUsernameForm = this.fb.group({
      a: [null, [Validators.required]]
    })

    // * Init Password form
    this.validatePasswordForm = this.fb.group({
      a: [null, [Validators.required]],
      b: [null, [Validators.required]],
      c: [null, [Validators.required]]
    })
  }
  async btnxbv3kcCallback() {
    // * click event callback
  }
  async btn4jwvh8Callback() {
    // * click event callback
  }
}
