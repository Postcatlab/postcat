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
          (click)="btndym1alCallback()"
          i18n
        >
          Cancel
        </button>
        <button
          nz-button
          class=""
          nzType="primary"
          (click)="btnobcnblCallback()"
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
        <span i18n> Can't connect right now, click to retry or </span>
        <span style="color: #1890ff" (click)="textx6e63wCallback()" i18n>
          config in the configuration
        </span>
      </ng-container>
      <ng-template #modalCheckConnectFooter>
        <button
          nz-button
          class=""
          nzType="default"
          (click)="btnev86beCallback()"
          i18n
        >
          Cancel
        </button>
        <button
          nz-button
          class=""
          nzType="primary"
          (click)="btnuft0cqCallback()"
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
      (nzAfterClose)="e5l5t29Callback()"
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

            <button
              nz-button
              type="submit"
              class="h-10 mt-2"
              nzType="primary"
              nzBlock
              (click)="btnmympi6Callback()"
              i18n
            >
              Sign In/Up
            </button>
          </form>
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
        <span style="color: #1890ff" (click)="textkmcrwvCallback()" i18n>
          open the settings
        </span>
        <span i18n> and fill in the configuration </span>
      </ng-container>
    </nz-modal>
    <nz-modal
      [nzFooter]="modalAddWorkspaceFooter"
      [(nzVisible)]="isAddWorkspaceModalVisible"
      (nzOnCancel)="handleAddWorkspaceModalCancel()"
      (nzAfterClose)="ehr6ppmCallback()"
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
          (click)="btn2op86eCallback()"
          i18n
        >
          Cancel
        </button>
        <button
          nz-button
          class=""
          nzType="primary"
          (click)="btnv0jv0tCallback()"
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
  validateLoginForm
  isOpenSettingModalVisible
  isAddWorkspaceModalVisible
  inputWorkspaceNameValue
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
    this.isCheckConnectModalVisible = false
    this.isLoginModalVisible = false
    this.validateLoginForm = UntypedFormGroup
    this.isOpenSettingModalVisible = false
    this.isAddWorkspaceModalVisible = false
    this.inputWorkspaceNameValue = ''
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
  async btndym1alCallback() {
    // * click event callback

    // * 关闭弹窗
    this.isSyncModalVisible = false
  }
  async btnobcnblCallback() {
    // * click event callback

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

    const list = this.workspace.getWorkspaceList().filter((it) => it.id !== -1)
    this.workspace.setWorkspaceList([...list, workspace])
    this.workspace.setCurrentWorkspaceID(workspace)

    // * 关闭弹窗
    this.isSyncModalVisible = false
  }
  handleCheckConnectModalCancel(): void {
    // * 关闭弹窗
    this.isCheckConnectModalVisible = false
  }
  async btnev86beCallback() {
    // * click event callback

    // * 关闭弹窗
    this.isCheckConnectModalVisible = false
  }
  async btnuft0cqCallback() {
    // * click event callback
    this.dataSource.checkRemoteAndTipModal()

    // * 关闭弹窗
    this.isCheckConnectModalVisible = false
  }
  async textx6e63wCallback() {
    // * click event callback

    // * 关闭弹窗
    this.isOpenSettingModalVisible = false
  }
  handleLoginModalCancel(): void {
    // * 关闭弹窗
    this.isLoginModalVisible = false
  }
  async e5l5t29Callback() {
    // * nzAfterClose event callback

    // * Clear Login form
    this.validateLoginForm.reset()
  }
  async btnmympi6Callback() {
    // * click event callback
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
  handleOpenSettingModalCancel(): void {
    // * 关闭弹窗
    this.isOpenSettingModalVisible = false
  }
  async textkmcrwvCallback() {
    // * click event callback
    this.message.send({ type: 'open-setting', data: {} })

    // * 关闭弹窗
    this.isOpenSettingModalVisible = false
  }
  handleAddWorkspaceModalCancel(): void {
    // * 关闭弹窗
    this.isAddWorkspaceModalVisible = false
  }
  async ehr6ppmCallback() {
    // * nzAfterClose event callback
    this.inputWorkspaceNameValue = ''
  }
  async btn2op86eCallback() {
    // * click event callback

    // * 关闭弹窗
    this.isAddWorkspaceModalVisible = false

    this.inputWorkspaceNameValue = ''
  }
  async btnv0jv0tCallback() {
    // * click event callback
    const title = this.inputWorkspaceNameValue
    {
      const [data, err]: any = await this.api.api_workspaceCreate({ title })
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
    this.eMessage.success($localize`Create new workspace successfully !`)

    // * 关闭弹窗
    this.isAddWorkspaceModalVisible = false

    this.inputWorkspaceNameValue = ''
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
}
