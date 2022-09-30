import { Component, OnInit } from '@angular/core'

import { NzModalService } from 'ng-zorro-antd/modal'

@Component({
  selector: 'eo-member',
  template: `<nz-modal
      [nzFooter]="null"
      [(nzVisible)]="isInvateModalVisible"
      (nzOnCancel)="handleInvateModalCancel()"
      (nzAfterClose)="e9uo9arCallback()"
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
          (click)="btn3e9lkaCallback()"
          [disabled]="btnscf988Status()"
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
          (click)="btnghh435Callback()"
          i18n
        >
          Add people
        </button>
      </h2>
      <section class="py-5">
        <eo-manage-access (remove)="ezgqxcoCallback($event)"></eo-manage-access>
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
  async e9uo9arCallback() {
    // * nzAfterClose event callback
    this.inputPersonValue = ''
  }
  async btn3e9lkaCallback() {
    // * click event callback
    const data = this.inputPersonValue

    console.log(data)
  }
  btnscf988Status() {
    // * disabled status status
    return this.inputPersonValue === ''
  }
  async btnghh435Callback() {
    // * click event callback

    // * 唤起弹窗
    this.isInvateModalVisible = true
  }
  async ezgqxcoCallback($event) {
    // * remove event callback

    console.log($event)
  }
}
