import { Component, OnInit, ViewChild } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { makeObservable, observable, action, reaction } from 'mobx';
import { MemberService } from 'pc/browser/src/app/components/member-list/member.service';
import { DataSourceService } from 'pc/browser/src/app/services/data-source/data-source.service';
import { TraceService } from 'pc/browser/src/app/services/trace.service';

import { MemberListComponent } from '../../../../components/member-list/member-list.component';
import { MessageService } from '../../../../services/message/message.service';
import { StoreService } from '../../../../store/state.service';

@Component({
  selector: 'eo-workspace-member',
  template: `
    <nz-modal
      [nzFooter]="null"
      [(nzVisible)]="isInvateModalVisible"
      (nzOnCancel)="handleInvateModalCancel()"
      (nzAfterClose)="ehe4islCallback()"
      nzTitle="Add Member To Workspace"
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
                <span class="font-bold">{{ option.userNickName }}</span>
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
          [disabled]="userCache?.length === 0"
          i18n
        >
          Add
        </button>
      </ng-container>
    </nz-modal>
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
  `,
  styles: [
    `
      .ant-list-split .ant-list-header {
        border: none;
        padding-top: 0;
      }
    `
  ]
})
export class WorkspaceMemberComponent implements OnInit {
  @ViewChild('memberList') memberListRef: MemberListComponent;
  @observable searchValue = '';
  userCache = [];
  isLoading = false;
  userList = [];
  isSelectBtnLoading = false;
  isInvateModalVisible = false;
  constructor(
    public store: StoreService,
    private eMessage: EoNgFeedbackMessageService,
    public member: MemberService,
    private message: MessageService,
    private trace: TraceService,
    private dataSource: DataSourceService
  ) {}
  createWorkspace() {
    this.dataSource.checkRemoteCanOperate(() => {
      this.message.send({ type: 'addWorkspace', data: {} });
    });
  }
  ngOnInit(): void {
    makeObservable(this);
    reaction(
      () => this.searchValue,
      async value => {
        if (value.trim() === '') {
          return;
        }
        this.isLoading = true;
        const result = await this.member.searchUser(value.trim());
        const memberList = this.memberListRef.list.map(it => it.username);
        this.userList = result.filter(it => !memberList.includes(it.userNickName));
        console.log('memberList', this.userList);
        this.isLoading = false;
        // this.cdk.detectChanges();
      },
      { delay: 300 }
    );
    this.message.get().subscribe(({ data, type }) => {
      if (type === 'addWorkspaceMember') {
        this.isInvateModalVisible = true;
      }
    });
  }
  handleChange(event) {
    this.SetSearchValue(event);
  }
  @action SetSearchValue(data) {
    this.searchValue = data;
  }
  handleInvateModalCancel(): void {
    // * 关闭弹窗
    this.isInvateModalVisible = false;
  }
  ehe4islCallback() {
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
      this.trace.report('add_workspace_member_success');
      this.eMessage.success($localize`Add member successfully`);

      // * 关闭弹窗
      this.isInvateModalVisible = false;

      this.memberListRef.queryList();
    };
    await btnSelectRunning();
    this.isSelectBtnLoading = false;
  }
}
