import { Component, Input, OnInit } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { makeObservable, observable, reaction } from 'mobx';

import { RemoteService } from '../../../../shared/services/storage/remote.service';
import { StoreService } from '../../../../shared/store/state.service';

@Component({
  selector: 'eo-workspace-member',
  template: `<nz-list nzItemLayout="horizontal" [nzLoading]="loading">
    <nz-list-header *ngIf="store.getWorkspaceRole === 'admin'">
      <eo-ng-select
        class="w-full"
        nzAllowClear
        nzShowSearch
        i18n-placeholder
        placeholder="Search by username"
        [(ngModel)]="userCache"
        nzMode="multiple"
        (nzOnSearch)="handleChange($event)"
      >
        <eo-ng-option *ngFor="let option of userList" nzCustomContent [nzLabel]="option.username" [nzValue]="option.username">
          <div class="flex w-full justify-between">
            <span class="font-bold">{{ option.username }}</span>
            <span class="text-tips">{{ option.email }}</span>
          </div>
        </eo-ng-option>
      </eo-ng-select>
    </nz-list-header>
    <nz-list-item *ngFor="let item of list">
      <nz-list-item-meta>
        <nz-list-item-meta-title>
          <div class="flex flex-col">
            <span class="font-bold link">{{ item.username }}</span>
            <span class="text-tips">{{ item.email || item.mobilePhone }}</span>
          </div>
        </nz-list-item-meta-title>
      </nz-list-item-meta>
      <ul nz-list-item-actions>
        <nz-list-item-action>
          <div class="flex w-[170px] items-center justify-between">
            <span>{{ item.roleTitle }}</span>
            <div class="operate-btn-list" *ngIf="item.myself || store.getWorkspaceRole === 'admin'">
              <button eo-ng-button eo-ng-dropdown [nzDropdownMenu]="menu"> <eo-iconpark-icon name="more"></eo-iconpark-icon> </button>
              <eo-ng-dropdown-menu #menu="nzDropdownMenu">
                <ul nz-menu>
                  <li *ngIf="!item.myself && store.getWorkspaceRole === 'admin'" nz-menu-item i18n (click)="changeRole(item)"
                    >Set {{ item.role.name === 'Owner' ? 'Editor' : 'Owner' }}
                  </li>
                  <li *ngIf="!item.myself && store.getWorkspaceRole === 'admin'" nz-menu-item i18n (click)="removeMember(item)">Remove</li>
                  <li *ngIf="item.myself" nz-menu-item i18n (click)="quitWorkspace(item)">Quit</li>
                </ul>
              </eo-ng-dropdown-menu>
            </div>
          </div>
        </nz-list-item-action>
      </ul>
    </nz-list-item>
    <nz-list-empty *ngIf="!loading && list.length === 0"></nz-list-empty>
  </nz-list> `,
  styleUrls: ['./workspace-member.component.scss']
})
export class WorkspaceMemberComponent implements OnInit {
  @Input() list = [];
  @Input() loading = false;
  @observable searchValue = '';
  userCache;
  userList = [];
  roleMUI = [
    {
      title: 'Workspace Owner',
      name: 'owner',
      id: 1
    },
    {
      title: 'Editor',
      name: 'editor',
      id: 2
    }
  ];
  constructor(public store: StoreService, private message: EoNgFeedbackMessageService, private remote: RemoteService) {}

  ngOnInit(): void {
    this.queryList();
    makeObservable(this);
    reaction(
      () => this.searchValue,
      value => {
        if (value.trim() === '') {
          return;
        }
        this.remote.api_userSearch({ username: value.trim() }).then(([data, err]: any) => {
          if (err) {
            this.userList = [];
            return;
          }
          const memberList = this.list.map(it => it.username);
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
  async queryList() {
    this.loading = true;
    const [data, error]: any = await this.remote.api_workspaceMember({
      workspaceID: this.store.getCurrentWorkspaceID
    });
    this.loading = false;
    this.list = data || [];
    this.list.forEach(member => {
      member.roleTitle = this.roleMUI.find(val => val.id === member.role.id).title;
      if (member.id === this.store.getUserProfile.id) {
        member.myself = true;
      }
    });
  }
  async addMember(items) {
    await this.remote.api_workspaceAddMember({
      workspaceID: this.store.getCurrentWorkspaceID,
      userIDs: items
    });
    this.queryList();
  }
  async changeRole(item) {
    const roleID = item.role.id === 1 ? 2 : 1;
    const [data, err]: any = await this.remote.api_workspaceSetRole({
      workspaceID: this.store.getCurrentWorkspaceID,
      roleID: roleID,
      memberID: item.id
    });
    if (err) {
      this.message.error($localize`Change role Failed`);
      return;
    }
    this.message.success($localize`Change role succssfully`);
    item.role.id = roleID;
    item.roleTitle = this.roleMUI.find(val => val.id === roleID).title;
  }
  async removeMember(item) {
    const [data, err]: any = await this.remote.api_workspaceRemoveMember({
      workspaceID: this.store.getCurrentWorkspaceID,
      userIDs: [item.id]
    });
    if (err) {
      this.message.error($localize`Change role error`);
      return;
    }
    this.message.success($localize`Remove Member succssfully`);
    this.queryList();
  }
  quitWorkspace(item) {
    let memberList = this.list.filter(val => val.role.id === 1);
    if (memberList.length === 1 && memberList[0].myself) {
      this.message.warning(
        $localize`You are the only owner of the workspace, please transfer the ownership to others before leaving the workspace.`
      );
      return;
    }
  }
}
