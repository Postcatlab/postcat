import { Component, OnInit } from '@angular/core'

import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service'
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service'
import { UserService } from 'eo/workbench/browser/src/app/shared/services/user/user.service'
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service'
import { NzModalService } from 'ng-zorro-antd/modal'
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms'
import { WorkspaceService } from 'eo/workbench/browser/src/app/shared/services/workspace/workspace.service'

@Component({
  selector: 'eo-user-modal',
  template: ` <nz-modal
      [nzFooter]="modalRetryFooter"
      [(nzVisible)]="isRetryModalVisible"
      (nzOnCancel)="handleRetryModalCancel()"
      nzTitle="Do you want to upload local data to the cloud ?"
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <div class="pb-4">
          <span i18n
            >After confirmation, a cloud space will be created and the local
            data will be uploaded</span
          >
        </div>
      </ng-container>
      <ng-template #modalRetryFooter>
        <button
          nz-button
          class=""
          nzType="primary"
          (click)="btnco732lCallback()"
          i18n
        >
          Cancel
        </button>
      </ng-template>
    </nz-modal>
    <nz-modal
      [nzFooter]="null"
      [(nzVisible)]="isCheckConnectModalVisible"
      (nzOnCancel)="handleCheckConnectModalCancel()"
      nzTitle="Check your connection"
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <div class="pb-4">
          <span i18n>Can 't connect right now, click to retry</span>
        </div>
      </ng-container>
    </nz-modal>
    <nz-modal
      [nzFooter]="null"
      [nzWidth]="400"
      [(nzVisible)]="isLoginModalVisible"
      (nzOnCancel)="handleLoginModalCancel()"
      (nzAfterClose)="e0idr3zCallback()"
      nzTitle="Sign In/Up"
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <section class="my-8">
          <form
            nz-form
            [formGroup]="validateUsernameForm"
            nzLayout="horizontal"
          >
            <nz-form-item>
              <nz-form-control nzErrorTip="Please input your email or phone !">
                <input
                  type="text"
                  nz-input
                  formControlName="username"
                  placeholder="Enter username"
                  i18n-placeholder
                  nzRequired
                />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-control nzErrorTip="Please input your password !">
                <input
                  type="password"
                  nz-input
                  formControlName="password"
                  placeholder="Enter password"
                  i18n-placeholder
                  nzRequired
                />
              </nz-form-control>
            </nz-form-item>
          </form>
          <section class="h-2"></section>
          <button
            nz-button
            class=""
            nzType="primary"
            nzBlock
            (click)="btn9mlrpcCallback()"
            i18n
          >
            Sign In/Up
          </button>
        </section>
      </ng-container>
    </nz-modal>
    <nz-modal
      [nzFooter]="null"
      [(nzVisible)]="isOpenSettingModalVisible"
      (nzOnCancel)="handleOpenSettingModalCancel()"
      nzTitle="Open setting"
      i18n-nzTitle
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
      [nzFooter]="modalAddWorkspaceFooter"
      [(nzVisible)]="isAddWorkspaceModalVisible"
      (nzOnCancel)="handleAddWorkspaceModalCancel()"
      nzTitle="Create Workspace"
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <input
          nz-input
          [(ngModel)]="inputWorkspaceNameValue"
          i18n-placeholder
          placeholder="Workspace Name"
        />
      </ng-container>
      <ng-template #modalAddWorkspaceFooter>
        <button
          nz-button
          class=""
          nzType="default"
          (click)="btnov6mdwCallback()"
          i18n
        >
          Cancel
        </button>
        <button
          nz-button
          class=""
          nzType="primary"
          (click)="btn50t0ktCallback()"
          i18n
        >
          Create
        </button>
      </ng-template>
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
    public eMessage: EoMessageService,
    public user: UserService,
    public message: MessageService,
    public modal: NzModalService,
    public fb: UntypedFormBuilder,
    public workspace: WorkspaceService
  ) {
    this.isRetryModalVisible = false
    this.isCheckConnectModalVisible = false
    this.isLoginModalVisible = false
    this.validateUsernameForm = UntypedFormGroup
    this.isOpenSettingModalVisible = false
    this.isAddWorkspaceModalVisible = false
    this.inputWorkspaceNameValue = ''
  }
  async ngOnInit(): Promise<void> {
    this.message.get().subscribe(async ({ type, data }) => {
      if (type === 'login') {
        // * 唤起弹窗
        this.isLoginModalVisible = true

        return
      }

      if (type === 'logOut') {
        const refreshToken = this.user.refreshToken
        const [data, err]: any = await this.api.api_authLogout({ refreshToken })
        if (err) {
          return
        }
        this.eMessage.success(`Logout already !`)
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

    const { id: workspaceID } = this.workspace.currentWorkspace
    const [list, wErr]: any = await this.api.api_workspaceList({})
    if (wErr) {
      return
    }

    this.workspace.setWorkspaceList(list)
  }
  handleRetryModalCancel(): void {
    // * 关闭弹窗
    this.isRetryModalVisible = false
  }
  async btnco732lCallback() {
    // * click event callback
  }
  handleCheckConnectModalCancel(): void {
    // * 关闭弹窗
    this.isCheckConnectModalVisible = false
  }
  handleLoginModalCancel(): void {
    // * 关闭弹窗
    this.isLoginModalVisible = false
  }
  async e0idr3zCallback() {
    // * nzAfterClose event callback

    // * Clear Username form
    this.validateUsernameForm.reset()
  }
  async btn9mlrpcCallback() {
    // * click event callback

    // * get Username form values
    const formData = this.validateUsernameForm.value
    const [data, err]: any = await this.api.api_authLogin(formData)
    if (err) {
      this.eMessage.error('Authentication was not successful !')
      return
    }

    this.user.setLoginInfo(data)

    // * 关闭弹窗
    this.isLoginModalVisible = false

    const [pData, pErr]: any = await this.api.api_userReadProfile(null)
    if (pErr) {
      return
    }

    this.user.setUserProfile(pData)

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
  async btnov6mdwCallback() {
    // * click event callback

    // * 关闭弹窗
    this.isAddWorkspaceModalVisible = false
  }
  async btn50t0ktCallback() {
    // * click event callback
    const title = this.inputWorkspaceNameValue

    const [data, err]: any = await this.api.api_workspaceCreate({ title })
    if (err) {
      return
    }

    this.eMessage.success(`Create new workspace success !`)

    // * 关闭弹窗
    this.isAddWorkspaceModalVisible = false

    this.inputWorkspaceNameValue = ''
    const [list, wErr]: any = await this.api.api_workspaceList({})
    if (wErr) {
      return
    }

    this.workspace.setWorkspaceList(list)
  }
}
