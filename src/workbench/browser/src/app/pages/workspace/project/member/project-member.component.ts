import { Component, OnInit } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { observable, makeObservable, computed, reaction } from 'mobx';
import { NzModalService } from 'ng-zorro-antd/modal';

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
          i18n-placeholder
          [nzOptionHeightPx]="54"
          placeholder="Search by username"
          [(ngModel)]="userCache"
          nzMode="multiple"
          (nzOnSearch)="handleChange($event)"
        >
          <eo-ng-option *ngFor="let option of userList" nzCustomContent [nzLabel]="option.username" [nzValue]="option.username">
            <div class="h-full flex justify-between hover-control">
              <div class="flex flex-col">
                <span class="font-bold">{{ option.username }}</span>
                <span>906630451@qq.com</span>
              </div>
              <div class="btn flex items-center">
                <button eo-ng-button nzType="primary" nzBlock (click)="handleAddProject(option)" i18n> Add to project </button>
              </div>
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
          Add to project
        </button>
      </ng-container>
    </nz-modal>
    <section class="py-5 px-10 w-6/12 m-auto">
      <h2 class="text-lg flex justify-between items-center">
        <span class="font-bold" i18n>Project Members</span
        ><button eo-ng-button [nzLoading]="isAddPeopleBtnLoading" nzType="primary" (click)="btnf5umnoCallback()" i18n> + Add </button>
      </h2>
      <section class="py-5">
        <eo-manage-access [data]="memberList" (eoOnRemove)="e97uoiuCallback($event)"></eo-manage-access>
      </section>
    </section>`,
  styleUrls: ['./member.component.scss']
})
export class ProjectMemberComponent implements OnInit {
  @observable searchValue = '';
  userCache;
  isInvateModalVisible;
  isSelectBtnLoading;
  isAddPeopleBtnLoading;
  memberList;
  userList = [];
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

  async ngOnInit(): Promise<void> {
    makeObservable(this);
    reaction(
      () => this.searchValue,
      value => {
        if (value.trim() === '') {
          return;
        }
        this.http.api_userSearch({ username: value.trim() }).then(([data, err]: any) => {
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

    const url = this.dataSource.remoteServerUrl;

    if (url === '') {
      this.message.send({ type: 'need-config-remote', data: {} });
      return;
    }
    const { id: currentWorkspaceID } = this.store.getCurrentWorkspace;
    const [wData, wErr]: any = await this.api.api_workspaceMember({
      workspaceID: currentWorkspaceID
    });
    if (wErr) {
      if (wErr.status === 401) {
        this.message.send({ type: 'clear-user', data: {} });
        if (this.store.isLogin) {
          return;
        }
        this.message.send({ type: 'http-401', data: {} });
      }
      return;
    }

    // * 对成员列表进行排序
    const Owner = wData.filter(it => it.roleName === 'Owner');
    const Member = wData.filter(it => it.roleName !== 'Owner');
    this.memberList = Owner.concat(Member);
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
      const username = this.userCache;
      const [uData, uErr]: any = await this.api.api_userSearch({ username });
      if (uErr) {
        if (uErr.status === 401) {
          this.message.send({ type: 'clear-user', data: {} });
          if (this.store.isLogin) {
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

      const { id: workspaceID } = this.store.getCurrentWorkspace;
      const [aData, aErr]: any = await this.api.api_workspaceAddMember({
        workspaceID,
        userIDs: [id]
      });
      if (aErr) {
        if (aErr.status === 401) {
          this.message.send({ type: 'clear-user', data: {} });
          if (this.store.isLogin) {
            return;
          }
          this.message.send({ type: 'http-401', data: {} });
        }
        return;
      }
      this.eMessage.success($localize`Add new member success`);

      // * 关闭弹窗
      this.isInvateModalVisible = false;

      const { id: currentWorkspaceID } = this.store.getCurrentWorkspace;
      const [wData, wErr]: any = await this.api.api_workspaceMember({
        workspaceID: currentWorkspaceID
      });
      if (wErr) {
        if (wErr.status === 401) {
          this.message.send({ type: 'clear-user', data: {} });
          if (this.store.isLogin) {
            return;
          }
          this.message.send({ type: 'http-401', data: {} });
        }
        return;
      }

      // * 对成员列表进行排序
      const Owner = wData.filter(it => it.roleName === 'Owner');
      const Member = wData.filter(it => it.roleName !== 'Owner');
      this.memberList = Owner.concat(Member);
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
    // * eoOnRemove event callback

    const confirm = () =>
      new Promise(resolve => {
        this.modal.confirm({
          nzTitle: $localize`Warning`,
          nzContent: $localize`Are you sure you want to remove the member ?`,
          nzOkDanger: true,
          nzOkText: $localize`Delete`,
          nzOnOk: () => resolve(true),
          nzOnCancel: () => resolve(false)
        });
      });
    const isOk = await confirm();
    if (!isOk) {
      return;
    }

    const { id: workspaceID } = this.store.getCurrentWorkspace;

    const { id } = $event;

    const [data, err]: any = await this.api.api_workspaceRemoveMember({
      workspaceID,
      userIDs: [id]
    });
    if (err) {
      if (err.status === 401) {
        this.message.send({ type: 'clear-user', data: {} });
        if (this.store.isLogin) {
          return;
        }
        this.message.send({ type: 'http-401', data: {} });
      }
      return;
    }
    const { id: currentWorkspaceID } = this.store.getCurrentWorkspace;
    const [wData, wErr]: any = await this.api.api_workspaceMember({
      workspaceID: currentWorkspaceID
    });
    if (wErr) {
      if (wErr.status === 401) {
        this.message.send({ type: 'clear-user', data: {} });
        if (this.store.isLogin) {
          return;
        }
        this.message.send({ type: 'http-401', data: {} });
      }
      return;
    }

    // * 对成员列表进行排序
    const Owner = wData.filter(it => it.roleName === 'Owner');
    const Member = wData.filter(it => it.roleName !== 'Owner');
    this.memberList = Owner.concat(Member);
  }
}
