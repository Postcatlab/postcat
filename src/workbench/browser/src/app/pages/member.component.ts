import { Component, OnInit } from '@angular/core'

import { NzModalService } from 'ng-zorro-antd/modal'

@Component({
  selector: 'eo-member',
  template: `<nz-modal
      [nzFooter]="null"
      [(nzVisible)]="isInvateModalVisible"
      (nzOnCancel)="handleInvateModalCancel()"
      nzTitle="Add people to the space"
    >
      <ng-container *nzModalContent>
        <input
          nz-input
          [(ngModel)]="inputPersonValue"
          placeholder="Search by username"
        />
        <section class="h-4"></section>
        <button
          nz-button
          [disabled]="isselectDisabled()"
          nzType="primary"
          nzBlock
          (click)="btncdtxytCallback()"
          i18n
        >
          Select a member above
        </button>
      </ng-container>
    </nz-modal>
    <section class="py-5 px-10">
      <h2 class="text-lg flex justify-between items-center">
        <span i18n>Manage access</span
        ><button nz-button nzType="primary" (click)="btn5t21ozCallback()" i18n>
          Add people
        </button>
      </h2>
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
  handleInvateModalCancel() {
    // * 关闭弹窗
    this.isInvateModalVisible = false
  }
  isselectDisabled() {
    return this.inputPersonValue === ''
  }
  async btncdtxytCallback() {
    const data = this.inputPersonValue
    {
      console.log(data)
    }
  }
  async btn5t21ozCallback() {
    // * 唤起弹窗
    this.isInvateModalVisible = true
  }
}
