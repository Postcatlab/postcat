import { ViewChild, ElementRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { MessageService } from 'pc/browser/src/app/services/message/message.service';
import { ApiService } from 'pc/browser/src/app/services/storage/api.service';
import { StoreService } from 'pc/browser/src/app/store/state.service';

@Component({
  selector: 'eo-account',
  template: `
    <h2 class="text-lg flex justify-between items-center" id="postcat-account-password">
      <span class="font-bold text-base mb-2" i18n>Change Password</span>
    </h2>
    <section class="w-1/2">
      <form nz-form [formGroup]="validatePasswordForm" nzLayout="vertical">
        <nz-form-item>
          <nz-form-label [nzSpan]="24" nzRequired i18n nzFor="newPassword">New password</nz-form-label>
          <nz-form-control i18n-nzErrorTip nzErrorTip="Please input your new password">
            <input type="password" eo-ng-input formControlName="newPassword" id="newPassword" placeholder="" i18n-placeholder />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="24" nzRequired i18n nzFor="confirmPassword">Confirm new password</nz-form-label>
          <nz-form-control [nzErrorTip]="confirmPasswordErrorTpl">
            <input type="password" eo-ng-input formControlName="confirmPassword" id="confirmPassword" placeholder="" i18n-placeholder />
            <ng-template #confirmPasswordErrorTpl let-control>
              <ng-container *ngIf="control.hasError('required')" i18n> Please input your confirm new password </ng-container>

              <ng-container *ngIf="control.hasError('isEqual')" i18n> Please confirm your password </ng-container>

              <ng-container *ngIf="control.hasError('minlength')" i18n> Min length is 6 </ng-container>

              <ng-container *ngIf="control.hasError('maxlength')" i18n> Max length is 11 </ng-container>
            </ng-template>
          </nz-form-control>
        </nz-form-item>

        <section class="">
          <button
            eo-ng-button
            [nzLoading]="isResetBtnBtnLoading"
            [disabled]="!validatePasswordForm.valid"
            type="submit"
            nzType="primary"
            (click)="btnn016ppCallback()"
            i18n="@@btnResetPassword"
          >
            Change
          </button>
        </section>
      </form>
    </section>
    <section class="h-4"></section>
  `
})
export class AccountComponent implements OnInit {
  isSaveUsernameBtnLoading;
  validatePasswordForm;
  isResetBtnBtnLoading;
  constructor(
    public fb: UntypedFormBuilder,
    public store: StoreService,
    public message: MessageService,
    public api: ApiService,
    public eMessage: EoNgFeedbackMessageService
  ) {
    this.isSaveUsernameBtnLoading = false;
    this.validatePasswordForm = UntypedFormGroup;
    this.isResetBtnBtnLoading = false;
  }
  async ngOnInit(): Promise<void> {
    // * Init Password form
    this.validatePasswordForm = this.fb.group({
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(11), this.dynamicPasswordValidator]]
    });
  }

  dynamicPasswordValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (control.value && control.value !== this.validatePasswordForm.controls.newPassword.value) {
      return { isEqual: true, error: true };
    }
    return {};
  };
  async btnn016ppCallback() {
    // * click event callback
    this.isResetBtnBtnLoading = true;
    const btnResetBtnRunning = async () => {
      const { newPassword: password } = this.validatePasswordForm.value;
      const [, err]: any = await this.api.api_userUpdatePassword({
        password
      });
      if (err) {
        this.eMessage.error($localize`Validation failed`);
        return;
      }
      this.eMessage.success($localize`Password reset success !`);

      // * Clear password form
      this.validatePasswordForm.reset();
    };
    await btnResetBtnRunning();
    this.isResetBtnBtnLoading = false;
  }
}
