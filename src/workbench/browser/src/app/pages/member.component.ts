import { NzModalService } from 'ng-zorro-antd/modal'
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service'
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service'
import { WorkspaceService } from 'eo/workbench/browser/src/app/shared/services/workspace/workspace.service'
import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'eo-member',
  template: `<nz-modal
      [nzFooter]="null"
      [(nzVisible)]="isInvateModalVisible"
      (nzOnCancel)="handleInvateModalCancel()"
      (nzAfterClose)="ewxdh8jCallback()"
      nzTitle="Add people to the workspace"
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <input
          nz-input
          [(ngModel)]="inputPersonValue"
          i18n-placeholder
          placeholder="Search by username"
        />
        <section class="h-4"></section>
        <button
          nz-button
          class=""
          nzType="primary"
          nzBlock
          (click)="btnqaqgtnCallback()"
          [disabled]="btnl2scmmStatus()"
          i18n
        >
          Select a member above
        </button>
      </ng-container>
    </nz-modal>
    <section class="py-5 px-10">
      <h2 class="text-lg flex justify-between items-center">
        <span i18n>Manage access</span
        ><button
          nz-button
          class=""
          nzType="primary"
          (click)="btn4f8m3iCallback()"
          i18n
        >
          Add people
        </button>
      </h2>
      <section class="py-5">
        <eo-manage-access
          [data]="memberList"
          (eoOnRemove)="eh1mkzjCallback($event)"
        ></eo-manage-access>
      </section>
    </section>`
})
export class MemberComponent implements OnInit {
  isInvateModalVisible
  inputPersonValue
  memberList
  constructor(
    public modal: NzModalService,
    public api: RemoteService,
    public eMessage: EoMessageService,
    public workspace: WorkspaceService
  ) {
    this.isInvateModalVisible = false
    this.inputPersonValue = ''
    this.memberList = []
  }
  async ngOnInit(): Promise<void> {
    const { id: currentWorkspaceID } = this.workspace.currentWorkspace
    const [wData, wErr]: any = await this.api.api_workspaceMember({
      workspaceID: currentWorkspaceID
    })
    if (wErr) {
      return
    }

    // * 对成员列表进行排序
    const Owner = wData.filter((it) => it.roleName === 'Owner')
    const Member = wData.filter((it) => it.roleName !== 'Owner')
    this.memberList = Owner.concat(Member)
  }
  handleInvateModalCancel(): void {
    // * 关闭弹窗
    this.isInvateModalVisible = false
  }
  async ewxdh8jCallback() {
    // * nzAfterClose event callback
    this.inputPersonValue = ''
  }
  async btnqaqgtnCallback() {
    // * click event callback
    const username = this.inputPersonValue
    const [uData, uErr]: any = await this.api.api_userSearch({ username })
    if (uErr) {
      return
    }

    if (uData.length === 0) {
      this.eMessage.error($localize`Could not find a user matching ${username}`)
      return
    }
    const [user] = uData
    const { id } = user

    const { id: workspaceID } = this.workspace.currentWorkspace
    const [aData, aErr]: any = await this.api.api_workspaceAddMember({
      workspaceID,
      userIDs: [id]
    })
    if (aErr) {
      return
    }

    this.eMessage.success($localize`Add new member success`)

    // * 关闭弹窗
    this.isInvateModalVisible = false

    const { id: currentWorkspaceID } = this.workspace.currentWorkspace
    const [wData, wErr]: any = await this.api.api_workspaceMember({
      workspaceID: currentWorkspaceID
    })
    if (wErr) {
      return
    }

    // * 对成员列表进行排序
    const Owner = wData.filter((it) => it.roleName === 'Owner')
    const Member = wData.filter((it) => it.roleName !== 'Owner')
    this.memberList = Owner.concat(Member)
  }
  btnl2scmmStatus() {
    // * disabled status status
    return this.inputPersonValue === ''
  }
  async btn4f8m3iCallback() {
    // * click event callback

    // * 唤起弹窗
    this.isInvateModalVisible = true
  }
  async eh1mkzjCallback($event) {
    // * eoOnRemove event callback

    const confirm = () =>
      new Promise((resolve) => {
        this.modal.confirm({
          nzTitle: $localize`Warning`,
          nzContent: $localize`Are you sure you want to remove the member ?`,
          nzOkDanger: true,
          nzOkText: $localize`Delete`,
          nzOnOk: () => resolve(true),
          nzOnCancel: () => resolve(false)
        })
      })
    const isOk = await confirm()
    if (!isOk) {
      return
    }

    const { id: workspaceID } = this.workspace.currentWorkspace

    const { id } = $event

    const [data, err]: any = await this.api.api_workspaceRemoveMember({
      workspaceID,
      userIDs: [id]
    })
    if (err) {
      return
    }

    const { id: currentWorkspaceID } = this.workspace.currentWorkspace
    const [wData, wErr]: any = await this.api.api_workspaceMember({
      workspaceID: currentWorkspaceID
    })
    if (wErr) {
      return
    }

    // * 对成员列表进行排序
    const Owner = wData.filter((it) => it.roleName === 'Owner')
    const Member = wData.filter((it) => it.roleName !== 'Owner')
    this.memberList = Owner.concat(Member)
  }
}
