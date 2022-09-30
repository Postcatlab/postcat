import { Component, OnInit } from '@angular/core'

import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms'
import { UserService } from 'eo/workbench/browser/src/app/shared/services/user/user.service'
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service'
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service'

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
        (click)="btn1u2068Callback()"
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
              formControlName="oldPassword"
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
              formControlName="newPassword"
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
              formControlName="confirmPassword"
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
      (click)="btnn3ocxcCallback()"
      i18n
    >
      Reset
    </button>
    <section class="h-4"></section> `
})
export class AccountComponent implements OnInit {
  validateUsernameForm
  validatePasswordForm
  constructor(
    public fb: UntypedFormBuilder,
    public user: UserService,
    public api: RemoteService,
    public eMessage: EoMessageService
  ) {
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
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    })

    // * get Username form values
    this.validateUsernameForm.patchValue({
      username: this.user.userProfile?.username
    })
  }
  async btn1u2068Callback() {
    // * click event callback
    const { username: user } = this.validateUsernameForm.value
    const [err, data]: any = await this.api.api_userUpdateUserProfile({
      username: user,
      avatar: '111'
    })
    if (err) {
      return
    }
    const [pData, pErr]: any = await this.api.api_userReadProfile(null)
    if (pErr) {
      return
    }

    this.user.setUserProfile(pData.data)
  }
  async btnn3ocxcCallback() {
    // * click event callback
    const { oldPassword: oldPassword } = this.validatePasswordForm.value
    const { newPassword: newPassword } = this.validatePasswordForm.value
    const [err, data]: any = await this.api.api_userUpdatePsd({
      oldPassword,
      newPassword
    })
    if (err) {
      return
    }
    this.eMessage.success(`Password reset success !`)

    // * Clear Password form
    this.validatePasswordForm.reset()
  }
}
