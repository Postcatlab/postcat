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
  @Input() data = [
    {
      username: 'Bonana',
      role: 'member',
    },
    {
      username: 'China',
      role: 'member',
    },
    {
      username: 'Drina',
      role: 'member',
    },
  ];
  @Input() loading = false;
  @Output() eoOnRemove = new EventEmitter<UserMeta>();

  constructor() {}

  ngOnInit(): void {}

  handleRemove(item: UserMeta) {
    this.eoOnRemove.emit(item);
  }
}
