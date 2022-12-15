import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

type UserMeta = {
  username: string;
  roleName: string;
  email: string;
  mobilePhone: string;
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
  searchValue: string;
  constructor(public store: StoreService) {}
  get seachMember() {
    if (!this.searchValue) {
      return this.data;
    }
    const searchText = this.searchValue.toLocaleLowerCase();
    return this.data.filter(val => val.username.toLocaleLowerCase().includes(searchText));
  }

  handleRemove(item: UserMeta) {
    this.eoOnRemove.emit(item);
  }
}
