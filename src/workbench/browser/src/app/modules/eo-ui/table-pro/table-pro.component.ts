import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { keyBy } from 'lodash-es';

@Component({
  selector: 'eo-ng-table-pro',
  templateUrl: './table-pro.component.html',
  styleUrls: ['./table-pro.component.scss'],
})
export class EoTableProComponent implements OnInit {
  @Input() columns;
  @Input() nzData;
  @Input() setting;
  @Input() nzExpand = false;
  @Output() nzTrClick = new EventEmitter();
  @Output() nzDataChange = new EventEmitter();

  tbodyConf = [];
  theadConf = [];
  constructor() {}
  ngOnInit(): void {
    this.columns.forEach((col) => {
      const header = { title: col.title };
      const body: any = { key: col.key, type: col.type };
      switch (col.type) {
        case 'select': {
          body.opts = col.enums.map((item) => ({ label: item.title, value: item.value }));
          break;
        }
        case 'input':
        case 'autoComplete': {
          body.placeholder = col.placeholder;
        }
      }
      this.theadConf.push(header);
      this.tbodyConf.push(body);
    });
  }
  checkAdd() {
    return true;
  }
}
