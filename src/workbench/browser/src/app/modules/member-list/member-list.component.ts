import { Component, OnInit } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { autorun } from 'mobx';

import { StoreService } from '../../shared/store/state.service';

@Component({
  selector: 'eo-member-list',
  template: `<nz-list nzItemLayout="horizontal" [nzLoading]="loading">
    <nz-list-item *ngFor="let item of list">
      <nz-list-item-meta>
        <nz-list-item-meta-title>
          <div class="flex items-center">
            <nz-avatar [nzShape]="'square'" [nzSize]="40" nzText="{{ item.username[0] }}" class="mr-[10px]"></nz-avatar>
            <div class="flex flex-col">
              <span class="font-bold link">{{ item.username }}</span>
              <span class="text-tips">{{ item.email || item.mobilePhone }}</span>
            </div>
          </div>
        </nz-list-item-meta-title>
      </nz-list-item-meta>
      <ul nz-list-item-actions>
        <nz-list-item-action>
          <div class="flex w-[170px] items-center justify-between">
            <span>{{ item.roleTitle }}</span>
            <div class="operate-btn-list" *ngIf="!store.isLocal && item.isOwner">
              <button eo-ng-button eo-ng-dropdown [nzDropdownMenu]="menu"> <eo-iconpark-icon name="more"></eo-iconpark-icon> </button>
              <eo-ng-dropdown-menu #menu="nzDropdownMenu">
                <ul nz-menu>
                  <li *ngIf="item.isOwner" nz-menu-item i18n (click)="changeRole({ userId: item.id, roleIds: [8] })"> Set Editor </li>
                  <li *ngIf="item.isOwner" nz-menu-item i18n (click)="changeRole({ userId: item.id, roleIds: [7] })"> Set Owner </li>
                  <li *ngIf="!item.isSelf && item.isOwner" nz-menu-item i18n (click)="removeMember(item)"> Remove </li>
                  <li *ngIf="item.isSelf" nz-menu-item i18n (click)="quitMember(item)">Quit</li>
                </ul>
              </eo-ng-dropdown-menu>
            </div>
          </div>
        </nz-list-item-action>
      </ul>
    </nz-list-item>
    <nz-list-empty *ngIf="!loading && list.length === 0"></nz-list-empty>
  </nz-list>`,
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  list = [];
  roleList = [];
  loading = false;
  constructor(public store: StoreService, private api: ApiService, private message: EoNgFeedbackMessageService) {}

  ngOnInit(): void {
    autorun(async () => {
      if (this.store.isLogin) {
        this.queryList();
        const [data, err] = await this.api.api_roleList({ roleModule: 2 }); // * 2 is project role
        if (err) {
          return;
        }
        this.roleList = data;
      } else {
        this.list = [
          {
            username: 'Postcat'
          }
        ];
      }
    });
  }
  async queryList(username = '') {
    this.loading = true;
    const [data, err] = await this.api.api_projectMemberList({ username });
    if (err) {
      this.loading = false;
      return;
    }
    this.list = data.map(({ roles, id, ...it }) => ({
      ...it,
      id,
      roles,
      isSelf: !!roles.filter(item => item.createUserId === id).length, // * 是否自己创建的项目
      isOwner: !!roles.filter(item => item.name === 'Project Owner').length, // * 是否是管理员
      isEditor: !!roles.filter(item => item.name === 'Project Editor'), // * 是否
      rolesList: roles.map(item => item.name)
    }));
    this.loading = false;
  }
  async changeRole(userRole) {
    const [, err]: any = await this.api.api_projectSetRole({ userRole });
    if (err) {
      this.message.error($localize`Change role Failed`);
      return;
    }
    this.message.success($localize`Change role successfully`);
    this.queryList();
  }
  async removeMember({ id }) {
    const [, err]: any = await this.api.api_projectDelMember({ userIds: [id] });
    if (err) {
      this.message.error($localize`Change role error`);
      return;
    }
    this.message.success($localize`Remove Member successfully`);
    this.queryList();
  }
  async quitMember({ id }) {
    const [, err]: any = await this.api.api_projectMemberQuit({ userId: id });
    if (err) {
      this.message.error($localize`Quit Failed`);
      return;
    }
    this.message.success($localize`Quit successfully`);
    this.queryList();
  }
}
