import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { MemberService } from 'eo/workbench/browser/src/app/modules/member-list/member.service';
import { makeObservable, observable, reaction } from 'mobx';

import { MemberListComponent } from '../../../../modules/member-list/member-list.component';
import { StoreService } from '../../../../shared/store/state.service';

@Component({
  selector: 'eo-workspace-member',
  template: `<nz-list nzItemLayout="horizontal">
      <nz-list-header *ngIf="member.isOwner">
        <eo-ng-select
          class="w-full"
          nzAllowClear
          nzShowSearch
          auto-focus-form
          nzServerSearch
          nzAutoFocus="true"
          i18n-nzPlaceHolder
          nzDropdownClassName="eo-member-select"
          nzPlaceHolder="Search"
          [(ngModel)]="userCache"
          (nzOnSearch)="handleChange($event)"
        >
          <!-- <ng-container > -->
          <eo-ng-option *ngFor="let option of userList" nzCustomContent [nzLabel]="option.userNickName" [nzValue]="option.id">
            <div class="flex w-full justify-between items-center option">
              <div class="flex flex-col justify-between">
                <span class="font-bold">{{ option.userNickName }}</span>
                <span class="text-tips">{{ option.email }}</span>
              </div>
              <button eo-ng-button nzType="primary" nzSize="small" i18n (click)="addMember(option)">Add</button>
            </div>
          </eo-ng-option>
          <!-- </ng-container> -->
          <!-- <eo-ng-option *ngIf="isLoading" nzDisabled nzCustomContent>
            <span nz-icon nzType="loading" class="loading-icon"></span>
            Loading Data...
          </eo-ng-option> -->
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
  isLoading = false;
  userList = [];
  constructor(
    public store: StoreService,
    private message: EoNgFeedbackMessageService,
    public member: MemberService,
    private cdk: ChangeDetectorRef
  ) {}

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
        this.isLoading = false;
        const memberList = this.memberListRef.list.map(it => it.username);
        console.log('result', result);
        this.userList = result ? result.filter(it => !memberList.includes(it.userNickName)) : [];
        // this.cdk.detectChanges();
        console.log(this.userList);
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
      this.message.warning($localize`You can create a cloud workspace and invite members to collaborate.`);
      return;
    }
    const [data, err]: any = await this.member.addMember(items.id);
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
