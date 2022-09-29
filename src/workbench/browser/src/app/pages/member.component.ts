import { Component, OnInit } from '@angular/core';

import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'eo-member',
  template: `<nz-modal
      [nzFooter]="null"
      [(nzVisible)]="isInvateModalVisible"
      (nzOnCancel)="handleInvateModalCancel()"
      (nzAfterClose)="eptulraCallback()"
      nzTitle="Add people to the workspace"
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <input nz-input [(ngModel)]="inputPersonValue" i18n-placeholder placeholder="Search by username" />
        <section class="h-4"></section>
        <button
          nz-button
          class=""
          nzType="primary"
          nzBlock
          (click)="btn94kp1jCallback()"
          [disabled]="btnw0mwsmStatus()"
          i18n
        >
          Select a member above
        </button>
      </ng-container>
    </nz-modal>
    <section class="py-5 px-10">
      <h2 class="text-lg flex justify-between items-center">
        <span i18n>Manage access</span
        ><button nz-button class="" nzType="primary" (click)="btnmwmcqmCallback()" i18n>Add people</button>
      </h2>
      <eo-manage-access></eo-manage-access>
    </section>`,
})
export class MemberComponent implements OnInit {
  isInvateModalVisible;
  inputPersonValue;
  constructor(public modal: NzModalService) {
    this.isInvateModalVisible = false;
    this.inputPersonValue = '';
  }
  ngOnInit(): void {}
  handleInvateModalCancel(): void {
    // * 关闭弹窗
    this.isInvateModalVisible = false;
  }
  async eptulraCallback() {
    // * nzAfterClose event callback
    this.inputPersonValue = '';
  }
  async btn94kp1jCallback() {
    // * click event callback
    const data = this.inputPersonValue;

    console.log(data);
  }
  btnw0mwsmStatus() {
    // * disabled status status
    return this.inputPersonValue === '';
  }
  async btnmwmcqmCallback() {
    // * click event callback

    // * 唤起弹窗
    this.isInvateModalVisible = true;
  }
}
