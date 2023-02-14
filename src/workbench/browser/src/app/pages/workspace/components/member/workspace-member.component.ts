import { Component, OnInit, ViewChild } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { MemberService } from 'eo/workbench/browser/src/app/modules/member-list/member.service';
import { TraceService } from 'eo/workbench/browser/src/app/shared/services/trace.service';
import { makeObservable, observable, reaction } from 'mobx';

import { MemberListComponent } from '../../../../modules/member-list/member-list.component';
import { MessageService } from '../../../../shared/services/message/message.service';
import { StoreService } from '../../../../shared/store/state.service';

@Component({
  selector: 'eo-workspace-member',
  template: `
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
    <nz-list nzItemLayout="horizontal">
      <nz-list-header *ngIf="member.isOwner">
        <eo-ng-select
          class="w-full"
          nzAllowClear
          nzShowSearch
          auto-focus-form
          nzServerSearch
          nzAutoFocus="true"
          [nzOptionHeightPx]="54"
          i18n-nzPlaceHolder
          nzPlaceHolder="Search"
          trace
          traceID="click_add_workspace_member"
          [(ngModel)]="userCache"
          (nzOnSearch)="handleChange($event)"
        >
          <ng-container>
            <eo-ng-option *ngFor="let option of userList" nzCustomContent [nzLabel]="option.userNickName" [nzValue]="option.id">
              <div class="flex w-full justify-between items-center option">
                <div class="flex flex-col justify-between">
                  <span class="font-bold">{{ option.userNickName }}</span>
                  <span class="text-tips">{{ option.email }}</span>
                </div>
                <button eo-ng-button nzType="primary" nzSize="small" i18n (click)="addMember(option)">Add</button>
              </div>
            </eo-ng-option>
          </ng-container>

          <!-- <eo-ng-option *ngIf="isLoading" nzDisabled nzCustomContent>
            <div class="h-10 flex justify-center items-center">
              <nz-spin nzSimple></nz-spin>
            </div>
          </eo-ng-option> -->
        </eo-ng-select>
      </nz-list-header>
    </nz-list>
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
  userCache;
  isLoading = false;
  userList = [];
  constructor(
    public store: StoreService,
    private eMessage: EoNgFeedbackMessageService,
    public member: MemberService,
    private message: MessageService,
    private trace: TraceService
  ) {}
  createWorkspace() {
    this.message.send({ type: 'addWorkspace', data: {} });
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
        console.log('hel');
        const result = await this.member.searchUser(value.trim());
        const memberList = this.memberListRef.list.map(it => it.username);
        this.userList = result.filter(it => !memberList.includes(it.userNickName));
        this.isLoading = false;
        // this.cdk.detectChanges();
      },
      { delay: 300 }
    );
  }
  handleChange(event) {
    this.searchValue = event;
    // if (this.searchValue.includes('t')) {
    //   this.userList = [
    //     {
    //       userNickName: 'test'
    //     }
    //   ];
    // }
  }
  async addMember(items) {
    if (this.store.isLocal) {
      this.eMessage.warning($localize`You can create a cloud workspace and invite members to collaborate.`);
      return;
    }
    const [data, err]: any = await this.member.addMember(items.id);
    if (err) {
      this.eMessage.error($localize`Add member failed`);
      return;
    }
    this.trace.report('add_workspace_member_success');
    this.eMessage.success($localize`Add member successfully`);
    this.userList = [];
    this.userCache = '';
    this.memberListRef.queryList();
  }
}
