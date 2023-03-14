import { Component, OnInit, ViewChild } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { observable, makeObservable, computed, reaction } from 'mobx';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MemberService } from 'pc/browser/src/app/components/member-list/member.service';
import { DataSourceService } from 'pc/browser/src/app/services/data-source/data-source.service';
import { MessageService } from 'pc/browser/src/app/services/message/message.service';
import { ApiService } from 'pc/browser/src/app/services/storage/api.service';
import { TraceService } from 'pc/browser/src/app/services/trace.service';
import { StoreService } from 'pc/browser/src/app/store/state.service';

import { MemberListComponent } from '../../../../components/member-list/member-list.component';

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
          nzServerSearch
          nzPlaceholder="Search"
          [(ngModel)]="userCache"
          nzMode="multiple"
          (nzOnSearch)="handleChange($event)"
        >
          <!-- <div *ngIf="isLoading" class="h-10 flex justify-center items-center">
            <nz-spin nzSimple></nz-spin>
          </div> -->
          <ng-container>
            <eo-ng-option *ngFor="let option of userList" nzCustomContent [nzLabel]="option.email" [nzValue]="option.id">
              <div class="flex w-full justify-between items-center">
                <span class="font-bold">{{ option.username }}</span>
                <span class="text-tips">{{ option.email }}</span>
              </div>
            </eo-ng-option>
          </ng-container>
        </eo-ng-select>
        <section class="h-4"></section>
        <button
          eo-ng-button
          [nzLoading]="isSelectBtnLoading"
          nzType="primary"
          nzBlock
          (click)="btn0r9zcbCallback()"
          [disabled]="btnguixdgStatus()"
          trace
          traceID="click_project_add_member"
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
              >new a cloud workspace</button
            >and invite members to collaborate.</p
          ></ng-template
        >
        <eo-member-list class="block mt-[10px]" #memberList></eo-member-list>
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
  isLoading = false;
  constructor(
    public modal: NzModalService,
    public store: StoreService,
    public message: MessageService,
    public api: ApiService,
    public eMessage: EoNgFeedbackMessageService,
    public dataSource: DataSourceService,
    private member: MemberService,
    private trace: TraceService
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
        this.isLoading = true;
        const result = await this.member.searchUser(value);
        const memberList = this.memberListRef.list.map(it => it.username);
        this.userList = result.filter(it => !memberList.includes(it.userName));
        this.isLoading = false;
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
        this.eMessage.error($localize`Add member failed`);
        return;
      }
      this.trace.report('project_add_member_success');
      this.eMessage.success($localize`Add member successfully`);

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
