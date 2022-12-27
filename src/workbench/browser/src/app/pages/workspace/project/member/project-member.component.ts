import { Component, OnInit } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { observable, makeObservable, computed, reaction } from 'mobx';
import { NzModalService } from 'ng-zorro-antd/modal';

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
        ><button eo-ng-button [nzLoading]="isAddPeopleBtnLoading" nzType="primary" (click)="btnf5umnoCallback()">
          <eo-iconpark-icon name="add" class="mr-[5px]"></eo-iconpark-icon><span i18n>Add</span>
        </button>
      </h2>
      <section class="py-5">
        <eo-manage-access [list]="memberList" (eoOnChange)="e97uoiuCallback($event)"></eo-manage-access>
      </section>
    </section>`
})
export class ProjectMemberComponent implements OnInit {
  @observable searchValue = '';
  userCache;
  isInvateModalVisible;
  isSelectBtnLoading;
  isAddPeopleBtnLoading;
  memberList;
  userList = [];
  roleMUI = MEMBER_MUI;
  constructor(
    public modal: NzModalService,
    public store: StoreService,
    public message: MessageService,
    public api: RemoteService,
    public eMessage: EoNgFeedbackMessageService,
    public dataSource: DataSourceService,
    private http: RemoteService
  ) {
    this.isInvateModalVisible = false;
    this.isSelectBtnLoading = false;
    this.isAddPeopleBtnLoading = false;
    this.userCache = [];
    this.memberList = [];
  }
  async queryList() {
    const [wData, wErr]: any = await this.api.api_projectMember({
      projectID: this.store.getCurrentProjectID
    });
    if (wErr) {
      return;
    }
    // * 对成员列表进行排序
    // const Owner = wData.filter(it => it.roleName === 'Owner');
    // const Member = wData.filter(it => it.roleName !== 'Owner');
    this.memberList = wData;
    this.memberList.forEach(member => {
      member.roleTitle = this.roleMUI.find(val => val.id === member.role.id).title;
      if (member.id === this.store.getUserProfile.id) {
        member.myself = true;
      }
    });
  }
  async ngOnInit(): Promise<void> {
    this.queryList();
    makeObservable(this);
    reaction(
      () => this.searchValue,
      value => {
        if (value.trim() === '') {
          return;
        }
        this.http
          .api_workspaceSearchMember({
            workspaceID: this.store.getCurrentWorkspaceID,
            username: value.trim()
          })
          .then(([data, err]: any) => {
            if (err) {
              this.userList = [];
              return;
            }
            const memberList = this.memberList.map(it => it.username);
            this.userList = data.filter(it => {
              return !memberList.includes(it.username);
            });
          });
      },
      { delay: 300 }
    );
  }
  handleChange(event) {
    this.searchValue = event;
  }

  handleAddProject(data) {
    console.log('option', data);
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

      const [aData, aErr]: any = await this.api.api_projectAddMember({
        projectID: this.store.getCurrentProjectID,
        userIDs: userIds
      });
      if (aErr) {
        return;
      }
      this.eMessage.success($localize`Add new member success`);

      // * 关闭弹窗
      this.isInvateModalVisible = false;

      this.queryList();
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

  async e97uoiuCallback($event) {
    this.queryList();
  }
}
