import { Component, OnInit } from '@angular/core'

import { NzModalService } from 'ng-zorro-antd/modal'

@Component({
  selector: 'eo-member',
  template: `<nz-modal
      [nzFooter]="null"
      [(nzVisible)]="isInvateModalVisible"
      (nzOnCancel)="handleInvateModalCancel()"
      (nzAfterClose)="edmdkfaCallback()"
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
          (click)="btnpsmsq2Callback()"
          [disabled]="btne0qn16Status()"
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
          (click)="btndhw8qnCallback()"
          i18n
        >
          Add people
        </button>
      </h2>
      <section class="py-5">
        <eo-manage-access (remove)="epypczqCallback($event)"></eo-manage-access>
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
  async edmdkfaCallback() {
    // * nzAfterClose event callback
    this.inputPersonValue = ''
  }
  async btnpsmsq2Callback() {
    // * click event callback
    const data = this.inputPersonValue

    console.log(data)
  }
  btne0qn16Status() {
    // * disabled status status
    return this.inputPersonValue === ''
  }
  async btndhw8qnCallback() {
    // * click event callback

    // * 唤起弹窗
    this.isInvateModalVisible = true
  }
  async epypczqCallback($event) {
    // * remove event callback

    console.log($event)
  }
}
