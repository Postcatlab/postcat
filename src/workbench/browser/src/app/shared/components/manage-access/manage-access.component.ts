import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

type UserMeta = {
  username: string;
  role: string;
};

@Component({
  selector: 'eo-manage-access',
  templateUrl: './manage-access.component.html',
  styleUrls: ['./manage-access.component.scss'],
})
export class ManageAccessComponent implements OnInit {
  @Input() data = [];
  @Input() loading = false;
  @Output() eoOnRemove = new EventEmitter<UserMeta>();

  constructor() {}

  ngOnInit(): void {}

  handleRemove(item: UserMeta) {
    this.eoOnRemove.emit(item);
  }
}
