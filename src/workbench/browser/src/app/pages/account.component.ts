import { Component, OnInit } from '@angular/core'

import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms'
import { UserService } from 'eo/workbench/browser/src/app/shared/services/user/user.service'

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
          <nz-form-control nzErrorTip="Please input your username !">
            <input
              type="text"
              nz-input
              formControlName="username"
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
        (click)="btnu4hgjqCallback()"
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
      (click)="btncav1yeCallback()"
      i18n
    >
      Reset
    </button>
    <section class="h-4"></section> `
})
export class AccountComponent implements OnInit {
  validateUsernameForm
  validatePasswordForm
  constructor(public fb: UntypedFormBuilder, public user: UserService) {
    this.validateUsernameForm = UntypedFormGroup
    this.validatePasswordForm = UntypedFormGroup
  }
  ngOnInit(): void {
    // * Init Username form
    this.validateUsernameForm = this.fb.group({
      username: [null, [Validators.required]]
    })

    // * Init Password form
    this.validatePasswordForm = this.fb.group({
      a: [null, [Validators.required]],
      b: [null, [Validators.required]],
      c: [null, [Validators.required]]
    })

    // * get Username form values
    this.validateUsernameForm.patchValue({
      username: this.user.userInfo?.username
    })
  }
  async btnu4hgjqCallback() {
    // * click event callback
  }
  async btncav1yeCallback() {
    // * click event callback
  }
}
