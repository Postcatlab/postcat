import { Component, OnInit } from '@angular/core'

import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service'
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service'
import { NzModalService } from 'ng-zorro-antd/modal'
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms'

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
          <span i18n
            >After confirmation, a cloud space will be created and the local
            data will be uploaded</span
          >
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
      (nzAfterClose)="el45iboCallback()"
      nzTitle="Login"
    >
      <ng-container *nzModalContent>
        <form nz-form [formGroup]="validateUsernameForm" nzLayout="horizontal">
          <nz-form-item>
            <nz-form-control nzErrorTip="Please input your email or phone !">
              <nz-form-label [nzSpan]="12">Email/Phone</nz-form-label>
              <input
                type="text"
                nz-input
                formControlName="username"
                placeholder="Enter username"
                nzRequired
              />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-control nzErrorTip="Please input your password !">
              <nz-form-label [nzSpan]="12">Password</nz-form-label>
              <input
                type="password"
                nz-input
                formControlName="password"
                placeholder="Enter password"
                nzRequired
              />
            </nz-form-control>
          </nz-form-item>
        </form>
        <button nz-button nzType="primary" (click)="btny6xl79Callback()" i18n>
          Sign In/Up
        </button>
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
    </nz-modal>
    <nz-modal
      [nzFooter]="null"
      [(nzVisible)]="isAddWorkspaceModalVisible"
      (nzOnCancel)="handleAddWorkspaceModalCancel()"
      nzTitle="Create Workspace"
    >
      <ng-container *nzModalContent>
        <input
          nz-input
          [(ngModel)]="inputWorkspaceNameValue"
          placeholder="Workspace Name"
        />
      </ng-container>
    </nz-modal>`
})
export class UserModalComponent implements OnInit {
  isRetryModalVisible
  isCheckConnectModalVisible
  isLoginModalVisible
  validateUsernameForm
  isOpenSettingModalVisible
  isAddWorkspaceModalVisible
  inputWorkspaceNameValue
  constructor(
    public api: RemoteService,
    public message: MessageService,
    public modal: NzModalService,
    public fb: UntypedFormBuilder
  ) {
    this.isRetryModalVisible = false
    this.isCheckConnectModalVisible = false
    this.isLoginModalVisible = false
    this.validateUsernameForm = UntypedFormGroup
    this.isOpenSettingModalVisible = false
    this.isAddWorkspaceModalVisible = false
    this.inputWorkspaceNameValue = ''
  }
  ngOnInit(): void {
    this.message.get().subscribe(async ({ type, data }) => {
      if (type === 'login') {
        // * 唤起弹窗
        this.isLoginModalVisible = true

        return
      }

      if (type === 'logOut') {
        const refreshTokenExpiresAt = '2333'

        const [err, data]: any = await this.api.api_authLogout({
          refreshTokenExpiresAt
        })
        if (err) {
          return
        }

        return
      }

      if (type === 'addWorkspace') {
        // * 唤起弹窗
        this.isAddWorkspaceModalVisible = true

        return
      }
    })

    // * Init Username form
    this.validateUsernameForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    })
  }
  handleRetryModalCancel(): void {
    // * 关闭弹窗
    this.isRetryModalVisible = false
  }
  handleCheckConnectModalCancel(): void {
    // * 关闭弹窗
    this.isCheckConnectModalVisible = false
  }
  handleLoginModalCancel(): void {
    // * 关闭弹窗
    this.isLoginModalVisible = false
  }
  async el45iboCallback() {
    // * nzAfterClose event callback

    // * Clear Username form
    this.validateUsernameForm.reset()
  }
  async btny6xl79Callback() {
    // * click event callback

    // * get Username form values
    const formData = this.validateUsernameForm.value
    const [err, data]: any = await this.api.api_authLogin(formData)
    if (err) {
      return
    }

    // * 关闭弹窗
    this.isLoginModalVisible = false

    // * 唤起弹窗
    this.isRetryModalVisible = true
  }
  handleOpenSettingModalCancel(): void {
    // * 关闭弹窗
    this.isOpenSettingModalVisible = false
  }
  handleAddWorkspaceModalCancel(): void {
    // * 关闭弹窗
    this.isAddWorkspaceModalVisible = false
  }
}
