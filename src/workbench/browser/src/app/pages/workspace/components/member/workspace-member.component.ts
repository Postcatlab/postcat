import { Component, OnInit, ViewChild } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { MemberService } from 'eo/workbench/browser/src/app/modules/member-list/member.service';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { makeObservable, observable, reaction } from 'mobx';

import { MemberListComponent } from '../../../../modules/member-list/member-list.component';
import { StoreService } from '../../../../shared/store/state.service';

@Component({
  selector: 'eo-workspace-member',
  template: `<nz-list nzItemLayout="horizontal">
      <nz-list-header>
        <eo-ng-select
          class="w-full"
          nzAllowClear
          nzShowSearch
          auto-focus-form
          nzAutoFocus="true"
          i18n-nzPlaceHolder
          nzPlaceHolder="Search"
          [(ngModel)]="userCache"
          (nzOnSearch)="handleChange($event)"
        >
          <eo-ng-option *ngFor="let option of userList" nzCustomContent [nzLabel]="option.username" [nzValue]="option.username">
            <div class="flex w-full justify-between option">
              <div class="flex flex-col justify-between">
                <span class="font-bold">{{ option.username }}</span>
                <span class="text-tips">{{ option.email }}</span>
              </div>
              <button eo-ng-button nzType="primary" nzSize="small" i18n (click)="addMember(option)">Add</button>
            </div>
          </eo-ng-option>
        </eo-ng-select>
      </nz-list-header>
    </nz-list>
    <eo-member-list class="block mt-[10px]" #memberList></eo-member-list> `,
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
  userList = [];
  constructor(
    public store: StoreService,
    private api: ApiService,
    private message: EoNgFeedbackMessageService,
    public member: MemberService
  ) {}

  ngOnInit(): void {
    makeObservable(this);
    reaction(
      () => this.searchValue,
      async value => {
        if (value.trim() === '') {
          return;
        }
        const result = await this.member.searchUser(value.trim());
        // const memberList = this.memberListRef.list.map(it => it.username);
        console.log('hello');
        const [data, err] = await this.api.api_workspaceSearchMember({ username: value.trim(), page: 1, pageSize: 100 });
        if (err) {
          return;
        }
        console.log('memberList', data);
        this.userList = result.filter(it => {
          return !data.includes(it.username);
        });
      },
      { delay: 300 }
    );
  }
  handleChange(event) {
    this.searchValue = event;
  }
  async addMember(items) {
    if (this.store.isLocal) {
      this.message.warning($localize`You can create a cloud workspace and invite members to collaborate.`);
      return;
    }
    const [data, err]: any = await this.member.addMember([items.id]);
    if (err) {
      this.message.error($localize`Add member failed`);
      return;
    }
    this.message.success($localize`Add member successfully`);
    this.userList = [];
    this.userCache = '';
    this.memberListRef.queryList();
  }
}
