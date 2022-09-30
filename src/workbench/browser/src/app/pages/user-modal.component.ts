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
      [nzFooter]="modalSyncFooter"
      [(nzVisible)]="isSyncModalVisible"
      (nzOnCancel)="handleSyncModalCancel()"
      nzTitle="Do you want to upload local data to the cloud ?"
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <div class="pb-4">
          <span i18n>
            After confirmation, the system will create a cloud space to upload
            the local data to the cloud.
          </span>
        </div>
        <nz-alert
          nzType="warning"
          nzMessage="Subsequent local space and cloud space are no longer synchronized"
          nzShowIcon
        ></nz-alert>
      </ng-container>
      <ng-template #modalSyncFooter>
        <button
          nz-button
          class=""
          nzType="default"
          (click)="btnhhf7ogCallback()"
          i18n
        >
          Cancel
        </button>
        <button
          nz-button
          class=""
          nzType="primary"
          (click)="btnx1la8mCallback()"
          i18n
        >
          Sync
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
          <span i18n> Can 't connect right now, click to retry </span>
        </div>
      </ng-container>
    </nz-modal>
    <nz-modal
      [nzFooter]="null"
      [nzWidth]="400"
      [(nzVisible)]="isLoginModalVisible"
      (nzOnCancel)="handleLoginModalCancel()"
      (nzAfterClose)="e0u3wrfCallback()"
      nzTitle="Sign In/Up"
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <section class="my-3">
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
                  placeholder="Enter Enter Email/Phone/Username"
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
            class="h-10"
            nzType="primary"
            nzBlock
            (click)="btnnu16emCallback()"
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
          <span i18n> If you want to collaborate, please </span>
          <span style="color: #1890ff" i18n> open the settings </span>
          <span i18n> and fill in the configuration </span>
        </div>
      </ng-container>
    </nz-modal>
    <nz-modal
      [nzFooter]="modalAddWorkspaceFooter"
      [(nzVisible)]="isAddWorkspaceModalVisible"
      (nzOnCancel)="handleAddWorkspaceModalCancel()"
      nzTitle="Add Workspace"
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
          (click)="btn7alsyuCallback()"
          i18n
        >
          Cancel
        </button>
        <button
          nz-button
          class=""
          nzType="primary"
          (click)="btnoimh9nCallback()"
          i18n
        >
          Add
        </button>
      </ng-template>
    </nz-modal>`
})
export class UserModalComponent implements OnInit {
  isSyncModalVisible
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
    this.isSyncModalVisible = false
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
        this.user.setUserProfile({
          id: -1,
          password: '',
          username: '',
          workspaces: []
        })
        this.eMessage.success($localize`Successfully logged out !`)
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

    // * 唤起弹窗
    this.isOpenSettingModalVisible = true
  }
  handleSyncModalCancel(): void {
    // * 关闭弹窗
    this.isSyncModalVisible = false
  }
  async btnhhf7ogCallback() {
    // * click event callback

    // * 关闭弹窗
    this.isSyncModalVisible = false
  }
  async btnx1la8mCallback() {
    // * click event callback
    const eData = await this.workspace.exportProjectData()
    const [data, err]: any = await this.api.api_workspaceUpload(eData)
    if (err) {
      return
    }

    const { workspace } = data
    const { id } = workspace

    const list = this.workspace.getWorkspaceList()
    this.workspace.setWorkspaceList([...list, workspace])
    this.workspace.setCurrentWorkspaceID(id)

    // * 关闭弹窗
    this.isSyncModalVisible = false
  }
  handleCheckConnectModalCancel(): void {
    // * 关闭弹窗
    this.isCheckConnectModalVisible = false
  }
  handleLoginModalCancel(): void {
    // * 关闭弹窗
    this.isLoginModalVisible = false
  }
  async e0u3wrfCallback() {
    // * nzAfterClose event callback

    // * Clear Username form
    this.validateUsernameForm.reset()
  }
  async btnnu16emCallback() {
    // * click event callback

    // * get Username form values
    const formData = this.validateUsernameForm.value
    const [data, err]: any = await this.api.api_authLogin(formData)
    if (err) {
      this.eMessage.error($localize`Authentication failed !`)
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
    this.isSyncModalVisible = true
  }
  handleOpenSettingModalCancel(): void {
    // * 关闭弹窗
    this.isOpenSettingModalVisible = false
  }
  handleAddWorkspaceModalCancel(): void {
    // * 关闭弹窗
    this.isAddWorkspaceModalVisible = false
  }
  async btn7alsyuCallback() {
    // * click event callback

    // * 关闭弹窗
    this.isAddWorkspaceModalVisible = false
  }
  async btnoimh9nCallback() {
    // * click event callback
    const title = this.inputWorkspaceNameValue

    const [data, err]: any = await this.api.api_workspaceCreate({ title })
    if (err) {
      return
    }

    this.eMessage.success($localize`Create new workspace successfully !`)

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
