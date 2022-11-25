import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { head, isUndefined, omitBy } from 'lodash-es';

@Component({
  selector: 'eo-ng-table-pro',
  templateUrl: './table-pro.component.html',
  styleUrls: ['./table-pro.component.scss'],
})
export class EoTableProComponent implements OnInit, AfterViewInit {
  @Input() columns;
  @Input() nzData;
  @Input() setting;
  @Input() nzExpand = false;
  @Output() nzTrClick = new EventEmitter();
  @Output() nzDataChange = new EventEmitter();

  @ViewChild('enumsTmp', { read: TemplateRef, static: false })
  enumsTmp: TemplateRef<any>;

  tbodyConf = [];
  theadConf = [];
  constructor() {}
  ngOnInit(): void {}
  ngAfterViewInit() {
    this.columns.forEach((col) => {
      const header = omitBy({ title: col.title }, isUndefined);
      const body: any = omitBy({ key: col.key, type: col.type }, isUndefined);
      switch (col.type) {
        case 'select': {
          body.opts = col.enums.map((item) => ({ label: item.title, value: item.value }));
          break;
        }
        case 'input':
        case 'autoComplete': {
          body.placeholder = col.placeholder;
          break;
        }
        case 'text':
        default: {
          if (col.enums) {
            body.keyNmae = col.key;
            body.key = this.enumsTmp;
            body.enums = col.enums.reduce((a, v) => ({ ...a, [v.value]: { title: v.title, class: v.class } }), {});
          }
          break;
        }
      }
      if (col.filters) {
        header.filterFn = col.filterFn;
        header.filterOpts = col.enums.map((item) => ({ text: item.title, value: item.value }));
      }
      this.theadConf.push(header);
      this.tbodyConf.push(body);
    });
    console.log(this.theadConf, this.tbodyConf);
  }
  checkAdd() {
    return true;
  }
}
