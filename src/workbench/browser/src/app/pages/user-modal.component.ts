import { UserService } from 'eo/workbench/browser/src/app/shared/services/user/user.service'
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service'
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service'
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service'
import { ProjectService } from 'eo/workbench/browser/src/app/shared/services/project/project.service'
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service'
import { distinct } from 'rxjs/operators'
import { interval } from 'rxjs'
import { NzModalService } from 'ng-zorro-antd/modal'
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms'
import { WorkspaceService } from 'eo/workbench/browser/src/app/shared/services/workspace/workspace.service'
import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'eo-user-modal',
  template: ` <nz-modal
      [nzFooter]="modalSyncFooter"
      [(nzVisible)]="isSyncModalVisible"
      (nzOnCancel)="handleSyncModalCancel()"
      (nzAfterClose)="ejv8sdqCallback()"
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
          [nzLoading]="isSyncCancelBtnLoading"
          class=""
          nzType="default"
          (click)="btndpwrflCallback()"
          i18n
        >
          Cancel
        </button>
        <button
          nz-button
          [nzLoading]="isSyncSyncBtnLoading"
          class=""
          nzType="primary"
          (click)="btn3vepqcCallback()"
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
      (nzAfterClose)="e7fdozoCallback()"
      nzTitle="Check your connection"
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <span i18n> Can't connect right now, click to retry or </span>
        <span
          style="color: #1890ff"
          class="cursor-pointer"
          (click)="textyvq7hbCallback()"
          i18n
        >
          config in the configuration
        </span>
      </ng-container>
      <ng-template #modalCheckConnectFooter>
        <button
          nz-button
          [nzLoading]="isCheckConnectCancelBtnLoading"
          class=""
          nzType="default"
          (click)="btndgl191Callback()"
          i18n
        >
          Cancel
        </button>
        <button
          nz-button
          [nzLoading]="isCheckConnectRetryBtnLoading"
          class=""
          nzType="primary"
          (click)="btn8kw00cCallback()"
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
      (nzAfterClose)="eg6oebpCallback()"
      nzTitle="Sign In/Up"
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <section class="my-3">
          <form nz-form [formGroup]="validateLoginForm" nzLayout="horizontal">
            <nz-form-item>
              <nz-form-control nzErrorTip="Please input your email or phone;">
                <input
                  type="text"
                  nz-input
                  formControlName="username"
                  placeholder="Enter Email/Phone/Username"
                  i18n-placeholder
                />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-control [nzErrorTip]="passwordErrorTpl">
                <input
                  type="password"
                  nz-input
                  formControlName="password"
                  placeholder="Enter password"
                  i18n-placeholder
                />
                <ng-template #passwordErrorTpl let-control>
                  <ng-container *ngIf="control.hasError('required')" i18n>
                    Please input your password;
                  </ng-container>

                  <ng-container *ngIf="control.hasError('minlength')" i18n>
                    Min length is 6;
                  </ng-container>
                </ng-template>
              </nz-form-control>
            </nz-form-item>

            <section class="">
              <button
                nz-button
                [nzLoading]="isLoginBtnBtnLoading"
                type="submit"
                class="h-10 mt-2"
                nzType="primary"
                nzBlock
                (click)="btnkus895Callback()"
                i18n
              >
                Sign In/Up
              </button>
            </section>
          </form>
        </section>
      </ng-container>
    </nz-modal>
    <nz-modal
      [nzFooter]="null"
      [(nzVisible)]="isOpenSettingModalVisible"
      (nzOnCancel)="handleOpenSettingModalCancel()"
      (nzAfterClose)="eghx18eCallback()"
      nzTitle="Open setting"
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <span i18n> If you want to collaborate, please </span>
        <span
          style="color: #1890ff"
          class="cursor-pointer"
          (click)="textqeuj9cCallback()"
          i18n
        >
          open the settings
        </span>
        <span i18n> and fill in the configuration </span>
      </ng-container>
    </nz-modal>
    <nz-modal
      [nzFooter]="null"
      [(nzVisible)]="isAddWorkspaceModalVisible"
      (nzOnCancel)="handleAddWorkspaceModalCancel()"
      (nzAfterClose)="ezh9vl9Callback()"
      nzTitle="Add Workspace"
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <form
          nz-form
          [formGroup]="validateWorkspaceNameForm"
          nzLayout="horizontal"
        >
          <nz-form-item>
            <nz-form-control nzErrorTip="Please input your new work name;">
              <input
                type="text"
                nz-input
                formControlName="newWorkName"
                placeholder="Workspace Name"
                i18n-placeholder
              />
            </nz-form-control>
          </nz-form-item>

          <section class="flex justify-end">
            <button
              nz-button
              [nzLoading]="isCancelBtnLoading"
              type="button"
              class="mr-3"
              nzType="default"
              (click)="btni6487uCallback()"
              i18n
            >
              Cancel
            </button>
            <button
              nz-button
              [nzLoading]="isSaveBtnLoading"
              type="submit"
              class=""
              nzType="primary"
              (click)="btn5wngg6Callback()"
              i18n
            >
              Save
            </button>
          </section>
        </form>
      </ng-container>
    </nz-modal>`
})
export class UserModalComponent implements OnInit {
  isSyncModalVisible
  isSyncCancelBtnLoading
  isSyncSyncBtnLoading
  isCheckConnectModalVisible
  isCheckConnectCancelBtnLoading
  isCheckConnectRetryBtnLoading
  isLoginModalVisible
  validateLoginForm
  isLoginBtnBtnLoading
  isOpenSettingModalVisible
  isAddWorkspaceModalVisible
  validateWorkspaceNameForm
  isCancelBtnLoading
  isSaveBtnLoading
  constructor(
    public user: UserService,
    public message: MessageService,
    public api: RemoteService,
    public eMessage: EoMessageService,
    public project: ProjectService,
    public dataSource: DataSourceService,
    public modal: NzModalService,
    public fb: UntypedFormBuilder,
    public workspace: WorkspaceService
  ) {
    this.isSyncModalVisible = false
    this.isSyncCancelBtnLoading = false
    this.isSyncSyncBtnLoading = false
    this.isCheckConnectModalVisible = false
    this.isCheckConnectCancelBtnLoading = false
    this.isCheckConnectRetryBtnLoading = false
    this.isLoginModalVisible = false
    this.validateLoginForm = UntypedFormGroup
    this.isLoginBtnBtnLoading = false
    this.isOpenSettingModalVisible = false
    this.isAddWorkspaceModalVisible = false
    this.validateWorkspaceNameForm = UntypedFormGroup
    this.isCancelBtnLoading = false
    this.isSaveBtnLoading = false
  }
  async ngOnInit(): Promise<void> {
    this.message
      .get()
      .pipe(distinct(({ type }) => type, interval(400)))
      .subscribe(async ({ type, data }) => {
        if (type === 'login') {
          // * 唤起弹窗
          this.isLoginModalVisible = true

          return
        }

        if (type === 'clear-user') {
          this.user.clearAuth()
          this.user.setUserProfile({
            id: -1,
            password: '',
            username: '',
            workspaces: []
          })
          return
        }

        if (type === 'http-401') {
          const { id } = this.workspace.currentWorkspace
          if (id === -1) {
            return
          }

          // * 唤起弹窗
          this.isLoginModalVisible = true

          return
        }

        if (type === 'logOut') {
          this.workspace.setCurrentWorkspaceID(-1)
          this.user.setUserProfile({
            id: -1,
            password: '',
            username: '',
            workspaces: []
          })
          {
            this.workspace.setWorkspaceList([])
          }
          this.workspace.setCurrentWorkspace(
            this.workspace.getLocalWorkspaceInfo()
          )
          this.eMessage.success($localize`Successfully logged out !`)
          const refreshToken = this.user.refreshToken
          this.user.clearAuth()
          {
            const [data, err]: any = await this.api.api_authLogout({
              refreshToken
            })
            if (err) {
              if (err.status === 401) {
                this.message.send({ type: 'clear-user', data: {} })
                if (this.user.isLogin) {
                  return
                }
                this.message.send({ type: 'http-401', data: {} })
              }
              return
            }
          }
          return
        }

        if (type === 'ping-fail') {
          this.eMessage.error($localize`Connect failed`)

          // * 唤起弹窗
          this.isCheckConnectModalVisible = true

          return
        }

        if (type === 'ping-success') {
          this.eMessage.success($localize`Connect success`)
          return
        }

        if (type === 'need-config-remote') {
          // * 唤起弹窗
          this.isOpenSettingModalVisible = true

          return
        }

        if (type === 'addWorkspace') {
          // * 唤起弹窗
          this.isAddWorkspaceModalVisible = true

          return
        }

        if (type === 'retry') {
          // * 唤起弹窗
          this.isCheckConnectModalVisible = true

          return
        }
      })

    // * Init Login form
    this.validateLoginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]]
    })

    // * Init WorkspaceName form
    this.validateWorkspaceNameForm = this.fb.group({
      newWorkName: [null, [Validators.required]]
    })

    const { id: workspaceID } = this.workspace.currentWorkspace
    const [data, err]: any = await this.api.api_workspaceList({})
    if (err) {
      if (err.status === 401) {
        this.message.send({ type: 'clear-user', data: {} })
        if (this.user.isLogin) {
          return
        }
        this.message.send({ type: 'http-401', data: {} })
      }
      return
    }
    this.workspace.setWorkspaceList(data)
    if (workspaceID !== -1) {
      const { projects } = await this.workspace.getWorkspaceInfo(workspaceID)
      this.project.setCurrentProjectID(projects.at(0).uuid)
    }

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
  async ejv8sdqCallback() {
    // * nzAfterClose event callback
    {
    }
  }
  async btndpwrflCallback() {
    // * click event callback
    this.isSyncCancelBtnLoading = true
    const btnSyncCancelRunning = async () => {
      // * 关闭弹窗
      this.isSyncModalVisible = false
    }
    await btnSyncCancelRunning()
    this.isSyncCancelBtnLoading = false
  }
  async btn3vepqcCallback() {
    // * click event callback
    this.isSyncSyncBtnLoading = true
    const btnSyncSyncRunning = async () => {
      const eData = await this.project.exportLocalProjectData()

      const [data, err]: any = await this.api.api_workspaceUpload(eData)
      if (err) {
        if (err.status === 401) {
          this.message.send({ type: 'clear-user', data: {} })
          if (this.user.isLogin) {
            return
          }
          this.message.send({ type: 'http-401', data: {} })
        }
        return
      }
      const { workspace } = data
      const list = this.workspace
        .getWorkspaceList()
        .filter((it) => it.id !== -1)
      this.workspace.setWorkspaceList([...list, workspace])
      this.workspace.setCurrentWorkspaceID(workspace)

      // * 关闭弹窗
      this.isSyncModalVisible = false
    }
    await btnSyncSyncRunning()
    this.isSyncSyncBtnLoading = false
  }
  handleCheckConnectModalCancel(): void {
    // * 关闭弹窗
    this.isCheckConnectModalVisible = false
  }
  async e7fdozoCallback() {
    // * nzAfterClose event callback
    {
    }
  }
  async btndgl191Callback() {
    // * click event callback
    this.isCheckConnectCancelBtnLoading = true
    const btnCheckConnectCancelRunning = async () => {
      // * 关闭弹窗
      this.isCheckConnectModalVisible = false
    }
    await btnCheckConnectCancelRunning()
    this.isCheckConnectCancelBtnLoading = false
  }
  async btn8kw00cCallback() {
    // * click event callback
    this.isCheckConnectRetryBtnLoading = true
    const btnCheckConnectRetryRunning = async () => {
      this.dataSource.checkRemoteAndTipModal()

      // * 关闭弹窗
      this.isCheckConnectModalVisible = false
    }
    await btnCheckConnectRetryRunning()
    this.isCheckConnectRetryBtnLoading = false
  }
  async textyvq7hbCallback() {
    // * click event callback

    // * 关闭弹窗
    this.isOpenSettingModalVisible = false
  }
  handleLoginModalCancel(): void {
    // * 关闭弹窗
    this.isLoginModalVisible = false
  }
  async eg6oebpCallback() {
    // * nzAfterClose event callback
    {
      // * auto clear form
      this.validateLoginForm.reset()
    }
  }
  async btnkus895Callback() {
    // * click event callback
    this.isLoginBtnBtnLoading = true
    const btnLoginBtnRunning = async () => {
      const isOk = this.validateLoginForm.valid

      if (!isOk) {
        this.eMessage.error($localize`Please check you username or password`)
        return
      }

      // * get login form values
      const formData = this.validateLoginForm.value
      const [data, err]: any = await this.api.api_authLogin(formData)
      if (err) {
        this.eMessage.error($localize`Authentication failed !`)
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

      // * 关闭弹窗
      this.isLoginModalVisible = false

      {
        const [data, err]: any = await this.api.api_userReadProfile(null)
        if (err) {
          if (err.status === 401) {
            this.message.send({ type: 'clear-user', data: {} })
            if (this.user.isLogin) {
              return
            }
            this.message.send({ type: 'http-401', data: {} })
          }
          return
        }
        this.user.setUserProfile(data)
      }
      {
        const [data, err]: any = await this.api.api_workspaceList({})
        if (err) {
          if (err.status === 401) {
            this.message.send({ type: 'clear-user', data: {} })
            if (this.user.isLogin) {
              return
            }
            this.message.send({ type: 'http-401', data: {} })
          }
          return
        }
        this.workspace.setWorkspaceList(data)
      }

      if (!data.isFirstLogin) {
        return
      }

      // * 唤起弹窗
      this.isSyncModalVisible = true
    }
    await btnLoginBtnRunning()
    this.isLoginBtnBtnLoading = false
  }
  handleOpenSettingModalCancel(): void {
    // * 关闭弹窗
    this.isOpenSettingModalVisible = false
  }
  async eghx18eCallback() {
    // * nzAfterClose event callback
    {
    }
  }
  async textqeuj9cCallback() {
    // * click event callback
    this.message.send({ type: 'open-setting', data: {} })

    // * 关闭弹窗
    this.isOpenSettingModalVisible = false
  }
  handleAddWorkspaceModalCancel(): void {
    // * 关闭弹窗
    this.isAddWorkspaceModalVisible = false
  }
  async ezh9vl9Callback() {
    // * nzAfterClose event callback
    {
      // * auto clear form
      this.validateWorkspaceNameForm.reset()
    }
  }
  async btni6487uCallback() {
    // * click event callback
    this.isCancelBtnLoading = true
    const btnCancelRunning = async () => {
      this.isCancelBtnLoading = true
      const btnCancelRunning = async () => {
        // * 关闭弹窗
        this.isAddWorkspaceModalVisible = false
      }
      await btnCancelRunning()
      this.isCancelBtnLoading = false
    }
    await btnCancelRunning()
    this.isCancelBtnLoading = false
  }
  async btn5wngg6Callback() {
    // * click event callback
    this.isSaveBtnLoading = true
    const btnSaveRunning = async () => {
      this.isSaveBtnLoading = true
      const btnSaveRunning = async () => {
        const { newWorkName: title } = this.validateWorkspaceNameForm.value
        {
          const [data, err]: any = await this.api.api_workspaceCreate({ title })
          if (err) {
            this.eMessage.error($localize`Add workspace Failed !`)
            if (err.status === 401) {
              this.message.send({ type: 'clear-user', data: {} })
              if (this.user.isLogin) {
                return
              }
              this.message.send({ type: 'http-401', data: {} })
            }
            return
          }
        }
        this.eMessage.success($localize`Create new workspace successfully !`)

        // * 关闭弹窗
        this.isAddWorkspaceModalVisible = false

        {
          const [data, err]: any = await this.api.api_workspaceList({})
          if (err) {
            if (err.status === 401) {
              this.message.send({ type: 'clear-user', data: {} })
              if (this.user.isLogin) {
                return
              }
              this.message.send({ type: 'http-401', data: {} })
            }
            return
          }
          this.workspace.setWorkspaceList(data)
        }
      }
      await btnSaveRunning()
      this.isSaveBtnLoading = false
    }
    await btnSaveRunning()
    this.isSaveBtnLoading = false
  }
}
