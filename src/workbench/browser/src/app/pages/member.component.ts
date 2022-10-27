import { NzModalService } from 'ng-zorro-antd/modal';
import { UserService } from 'eo/workbench/browser/src/app/shared/services/user/user.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service';
import { WorkspaceService } from 'eo/workbench/browser/src/app/shared/services/workspace/workspace.service';
import { distinct } from 'rxjs/operators';
import { interval } from 'rxjs';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'eo-member',
  template: `<nz-modal
      [nzFooter]="null"
      [(nzVisible)]="isInvateModalVisible"
      (nzOnCancel)="handleInvateModalCancel()"
      (nzAfterClose)="ehe4islCallback()"
      nzTitle="Add people to the workspace"
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <input nz-input [(ngModel)]="inputPersonValue" i18n-placeholder placeholder="Search by username" />
        <section class="h-4"></section>
        <button
          nz-button
          [nzLoading]="isSelectBtnLoading"
          class=""
          nzType="primary"
          nzBlock
          (click)="btn0r9zcbCallback()"
          [disabled]="btnguixdgStatus()"
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
          [nzLoading]="isAddPeopleBtnLoading"
          class=""
          nzType="primary"
          (click)="btnf5umnoCallback()"
          [disabled]="btny703n5Status()"
          i18n
        >
          Add people
        </button>
      </h2>
      <section class="py-5">
        <eo-manage-access [data]="memberList" (eoOnRemove)="e97uoiuCallback($event)"></eo-manage-access>
      </section>
    </section>`,
})
export class MemberComponent implements OnInit {
  isInvateModalVisible;
  inputPersonValue;
  isSelectBtnLoading;
  isAddPeopleBtnLoading;
  memberList;
  constructor(
    public modal: NzModalService,
    public user: UserService,
    public message: MessageService,
    public api: RemoteService,
    public eMessage: EoMessageService,
    public workspace: WorkspaceService,
    public dataSource: DataSourceService
  ) {
    this.isInvateModalVisible = false;
    this.inputPersonValue = '';
    this.isSelectBtnLoading = false;
    this.isAddPeopleBtnLoading = false;
    this.memberList = [];
  }
  async ngOnInit(): Promise<void> {
    this.message
      .get()
      .pipe(distinct(({ type }) => type, interval(400)))
      .subscribe(async ({ type, data }) => {});

    const url = this.dataSource.mockUrl;

    if (url === '') {
      this.message.send({ type: 'need-config-remote', data: {} });
      return;
    }
    const { id: currentWorkspaceID } = this.workspace.currentWorkspace;
    const [wData, wErr]: any = await this.api.api_workspaceMember({
      workspaceID: currentWorkspaceID,
    });
    if (wErr) {
      if (wErr.status === 401) {
        this.message.send({ type: 'clear-user', data: {} });
        if (this.user.isLogin) {
          return;
        }
        this.message.send({ type: 'http-401', data: {} });
      }
      return;
    }

    // * 对成员列表进行排序
    const Owner = wData.filter((it) => it.roleName === 'Owner');
    const Member = wData.filter((it) => it.roleName !== 'Owner');
    this.memberList = Owner.concat(Member);
  }
  handleInvateModalCancel(): void {
    // * 关闭弹窗
    this.isInvateModalVisible = false;
  }
  async ehe4islCallback() {
    // * nzAfterClose event callback
    {
      // * auto clear form
      this.inputPersonValue = '';
    }
    this.inputPersonValue = '';
  }
  async btn0r9zcbCallback() {
    // * click event callback
    this.isSelectBtnLoading = true;
    const btnSelectRunning = async () => {
      const username = this.inputPersonValue;
      const [uData, uErr]: any = await this.api.api_userSearch({ username });
      if (uErr) {
        if (uErr.status === 401) {
          this.message.send({ type: 'clear-user', data: {} });
          if (this.user.isLogin) {
            return;
          }
          this.message.send({ type: 'http-401', data: {} });
        }
        return;
      }

      if (uData.length === 0) {
        this.eMessage.error($localize`Could not find a user matching ${username}`);
        return;
      }
      const [user] = uData;
      const { id } = user;

      const { id: workspaceID } = this.workspace.currentWorkspace;
      const [aData, aErr]: any = await this.api.api_workspaceAddMember({
        workspaceID,
        userIDs: [id],
      });
      if (aErr) {
        if (aErr.status === 401) {
          this.message.send({ type: 'clear-user', data: {} });
          if (this.user.isLogin) {
            return;
          }
          this.message.send({ type: 'http-401', data: {} });
        }
        return;
      }
      this.eMessage.success($localize`Add new member success`);

      // * 关闭弹窗
      this.isInvateModalVisible = false;

      const { id: currentWorkspaceID } = this.workspace.currentWorkspace;
      const [wData, wErr]: any = await this.api.api_workspaceMember({
        workspaceID: currentWorkspaceID,
      });
      if (wErr) {
        if (wErr.status === 401) {
          this.message.send({ type: 'clear-user', data: {} });
          if (this.user.isLogin) {
            return;
          }
          this.message.send({ type: 'http-401', data: {} });
        }
        return;
      }

      // * 对成员列表进行排序
      const Owner = wData.filter((it) => it.roleName === 'Owner');
      const Member = wData.filter((it) => it.roleName !== 'Owner');
      this.memberList = Owner.concat(Member);
    };
    await btnSelectRunning();
    this.isSelectBtnLoading = false;
  }
  btnguixdgStatus() {
    // * disabled status status
    return this.inputPersonValue === '';
  }
  async btnf5umnoCallback() {
    // * click event callback
    this.isAddPeopleBtnLoading = true;
    const btnAddPeopleRunning = async () => {
      // * 唤起弹窗
      this.isInvateModalVisible = true;
      {
        {
        }
        {
        }
      }
    };
    await btnAddPeopleRunning();
    this.isAddPeopleBtnLoading = false;
  }
  btny703n5Status() {
    // * disabled status status
    return;
    return this.workspace.currentWorkspaceID !== -1 && this.workspace.authEnum.canEdit;
  }
  async e97uoiuCallback($event) {
    // * eoOnRemove event callback

    const confirm = () =>
      new Promise((resolve) => {
        this.modal.confirm({
          nzTitle: $localize`Warning`,
          nzContent: $localize`Are you sure you want to remove the member ?`,
          nzOkDanger: true,
          nzOkText: $localize`Delete`,
          nzOnOk: () => resolve(true),
          nzOnCancel: () => resolve(false),
        });
      });
    const isOk = await confirm();
    if (!isOk) {
      return;
    }

    const { id: workspaceID } = this.workspace.currentWorkspace;

    const { id } = $event;

    const [data, err]: any = await this.api.api_workspaceRemoveMember({
      workspaceID,
      userIDs: [id],
    });
    if (err) {
      if (err.status === 401) {
        this.message.send({ type: 'clear-user', data: {} });
        if (this.user.isLogin) {
          return;
        }
        this.message.send({ type: 'http-401', data: {} });
      }
      return;
    }
    const { id: currentWorkspaceID } = this.workspace.currentWorkspace;
    const [wData, wErr]: any = await this.api.api_workspaceMember({
      workspaceID: currentWorkspaceID,
    });
    if (wErr) {
      if (wErr.status === 401) {
        this.message.send({ type: 'clear-user', data: {} });
        if (this.user.isLogin) {
          return;
        }
        this.message.send({ type: 'http-401', data: {} });
      }
      return;
    }

    // * 对成员列表进行排序
    const Owner = wData.filter((it) => it.roleName === 'Owner');
    const Member = wData.filter((it) => it.roleName !== 'Owner');
    this.memberList = Owner.concat(Member);
  }
}
