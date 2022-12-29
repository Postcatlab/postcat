import { Component, OnInit } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { autorun } from 'mobx';

import { StoreService } from '../../shared/store/state.service';
import { MemberService } from './member.service';

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
            <div class="operate-btn-list" *ngIf="!store.isLocal && !item.disabledEdit && (item.myself || member.role === 'Owner')">
              <button eo-ng-button eo-ng-dropdown [nzDropdownMenu]="menu"> <eo-iconpark-icon name="more"></eo-iconpark-icon> </button>
              <eo-ng-dropdown-menu #menu="nzDropdownMenu">
                <ul nz-menu>
                  <li
                    *ngIf="!item.myself && member.role === 'Owner' && item.role?.name === 'Owner'"
                    nz-menu-item
                    i18n
                    (click)="changeRole(item)"
                    >Set Editor
                  </li>
                  <li
                    *ngIf="!item.myself && member.role === 'Owner' && item.role?.name !== 'Owner'"
                    nz-menu-item
                    i18n
                    (click)="changeRole(item)"
                    >Set Owner
                  </li>
                  <li *ngIf="!item.myself && member.role === 'Owner'" nz-menu-item i18n (click)="removeMember(item)">Remove</li>
                  <li *ngIf="item.myself" nz-menu-item i18n (click)="quitMember()">Quit</li>
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
  loading = false;
  constructor(public store: StoreService, private message: EoNgFeedbackMessageService, public member: MemberService) {}

  ngOnInit(): void {
    autorun(() => {
      if (this.store.isLogin) {
        this.queryList();
      } else {
        this.list = [
          {
            username: 'Postcat'
          }
        ];
      }
    });
  }
  async queryList() {
    this.loading = true;
    this.list = await this.member.queryMember();
    this.loading = false;
  }
  async changeRole(item) {
    const [data, err]: any = await this.member.changeRole(item);
    if (err) {
      this.message.error($localize`Change role Failed`);
      return;
    }
    this.message.success($localize`Change role successfully`);
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
  async quitMember() {
    const [data, err]: any = await this.member.quitMember(this.list);
    if (err === 'warning') {
      return;
    }
    if (err) {
      this.message.error($localize`Quit Failed`);
      return;
    }
    this.message.success($localize`Quit successfully`);
  }
}
