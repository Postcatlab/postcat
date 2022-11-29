import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import _ from 'lodash';
import { isUndefined, omit, omitBy } from 'lodash-es';
import { eoDeepCopy, isEmptyValue } from '../../../utils/index.utils';
import { filterTableData } from '../../../utils/tree/tree.utils';
import { TableProSetting } from './table-pro.model';

@Component({
  selector: 'eo-ng-table-pro',
  templateUrl: './table-pro.component.html',
  styleUrls: ['./table-pro.component.scss'],
})
export class EoTableProComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() columns;
  @Input() nzData;
  @Input() setting: TableProSetting = {};
  @Input() nzDataItem?;
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

  @ViewChild('iconBtnDelete', { read: TemplateRef, static: false })
  iconBtnDelete: TemplateRef<any>;

  tbodyConf = [];
  theadConf = [];
  iconBtns = [];

  childKey = 'children';

  columnVisibleMenus = [];
  private isFullScreenStatus = false;
  BNT_MUI = {
    add: {
      icon: 'plus',
      title: $localize`Add Row`,
      action: 'add',
    },
    addChild: {
      icon: 'plus',
      title: $localize`Add Child Row`,
      action: 'addChild',
    },
    insert: {
      icon: 'arrow-down',
      title: $localize`Add Row Down`,
      action: 'insertRow',
    },
    delete: {
      icon: 'delete',
      title: $localize`Delete`,
      action: 'delete',
    },
  };
  constructor(private cdRef: ChangeDetectorRef) {}
  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns && changes.columns.currentValue?.length) {
      this.setting.isEdit = this.autoSetIsEdit();
      this.generateBtnTemplate();
      //First init may template may not be ready
      if (this.iconBtnTmp) {
        this.initConfig();
      }
    }
    if (changes.nzData) {
      if (this.setting.isEdit && !this.setting.manualAdd) {
        if (!this.nzDataItem) {
          console.error(`EO_ERROR: Can't find nzDataItem`);
          return;
        }
        if (!this.nzData) {
          return;
        }
        if (!this.nzData.length || this.nzData[this.nzData.length - 1][this.setting.primaryKey]) {
          this.nzData.push(eoDeepCopy(this.nzDataItem));
        }
      }
    }
  }
  getPureNzData() {
    if (!this.nzData) {
      return;
    }
    return filterTableData(this.nzData,{
      childKey:this.childKey,
      primaryKey:this.setting.primaryKey
    });
  }
  ngAfterViewInit() {
    this.initConfig();
  }
  handleDataChange(data) {
    this.nzDataChange.emit(data);
  }
  autoSetIsEdit() {
    if (_.has(this.setting, 'isEdit')) {
      return this.setting.isEdit;
    }
    return this.columns.some((col) => ['select', 'checkbox', 'autoComplete', 'input'].includes(col.type));
  }
  initConfig() {
    const theaderConf = [];
    const tbodyConf = [];
    let btnIndex = 0;
    //Set level
    if (this.setting.isLevel) {
      if (!this.setting.primaryKey) {
        throw new Error('EO_ERROR[eo-table-pro]: Lack of primaryKey');
      }
    }

    //Set RowSortable
    if (this.setting.rowSortable) {
      theaderConf.push({
        width: 60,
      });
      tbodyConf.push({
        type: 'sort',
      });
    }
    //Set ColumnVisible
    this.setting.toolButton = this.setting.toolButton || {};
    if (!_.has(this.setting.toolButton, 'columnVisible')) {
      this.setting.toolButton.columnVisible = this.columns.length >= 7 ? true : false;
    }
    this.columns.forEach((col) => {
      const colID = col.id || col.key;
      //Set component
      const header = omitBy({ title: col.title, right: col.right, resizeable: col.resizeable }, isUndefined);
      const body: any = omitBy({ key: col.key, type: col.type, right: col.right }, isUndefined);
      switch (col.type) {
        case 'select': {
          body.opts = col.enums.map((item) => ({ label: item.title, value: item.value }));
          break;
        }
        case 'checkbox': {
          header.type = 'checkbox';
          break;
        }
        case 'input':
        case 'autoComplete': {
          body.placeholder = col.placeholder || (typeof col.title === 'string' ? col.title : '');
          break;
        }
        case 'btnList': {
          //Add toolBtn to btnList
          //TODO Add last when has two btnList
          header.title = this.toolBtnTmp;

          body.type = 'btn';
          body.btns = col.btns.map((btn) => {
            const newBtn: any = omitBy({ icon: btn.icon, click: btn.click, type: btn.type }, isUndefined);
            const defaultBtn = this.BNT_MUI[btn.action];
            if (defaultBtn) {
              switch (btn.action) {
                case 'insert': {
                  newBtn.title = this.iconBtnTmp.get(btnIndex++);
                  break;
                }
                case 'delete': {
                  newBtn.title = this.iconBtnDelete;
                  break;
                }
                default: {
                  newBtn.icon = btn.icon || defaultBtn.icon;
                  newBtn.title = defaultBtn.title;
                  newBtn.action = defaultBtn.action;
                  break;
                }
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
            body.keyName = col.key;
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
        if (this.setting.isEdit) {
          console.warn(`[EO_WARN]: editable table use filterable may perform poorly`);
        }
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
      if (col.sortable) {
        if (this.setting.isEdit) {
          console.warn(`[EO_WARN]: editable table use sortable may perform poorly`);
        }
        header.showSort = true;
        header.sortDirections = ['ascend', 'descend', null];
      }

      //Set Column visibe
      if (col.columnShow !== 'fixed' && col.type !== 'btnList') {
        this.columnVisibleStatus[colID] = 1;
        this.columnVisibleMenus.push({
          title: col.title,
          key: colID,
          checked: this.columnVisibleStatus[colID],
        });
        if (!col.showFn) {
          body.showFn = header.showFn = (item) => this.columnVisibleStatus[colID];
        }
      }
      if (col.showFn) {
        body.showFn = header.showFn = col.showFn;
      }
      theaderConf.push(header);
      tbodyConf.push(body);
    });
    this.theadConf = theaderConf;
    this.tbodyConf = tbodyConf;
    console.log(this.theadConf, this.tbodyConf);
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
  checkAdd(item) {
    return true;
  }
  private generateBtnTemplate() {
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
        const defaultBtn = this.BNT_MUI[btn.action];
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
}
