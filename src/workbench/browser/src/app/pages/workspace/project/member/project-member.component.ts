import { Component, OnInit, ViewChild } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { observable, makeObservable, computed, reaction } from 'mobx';
import { NzModalService } from 'ng-zorro-antd/modal';

import { MemberListComponent } from '../../../../modules/member-list/member-list.component';
import { MemberService } from '../../../../modules/member-list/member.service';
import { MEMBER_MUI } from '../../../../shared/models/member.model';

@Component({
  selector: 'eo-project-member',
  template: `<nz-modal
      [nzFooter]="null"
      [(nzVisible)]="isInvateModalVisible"
      (nzOnCancel)="handleInvateModalCancel()"
      (nzAfterClose)="ehe4islCallback()"
      nzTitle="Add Member To Project"
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <eo-ng-select
          class="w-full"
          nzAllowClear
          auto-focus-form
          nzShowSearch
          i18n-nzPlaceholder
          nzPlaceholder="Search"
          [(ngModel)]="userCache"
          nzMode="multiple"
          (nzOnSearch)="handleChange($event)"
        >
          <eo-ng-option *ngFor="let option of userList" nzCustomContent [nzLabel]="option.username" [nzValue]="option.id">
            <div class="flex w-full justify-between">
              <span class="font-bold">{{ option.username }}</span>
              <span class="text-tips">{{ option.email }}</span>
            </div>
          </eo-ng-option>
        </eo-ng-select>
        <section class="h-4"></section>
        <button
          eo-ng-button
          [nzLoading]="isSelectBtnLoading"
          nzType="primary"
          nzBlock
          (click)="btn0r9zcbCallback()"
          [disabled]="btnguixdgStatus()"
          i18n
        >
          Add
        </button>
      </ng-container>
    </nz-modal>

    <section class="py-5 px-10 w-6/12 m-auto">
      <h2 class="text-lg flex justify-between items-center">
        <span class="font-bold" i18n>Project Members</span
        ><button *ngIf="!store.isLocal" eo-ng-button [nzLoading]="isAddPeopleBtnLoading" nzType="primary" (click)="btnf5umnoCallback()">
          <eo-iconpark-icon name="add" class="mr-[5px]"></eo-iconpark-icon><span i18n>Add</span>
        </button>
      </h2>
      <section class="py-5">
        <eo-ng-feedback-alert
          *ngIf="store.isLocal"
          class="block mb-[20px]"
          nzType="info"
          [nzMessage]="templateRefMsg"
          nzShowIcon
        ></eo-ng-feedback-alert>
        <ng-template #templateRefMsg>
          <p i18n>Currently using local workspace, unable to invite members. </p>
          <p class="flex items-center" i18n
            >You can<button eo-ng-button nzType="default" class="mx-[5px]" nzSize="small" (click)="createWorkspace()"
              >create a cloud workspace</button
            >and invite members to collaborate.</p
          ></ng-template
        >
        <eo-member-list class="block mt-[10px]" #memberList></eo-member-list> ,
      </section>
    </section>`
})
export class ProjectMemberComponent implements OnInit {
  @ViewChild('memberList') memberListRef: MemberListComponent;
  @observable searchValue = '';
  userCache;
  isInvateModalVisible;
  isSelectBtnLoading;
  isAddPeopleBtnLoading;
  userList = [];
  roleMUI = MEMBER_MUI;
  constructor(
    public modal: NzModalService,
    public store: StoreService,
    public message: MessageService,
    public api: RemoteService,
    public eMessage: EoNgFeedbackMessageService,
    public dataSource: DataSourceService,
    private member: MemberService
  ) {
    this.isInvateModalVisible = false;
    this.isSelectBtnLoading = false;
    this.isAddPeopleBtnLoading = false;
    this.userCache = [];
  }
  async ngOnInit(): Promise<void> {
    makeObservable(this);
    reaction(
      () => this.searchValue,
      async value => {
        if (value.trim() === '') {
          return;
        }
        const result = await this.member.searchUser(value);
        const memberList = this.memberListRef.list.map(it => it.username);
        this.userList = result.filter(it => {
          return !memberList.includes(it.username);
        });
      },
      { delay: 300 }
    );
  }
  createWorkspace() {
    this.dataSource.checkRemoteCanOperate(() => {
      this.message.send({ type: 'addWorkspace', data: {} });
    });
  }
  handleChange(event) {
    this.searchValue = event;
  }
  handleInvateModalCancel(): void {
    // * 关闭弹窗
    this.isInvateModalVisible = false;
  }
  async ehe4islCallback() {
    // * nzAfterClose event callback
    this.userCache = [];
  }
  async btn0r9zcbCallback() {
    // * click event callback
    this.isSelectBtnLoading = true;
    const btnSelectRunning = async () => {
      const userIds = this.userCache;
      if (userIds.length === 0) {
        this.eMessage.error($localize`Please select a member`);
        return;
      }

      const [aData, aErr]: any = await this.member.addMember(userIds);
      if (aErr) {
        return;
      }
      this.eMessage.success($localize`Add new member success`);

      // * 关闭弹窗
      this.isInvateModalVisible = false;

      this.memberListRef.queryList();
    };
    await btnSelectRunning();
    this.isSelectBtnLoading = false;
  }
  btnguixdgStatus() {
    // * disabled status status
    return this.userCache.length === 0;
  }
  async btnf5umnoCallback() {
    // * click event callback
    // * 点击 Add People 按钮后的函数
    this.isAddPeopleBtnLoading = true;
    const btnAddPeopleRunning = async () => {
      // * 唤起弹窗
      this.isInvateModalVisible = true;
      this.userCache = [];
    };
    await btnAddPeopleRunning();
    this.isAddPeopleBtnLoading = false;
  }
}
