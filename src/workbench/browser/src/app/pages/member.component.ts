import { Component, OnInit } from '@angular/core'

import { NzModalService } from 'ng-zorro-antd/modal'

@Component({
  selector: 'eo-member',
  template: `<nz-modal
      [nzFooter]="null"
      [(nzVisible)]="isInvateModalVisible"
      (nzOnCancel)="handleInvateModalCancel()"
      (nzAfterClose)="e0looquCallback()"
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
          (click)="btnb7u6zsCallback()"
          [disabled]="btnz0qxgzStatus()"
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
          (click)="btnzi0yqtCallback()"
          i18n
        >
          Add people
        </button>
      </h2>
      <section class="py-5">
        <eo-manage-access (remove)="e6v4937Callback($event)"></eo-manage-access>
      </section>
    </section>`
})
export class MemberComponent implements OnInit {
  isInvateModalVisible
  inputPersonValue
  constructor(public modal: NzModalService) {
    this.isInvateModalVisible = false
    this.inputPersonValue = ''
  }
  ngOnInit(): void {}
  handleInvateModalCancel(): void {
    // * 关闭弹窗
    this.isInvateModalVisible = false
  }
  async e0looquCallback() {
    // * nzAfterClose event callback
    this.inputPersonValue = ''
  }
  async btnb7u6zsCallback() {
    // * click event callback
    const data = this.inputPersonValue

    console.log(data)
  }
  btnz0qxgzStatus() {
    // * disabled status status
    return this.inputPersonValue === ''
  }
  async btnzi0yqtCallback() {
    // * click event callback

    // * 唤起弹窗
    this.isInvateModalVisible = true
  }
  async e6v4937Callback($event) {
    // * remove event callback

    console.log($event)
  }
}
