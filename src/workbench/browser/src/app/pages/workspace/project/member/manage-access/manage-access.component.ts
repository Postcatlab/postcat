import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { autorun } from 'mobx';

type UserMeta = {
  username: string;
  roleName: string;
  email: string;
  mobilePhone: string;
  permissions: string[];
};

@Component({
  selector: 'eo-manage-access',
  templateUrl: './manage-access.component.html',
  styleUrls: ['./manage-access.component.scss']
})
export class ManageAccessComponent {
  @Input() data: UserMeta[] = [];
  @Input() loading = false;
  @Output() readonly eoOnRemove = new EventEmitter<UserMeta>();
  constructor(public store: StoreService) {}

  handleRemove(item: UserMeta) {
    this.eoOnRemove.emit(item);
  }
}
