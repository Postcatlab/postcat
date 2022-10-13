import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms'
import { UserService } from 'eo/workbench/browser/src/app/shared/services/user/user.service'
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service'
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service'
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service'
import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'eo-account',
  template: `<h2 class="text-lg flex justify-between items-center">
      <span class="font-bold text-lg mb-2" i18n>Account</span>
    </h2>
    <h2
      class="text-lg flex justify-between items-center"
      id="eoapi-account-username"
    >
      <span class="font-bold text-base mb-2" i18n>Username</span>
    </h2>
    <section class="w-1/2">
      <form nz-form [formGroup]="validateUsernameForm" nzLayout="vertical">
        <nz-form-item>
          <nz-form-control nzErrorTip="Please input your username;">
            <input
              type="text"
              nz-input
              formControlName="username"
              placeholder=""
              i18n-placeholder
            />
          </nz-form-control>
        </nz-form-item>

        <button
          nz-button
          type="submit"
          class="w-[84px]"
          nzType="primary"
          (click)="btncme0f5Callback()"
          i18n
        >
          Save
        </button>
      </form>
      <section class="h-4"></section>
    </section>
    <h2
      class="text-lg flex justify-between items-center"
      id="eoapi-account-password"
    >
      <span class="font-bold text-base mb-2" i18n>Password</span>
    </h2>
    <section class="w-1/2">
      <form nz-form [formGroup]="validatePasswordForm" nzLayout="vertical">
        <nz-form-item>
          <nz-form-label [nzSpan]="24" nzRequired i18n
            >Current password</nz-form-label
          >
          <nz-form-control nzErrorTip="Please input your current password;">
            <input
              type="password"
              nz-input
              formControlName="oldPassword"
              placeholder=""
              i18n-placeholder
            />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="24" nzRequired i18n
            >New password</nz-form-label
          >
          <nz-form-control nzErrorTip="Please input your new password;">
            <input
              type="password"
              nz-input
              formControlName="newPassword"
              placeholder=""
              i18n-placeholder
            />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="24" nzRequired i18n
            >Confirm new password</nz-form-label
          >
          <nz-form-control [nzErrorTip]="confirmPasswordErrorTpl">
            <input
              type="password"
              nz-input
              formControlName="confirmPassword"
              placeholder=""
              i18n-placeholder
            />
            <ng-template #confirmPasswordErrorTpl let-control>
              <ng-container *ngIf="control.hasError('required')" i18n>
                Please input your confirm new password;
              </ng-container>

              <ng-container *ngIf="control.hasError('isEqual')" i18n>
                Please confirm your password;
              </ng-container>

              <ng-container *ngIf="control.hasError('minlength')" i18n>
                Min length is 6;
              </ng-container>

              <ng-container *ngIf="control.hasError('maxlength')" i18n>
                Max length is 11;
              </ng-container>
            </ng-template>
          </nz-form-control>
        </nz-form-item>

        <button
          nz-button
          type="submit"
          class="w-[84px]"
          nzType="primary"
          (click)="btnnh23ujCallback()"
          i18n
        >
          Reset
        </button>
      </form>
    </section>
    <section class="h-4"></section> `
})
export class AccountComponent implements OnInit {
  validateUsernameForm
  validatePasswordForm
  constructor(
    public fb: UntypedFormBuilder,
    public user: UserService,
    public message: MessageService,
    public api: RemoteService,
    public eMessage: EoMessageService
  ) {
    this.validateUsernameForm = UntypedFormGroup
    this.validatePasswordForm = UntypedFormGroup
  }
  async ngOnInit(): Promise<void> {
    // * Init Username form
    this.validateUsernameForm = this.fb.group({
      username: [null, [Validators.required]]
    })

    // * Init Password form
    this.validatePasswordForm = this.fb.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(11),
          this.dynamicPasswordValidator
        ]
      ]
    })

    // * get Username form values
    this.validateUsernameForm.patchValue({
      username: this.user.userProfile?.username
    })
  }
  async btncme0f5Callback() {
    // * click event callback
    const { username: user } = this.validateUsernameForm.value
    const [data, err]: any = await this.api.api_userUpdateUserProfile({
      username: user
    })
    if (err) {
      this.eMessage.error($localize`Sorry, username is be used`)
      if (err.status === 401) {
        this.message.send({ type: 'clear-user', data: {} })
        if (this.user.isLogin) {
          return
        }
        this.message.send({ type: 'http-401', data: {} })
      }
      return
    }
    const [pData, pErr]: any = await this.api.api_userReadProfile(null)
    if (pErr) {
      if (pErr.status === 401) {
        this.message.send({ type: 'clear-user', data: {} })
        if (this.user.isLogin) {
          return
        }
        this.message.send({ type: 'http-401', data: {} })
      }
      return
    }
    this.user.setUserProfile(pData)
    this.eMessage.success($localize`Username update success !`)
  }

  dynamicPasswordValidator = (
    control: UntypedFormControl
  ): { [s: string]: boolean } => {
    if (
      control.value &&
      control.value !== this.validatePasswordForm.controls.newPassword.value
    ) {
      return { isEqual: true, error: true }
    }
    return {}
  }
  async btnnh23ujCallback() {
    // * click event callback
    const { oldPassword: oldPassword } = this.validatePasswordForm.value
    const { newPassword: newPassword } = this.validatePasswordForm.value
    const [data, err]: any = await this.api.api_userUpdatePsd({
      oldPassword,
      newPassword
    })
    if (err) {
      this.eMessage.error($localize`Validation failed`)
      if (err.status === 401) {
        this.message.send({ type: 'clear-user', data: {} })
        if (this.user.isLogin) {
          return
        }
        this.message.send({ type: 'http-401', data: {} })
      }
      return
    }
    this.user.setLoginInfo(data)
    this.eMessage.success($localize`Password reset success !`)

    // * Clear password form
    this.validatePasswordForm.reset()
  }
}
