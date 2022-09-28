import { Component, OnInit } from '@angular/core';

import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'eo-user-modal',
  template: ` <nz-modal
      [nzFooter]="null"
      [(nzVisible)]="isRetryModalVisible"
      (nzOnCancel)="handleRetryModalCancel()"
      nzTitle="Do you want to upload local data to the cloud ?"
    >
      <ng-container *nzModalContent>
        <div class="pb-4">
          <span i18n>After confirmation, a cloud space will be created and the local data will be uploaded</span>
        </div>
      </ng-container>
    </nz-modal>
    <nz-modal
      [nzFooter]="null"
      [(nzVisible)]="isCheckConnectModalVisible"
      (nzOnCancel)="handleCheckConnectModalCancel()"
      nzTitle="Check your connection"
    >
      <ng-container *nzModalContent>
        <div class="pb-4">
          <span i18n>Can 't connect right now, click to retry</span>
        </div>
      </ng-container>
    </nz-modal>
    <nz-modal
      [nzFooter]="null"
      [(nzVisible)]="isLoginModalVisible"
      (nzOnCancel)="handleLoginModalCancel()"
      nzTitle="Login"
    >
      <ng-container *nzModalContent>
        <form nz-form [formGroup]="validateUsernameForm" nzLayout="horizontal">
          <nz-form-item>
            <nz-form-control nzErrorTip="Please input your email phone !">
              <nz-form-label [nzSpan]="4">Email/Phone</nz-form-label>
              <input type="text" nz-input formControlName="FcEmailPhone" placeholder="Enter env name" nzRequired />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-control nzErrorTip="Please input your password !">
              <nz-form-label [nzSpan]="4">Password</nz-form-label>
            </nz-form-control>
          </nz-form-item>
        </form>
        <button nz-button nzType="primary" (click)="btnpocr37Callback()" i18n>Sign In/Up</button>
      </ng-container>
    </nz-modal>
    <nz-modal
      [nzFooter]="null"
      [(nzVisible)]="isOpenSettingModalVisible"
      (nzOnCancel)="handleOpenSettingModalCancel()"
      nzTitle="Open setting"
    >
      <ng-container *nzModalContent>
        <div class="pb-4">
          <span i18n>If you want to collaborate, please</span>
          <span style="color:blue" i18n>open the settings</span>
          <span i18n>and fill in the configuration</span>
        </div>
      </ng-container>
    </nz-modal>`,
})
export class UserModalComponent implements OnInit {
  isRetryModalVisible;
  isCheckConnectModalVisible;
  isLoginModalVisible;
  validateUsernameForm;
  isOpenSettingModalVisible;
  constructor(public message: MessageService, public modal: NzModalService, public fb: UntypedFormBuilder) {
    this.isRetryModalVisible = false;
    this.isCheckConnectModalVisible = false;
    this.isLoginModalVisible = false;
    this.validateUsernameForm = UntypedFormGroup;
    this.isOpenSettingModalVisible = false;
  }
  ngOnInit(): void {
    this.message.get().subscribe(async ({ type, data }) => {
      console.log('jjiji');
      if (type === 'login') {
        // * 唤起弹窗
        this.isLoginModalVisible = true;

        return;
      }
    });

    // * Init Username form
    this.validateUsernameForm = this.fb.group({
      FcEmailPhone: [null, [Validators.required]],
      FcPassword: [null, [Validators.required]],
    });
  }
  handleRetryModalCancel(): void {
    // * 关闭弹窗
    this.isRetryModalVisible = false;
  }
  handleCheckConnectModalCancel(): void {
    // * 关闭弹窗
    this.isCheckConnectModalVisible = false;
  }
  handleLoginModalCancel(): void {
    // * 关闭弹窗
    this.isLoginModalVisible = false;
  }
  async btnpocr37Callback() {
    // * click event callback

    // * 唤起弹窗
    this.isRetryModalVisible = true;
  }
  handleOpenSettingModalCancel(): void {
    // * 关闭弹窗
    this.isOpenSettingModalVisible = false;
  }
}
