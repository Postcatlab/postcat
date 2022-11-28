import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
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
  @Input() columnVisibleStatus = {};
  @Output() nzTrClick = new EventEmitter();
  @Output() nzDataChange = new EventEmitter();
  @Output() columnVisibleStatusChange = new EventEmitter();

  @ViewChild('enums', { read: TemplateRef, static: false })
  enums: TemplateRef<any>;

  @ViewChildren('iconBtnTmp', { read: TemplateRef })
  iconBtnTmp: QueryList<TemplateRef<any>>;

  @ViewChild('toolBtnTmp', { read: TemplateRef, static: false })
  toolBtnTmp: TemplateRef<any>;

  tbodyConf = [];
  theadConf = [];
  iconBtns = [];

  columnVisibleMenus = [];
  private isFullScreenStatus = false;
  private BNT_MUI = {
    add: {
      icon: 'plus',
      title: $localize`Add Row`,
      action: 'addRow',
    },
    addChild: {
      icon: 'plus',
      title: $localize`Add Child Row`,
      action: 'addChildRow',
    },
    insert: {
      icon: 'arrow-down',
      title: $localize`Add Row Down`,
      action: 'insertRow',
    },
    delete: {
      icon: 'delete',
      title: $localize`Delete`,
      action: 'deleteRow',
    },
  };
  constructor() {}
  ngOnInit(): void {
    this.generateBtnTemplate();
  }
  ngAfterViewInit() {
    this.initConfig();
  }
  initConfig() {
    let btnIndex = 0;
    //Set level
    if (this.setting.isLevel) {
      if (!this.setting.primaryKey) {
        throw new Error('EO_ERROR[eo-table-pro]: Lack of primaryKey');
      }
    }

    //Set RowSortable
    if (this.setting.rowSortable) {
      this.theadConf.push({
        width: 60,
      });
      this.tbodyConf.push({
        type: 'sort',
      });
    }
    //Set ColumnVisible
    this.setting.toolButton = this.setting.toolButton || {};
    if (!this.setting.toolButton.hasOwnProperty('columnVisible')) {
      this.setting.toolButton.columnVisible = true;
    }
    this.columns.forEach((col) => {
      const colID = col.id || col.key;
      //Set component
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
        case 'btnList': {
          body.type = 'btn';
          body.btns = col.btns.map((btn) => {
            const newBtn: any = omitBy({ icon: btn.icon, click: btn.click, type: btn.type }, isUndefined);
            const defaultBtn = this.BNT_MUI[btn.action];
            if (defaultBtn) {
              if (btn.action === 'insert') {
                newBtn.title = this.iconBtnTmp.get(btnIndex++);
              } else {
                newBtn.icon = btn.icon || defaultBtn.icon;
                newBtn.title = defaultBtn.title;
                newBtn.action = defaultBtn.action;
              }
            }
            switch (btn.type) {
              case 'dropdown': {
                newBtn.title = this.iconBtnTmp.get(btnIndex++);
                newBtn.opts = btn.menus;
                break;
              }
            }
            return newBtn;
          });
          break;
        }
        case 'text':
        default: {
          if (col.enums) {
            body.keyNmae = col.key;
            body.key = this.enums;
            body.enums = col.enums.reduce((a, v) => ({ ...a, [v.value]: { title: v.title, class: v.class } }), {});
          }
          break;
        }
      }
      //Set resizeable
      if (col.width) {
        header.width = col.width;
      }
      //Set filter
      if (col.filterable) {
        header.filterMultiple = true;
        //Use custom filter
        if (!col.filterFn || col.filterFn === true) {
          header.filterFn = (selected: string[], item: any) => selected.includes(item.data[col.key]);
        } else {
          header.filterFn = col.filterFn;
        }
        header.filterOpts = col.enums.map((item) => ({ text: item.title, value: item.value }));
      }
      //Set Sort

      //Set Column visibe
      if (col.columnShow !== 'fixed' && col.type !== 'btnList') {
        this.columnVisibleStatus[colID] = 1;
        this.columnVisibleMenus.push({
          title: col.title,
          key: colID,
          checked: this.columnVisibleStatus[colID],
        });
        if (!col.showFn) {
          body.showFn = header.showFn = () => this.columnVisibleStatus[colID];
        }
      }
      if (col.showFn) {
        body.showFn = header.showFn = col.showFn;
      }
      this.theadConf.push(header);
      this.tbodyConf.push(body);
    });

    //Set toolBtn
    this.theadConf.push({
      title: this.toolBtnTmp,
      width: 170,
      right: true,
    });
    console.log(this.columnVisibleMenus, this.theadConf, this.tbodyConf);
  }
  btnClick(btnItem, index, item, apis) {
    console.log(btnItem, index, item, apis);
    if (btnItem.customClick) {
      this.columns[btnItem.index].btns[btnItem.btnIndex].click(index, item, apis);
      return;
    }
    if (btnItem.action) {
      switch (btnItem.action) {
        case 'insertRow': {
          apis[btnItem.action](index, 'down', false);
          break;
        }
        default: {
          apis[btnItem.action](index);
          break;
        }
      }
    }
  }
  private generateBtnTemplate() {
    const BNT_MUI = {
      add: {
        icon: 'plus',
        title: $localize`Add Row`,
        action: 'addRow',
      },
      addChild: {
        icon: 'plus',
        title: $localize`Add Child Row`,
        action: 'addChildRow',
      },
      insert: {
        icon: 'arrow-down',
        title: $localize`Add Row Down`,
        action: 'insertRow',
      },
      delete: {
        icon: 'delete',
        title: $localize`Delete`,
        action: 'deleteRow',
      },
    };
    this.columns.forEach((col, index) => {
      if (col.type !== 'btnList') {
        return;
      }
      col.btns.forEach((btn, btnIndex) => {
        //only dropdown/action='insert' need table-pro custom template
        if (btn.type !== 'dropdown' && btn.action !== 'insert') {
          return;
        }
        const iconBtn: any = { index, btnIndex };
        if (btn.icon) {
          iconBtn.icon = btn.icon;
        }
        const defaultBtn = BNT_MUI[btn.action];
        if (defaultBtn) {
          iconBtn.icon = btn.icon || defaultBtn.icon;
          iconBtn.title = defaultBtn.title;
          iconBtn.action = defaultBtn.action;
        }
        if (btn.click) {
          iconBtn.customClick = true;
        }
        this.iconBtns.push(iconBtn);
      });
    });
  }
  screenAll(index: number = 0) {
    this.isFullScreenStatus = !this.isFullScreenStatus;
    const domElem = document.getElementsByClassName('full-screen-container')[index];
    if (this.isFullScreenStatus) {
      if (!domElem.className.includes('eo-ng-table-full-screen')) {
        domElem.className += ' eo-ng-table-full-screen';
      }
    } else {
      domElem.className = domElem.className.replace(' eo-ng-table-full-screen', '');
    }
  }
  stopPropagation(event: any) {
    if (event.stopPropagation) {
      event.stopPropagation();
    }
  }
  toggleColumnVisible(event: any, item: any) {
    this.columnVisibleStatus[item.key] = event;
    this.columnVisibleStatusChange.emit(this.columnVisibleStatus);
  }
  checkAdd() {
    return true;
  }
}
