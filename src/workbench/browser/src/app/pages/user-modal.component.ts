import { Component, OnInit } from '@angular/core'

import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service'
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service'
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service'
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
        <span i18n>
          After confirmation, the system will create a cloud space to upload the
          local data to the cloud.
        </span>
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
          (click)="btn420d2iCallback()"
          i18n
        >
          Cancel
        </button>
        <button
          nz-button
          class=""
          nzType="primary"
          (click)="btn7q6ifsCallback()"
          i18n
        >
          Sync
        </button>
      </ng-template>
    </nz-modal>
    <nz-modal
      [nzFooter]="modalCheckConnectFooter"
      [(nzVisible)]="isCheckConnectModalVisible"
      (nzOnCancel)="handleCheckConnectModalCancel()"
      nzTitle="Check your connection"
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <span i18n> Can 't connect right now, click to retry </span>
      </ng-container>
      <ng-template #modalCheckConnectFooter>
        <button
          nz-button
          class=""
          nzType="default"
          (click)="btn5hq3olCallback()"
          i18n
        >
          Cancel
        </button>
        <button
          nz-button
          class=""
          nzType="primary"
          (click)="btn835pc7Callback()"
          i18n
        >
          Retry
        </button>
      </ng-template>
    </nz-modal>
    <nz-modal
      [nzFooter]="null"
      [nzWidth]="400"
      [(nzVisible)]="isLoginModalVisible"
      (nzOnCancel)="handleLoginModalCancel()"
      (nzAfterClose)="ev61lknCallback()"
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
                  placeholder="Enter Email/Phone/Username"
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
            (click)="btnorcv09Callback()"
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
        <span i18n> If you want to collaborate, please </span>
        <span style="color: #1890ff" (click)="textgx00o6Callback()" i18n>
          open the settings
        </span>
        <span i18n> and fill in the configuration </span>
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
          (click)="btnujldwiCallback()"
          i18n
        >
          Cancel
        </button>
        <button
          nz-button
          class=""
          nzType="primary"
          (click)="btn36a2xrCallback()"
          i18n
        >
          Save
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
    public dataSource: DataSourceService,
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
        this.user.setUserProfile({
          id: -1,
          password: '',
          username: '',
          workspaces: []
        })

        const [data, err]: any = await this.api.api_authLogout({ refreshToken })
        if (err) {
          return
        }
        this.eMessage.success($localize`Successfully logged out !`)
        return
      }

      if (type === 'ping-fail') {
        // * 唤起弹窗
        this.isCheckConnectModalVisible = true

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
    const url = this.dataSource.mockUrl

    if (url === '') {
      // * 唤起弹窗
      this.isOpenSettingModalVisible = true

      return
    }

    const { id: currentWorkspaceID } = this.workspace.currentWorkspace
    if (currentWorkspaceID === -1) {
      return
    }
    const status = this.dataSource.isConnectRemote

    if (!status) {
      // * 唤起弹窗
      this.isCheckConnectModalVisible = true

      return
    }
  }
  handleSyncModalCancel(): void {
    // * 关闭弹窗
    this.isSyncModalVisible = false
  }
  async btn420d2iCallback() {
    // * click event callback

    // * 关闭弹窗
    this.isSyncModalVisible = false
  }
  async btn7q6ifsCallback() {
    // * click event callback
    const eData = await this.workspace.exportProjectData()
    const [data, err]: any = await this.api.api_workspaceUpload(eData)
    if (err) {
      return
    }

    const { workspace } = data
    const { id } = workspace

    const list = this.workspace.getWorkspaceList().filter((it) => it.id !== -1)
    this.workspace.setWorkspaceList([...list, workspace])
    this.workspace.setCurrentWorkspaceID(id)

    // * 关闭弹窗
    this.isSyncModalVisible = false
  }
  handleCheckConnectModalCancel(): void {
    // * 关闭弹窗
    this.isCheckConnectModalVisible = false
  }
  async btn5hq3olCallback() {
    // * click event callback

    // * 关闭弹窗
    this.isCheckConnectModalVisible = false
  }
  async btn835pc7Callback() {
    // * click event callback
    this.dataSource.checkRemoteAndTipModal()

    // * 关闭弹窗
    this.isCheckConnectModalVisible = false
  }
  handleLoginModalCancel(): void {
    // * 关闭弹窗
    this.isLoginModalVisible = false
  }
  async ev61lknCallback() {
    // * nzAfterClose event callback

    // * Clear Username form
    this.validateUsernameForm.reset()
  }
  async btnorcv09Callback() {
    // * click event callback
    const isOk = this.validateUsernameForm.valid

    if (!isOk) {
      this.eMessage.error($localize`Please check you username or password`)
      return
    }

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
    const [list, wErr]: any = await this.api.api_workspaceList({})
    if (wErr) {
      return
    }

    this.workspace.setWorkspaceList(list)

    if (!data.isFirstLogin) {
      return
    }

    // * 唤起弹窗
    this.isSyncModalVisible = true
  }
  handleOpenSettingModalCancel(): void {
    // * 关闭弹窗
    this.isOpenSettingModalVisible = false
  }
  async textgx00o6Callback() {
    // * click event callback
    this.message.send({ type: 'open-setting', data: {} })

    // * 关闭弹窗
    this.isOpenSettingModalVisible = false
  }
  handleAddWorkspaceModalCancel(): void {
    // * 关闭弹窗
    this.isAddWorkspaceModalVisible = false
  }
  async btnujldwiCallback() {
    // * click event callback

    // * 关闭弹窗
    this.isAddWorkspaceModalVisible = false
  }
  async btn36a2xrCallback() {
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
