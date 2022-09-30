import { Component, OnInit } from '@angular/core'

import { NzModalService } from 'ng-zorro-antd/modal'
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service'
import { WorkspaceService } from 'eo/workbench/browser/src/app/shared/services/workspace/workspace.service'

@Component({
  selector: 'eo-member',
  template: `<nz-modal
      [nzFooter]="null"
      [(nzVisible)]="isInvateModalVisible"
      (nzOnCancel)="handleInvateModalCancel()"
      (nzAfterClose)="eqe4h8mCallback()"
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
          (click)="btn68ca34Callback()"
          [disabled]="btnp0btkjStatus()"
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
          (click)="btnhlq8gsCallback()"
          i18n
        >
          Add people
        </button>
      </h2>
      <section class="py-5">
        <eo-manage-access (remove)="eunbizxCallback($event)"></eo-manage-access>
      </section>
    </section>`
})
export class MemberComponent implements OnInit {
  isInvateModalVisible
  inputPersonValue
  constructor(
    public modal: NzModalService,
    public api: RemoteService,
    public workspace: WorkspaceService
  ) {
    this.isInvateModalVisible = false
    this.inputPersonValue = ''
  }
  async ngOnInit(): Promise<void> {
    const currentWsp = this.workspace.currentWorkspace
    const [data, err]: any = await this.api.api_workspaceMember({
      workspaceID: currentWsp
    })
    if (err) {
      return
    }

    console.log(data)
  }
  handleInvateModalCancel(): void {
    // * 关闭弹窗
    this.isInvateModalVisible = false
  }
  async eqe4h8mCallback() {
    // * nzAfterClose event callback
    this.inputPersonValue = ''
  }
  async btn68ca34Callback() {
    // * click event callback
    const data = this.inputPersonValue

    console.log(data)
  }
  btnp0btkjStatus() {
    // * disabled status status
    return this.inputPersonValue === ''
  }
  async btnhlq8gsCallback() {
    // * click event callback

    // * 唤起弹窗
    this.isInvateModalVisible = true
  }
  async eunbizxCallback($event) {
    // * remove event callback

    console.log($event)
  }
}
