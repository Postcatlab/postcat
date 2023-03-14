import { Component, OnInit } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { autorun, reaction } from 'mobx';
import { TraceService } from 'pc/browser/src/app/services/trace.service';

import { StoreService } from '../../store/state.service';
import { MemberService } from './member.service';

@Component({
  selector: 'eo-member-list',
  template: `<nz-list nzItemLayout="horizontal" [nzLoading]="loading">
    <nz-list-item *ngFor="let item of list">
      <nz-list-item-meta>
        <nz-list-item-meta-title>
          <div class="flex items-center">
            <nz-avatar
              [nzShape]="'square'"
              [nzSize]="40"
              nzText="{{ (item.username || item.email)?.at(0) }}"
              class="mr-[10px] flex-none"
            ></nz-avatar>
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
            <span class="text-tips">{{ item.roleTitle }}</span>
            <div class="operate-btn-list" *ngIf="!item.readonly && !store.isLocal && ((!item.isSelf && member.isOwner) || item.isSelf)">
              <button eo-ng-button eo-ng-dropdown [nzDropdownMenu]="menu"> <eo-iconpark-icon name="more"></eo-iconpark-icon> </button>
              <eo-ng-dropdown-menu #menu="nzDropdownMenu">
                <ul nz-menu>
                  <ng-container *ngIf="!item.isSelf && member.isOwner">
                    <li *ngIf="item.isOwner" nz-menu-item i18n (click)="changeRole({ userId: item.id, roleIds: 'editor' })">
                      Set Editor
                    </li>
                    <li *ngIf="item.isEditor" nz-menu-item i18n (click)="changeRole({ userId: item.id, roleIds: 'owner' })"> Set Owner </li>
                    <li nz-menu-item i18n (click)="removeMember(item)"> Remove </li>
                  </ng-container>
                  <li *ngIf="item.isSelf" nz-menu-item i18n (click)="member.quitMember(item)">Quit</li>
                </ul>
              </eo-ng-dropdown-menu>
            </div>
          </div>
        </nz-list-item-action>
      </ul>
    </nz-list-item>
    <nz-list-empty *ngIf="!loading && list?.length === 0"></nz-list-empty>
  </nz-list>`,
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  list = [];
  roleList = [];
  loading = false;
  constructor(
    public store: StoreService,
    private trace: TraceService,
    private message: EoNgFeedbackMessageService,
    public member: MemberService
  ) {}

  ngOnInit(): void {
    this.updateList();

    //! Use  reaction not use autoRun,autoRun will cause loop
    reaction(
      () => this.store.isLogin,
      async () => {
        this.updateList();
      }
    );
  }
  updateList() {
    if (this.store.isLogin) {
      this.queryList();
    } else {
      this.list = [
        {
          username: 'Postcat'
        }
      ];
    }
  }
  async queryList(username = '') {
    this.loading = true;
    this.list = await this.member.queryMember(username);
    this.loading = false;
  }
  async changeRole(item) {
    const isOK: boolean = await this.member.changeRole(item);
    if (isOK) {
      this.message.success($localize`Change role successfully`);
      this.trace.report('switch_member_permission');
      this.queryList();
      return;
    }
    this.message.error($localize`Change role Failed`);
  }
  async removeMember(item) {
    const [data, err]: any = await this.member.removeMember(item);
    if (err) {
      this.message.error($localize`Change role error`);
      return;
    }
    this.message.success($localize`Remove Member successfully`);
    this.queryList();
  }
}
