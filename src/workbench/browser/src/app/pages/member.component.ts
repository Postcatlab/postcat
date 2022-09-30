import { Component, OnInit } from '@angular/core'

import { NzModalService } from 'ng-zorro-antd/modal'
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service'
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service'
import { WorkspaceService } from 'eo/workbench/browser/src/app/shared/services/workspace/workspace.service'

@Component({
  selector: 'eo-member',
  template: `<nz-modal
      [nzFooter]="null"
      [(nzVisible)]="isInvateModalVisible"
      (nzOnCancel)="handleInvateModalCancel()"
      (nzAfterClose)="e7pa3cnCallback()"
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
          (click)="btnt1w7sdCallback()"
          [disabled]="btn7dyiksStatus()"
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
          (click)="btnfemxadCallback()"
          i18n
        >
          Add people
        </button>
      </h2>
      <section class="py-5">
        <eo-manage-access
          [data]="memberList"
          (eoOnRemove)="eiyuienCallback($event)"
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

    this.workspace.setWorkspaceList(wData)
    this.memberList = wData
  }
  handleInvateModalCancel(): void {
    // * 关闭弹窗
    this.isInvateModalVisible = false
  }
  async e7pa3cnCallback() {
    // * nzAfterClose event callback
    this.inputPersonValue = ''
  }
  async btnt1w7sdCallback() {
    // * click event callback
    const data = this.inputPersonValue
    const { id: workspaceID } = this.workspace.currentWorkspace
    const [aData, aErr]: any = await this.api.api_workspaceAddMember({
      workspaceID,
      userIDs: [data]
    })
    if (aErr) {
      return
    }

    this.eMessage.success(`Add new member success`)

    // * 关闭弹窗
    this.isInvateModalVisible = false

    const { id: currentWorkspaceID } = this.workspace.currentWorkspace
    const [wData, wErr]: any = await this.api.api_workspaceMember({
      workspaceID: currentWorkspaceID
    })
    if (wErr) {
      return
    }

    this.workspace.setWorkspaceList(wData)
    this.memberList = wData
  }
  btn7dyiksStatus() {
    // * disabled status status
    return this.inputPersonValue === ''
  }
  async btnfemxadCallback() {
    // * click event callback

    // * 唤起弹窗
    this.isInvateModalVisible = true
  }
  async eiyuienCallback($event) {
    // * eoOnRemove event callback

    const confirm = () =>
      new Promise((resolve) => {
        this.modal.confirm({
          nzTitle: `Warning`,
          nzContent: `Are you sure you want to remove the menmber ?`,
          nzOkDanger: true,
          nzOkText: 'Delete',
          nzOnOk: () => resolve(true),
          nzOnCancel: () => resolve(false)
        })
      })
    const isOk = await confirm()
    if (!isOk) {
      return
    }

    const workspaceID = this.workspace.currentWorkspace
    const [data, err]: any = await this.api.api_workspaceRemoveMember({
      workspaceID,
      userIDs: []
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

    this.workspace.setWorkspaceList(wData)
    this.memberList = wData
  }
}
