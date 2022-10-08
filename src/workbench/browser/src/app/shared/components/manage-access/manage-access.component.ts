import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

type UserMeta = {
  username: string;
  roleName: string;
  email: string;
  mobilePhone: string;
};

@Component({
  selector: 'eo-manage-access',
  templateUrl: './manage-access.component.html',
  styleUrls: ['./manage-access.component.scss'],
})
export class ManageAccessComponent implements OnInit {
  @Input() data: UserMeta[] = [];
  @Input() loading = false;
  @Output() eoOnRemove = new EventEmitter<UserMeta>();
  searchValue: string;
  constructor() {}
  get seachMember() {
    if (!this.searchValue) {
      return this.data;
    }
    const searchText = this.searchValue.toLocaleLowerCase();
    return this.data.filter((val) => val.username.toLocaleLowerCase().includes(searchText));
  }
  ngOnInit(): void {}

  handleRemove(item: UserMeta) {
    this.eoOnRemove.emit(item);
  }
}
