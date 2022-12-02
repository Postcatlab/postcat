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
import _, { omit } from 'lodash-es';
import { isUndefined, omitBy } from 'lodash-es';
import { eoDeepCopy } from '../../../utils/index.utils';
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
  @Input() nzScroll = {};
  @Input() nzExpand = false;
  @Input() columnVisibleStatus = {};
  @Output() nzTrClick = new EventEmitter();
  @Output() nzDataChange = new EventEmitter();
  @Output() columnVisibleStatusChange = new EventEmitter();

  @ViewChild('enums', { read: TemplateRef })
  enums: TemplateRef<any>;

  private BTN_TYPE_NEED_CUSTOMER = ['delete', 'insert', 'edit'];
  //Default buttom template match action
  private TABLE_DEFAULT_BTN = {
    add: {
      icon: 'plus',
      title: $localize`Add Row`,
      //eo-ng-table fun action
      fnName: 'add',
    },
    addChild: {
      icon: 'plus',
      title: $localize`Add Child Row`,
      fnName: 'addChild',
    },
    insert: {
      icon: 'arrow-down',
      title: $localize`Add Row Down`,
      fnName: 'insertRow',
    },
    edit: {
      icon: 'edit',
      title: $localize`Edit`,
    },
    delete: {
      icon: 'delete',
      title: $localize`Delete`,
      fnName: 'deleteRow',
      confirmTitle: $localize`Are you sure you want to delete?`,
    },
  };
  iconBtns = [];

  //Generate By iconBtns
  @ViewChildren('iconBtnTmp', { read: TemplateRef })
  iconBtnTmp: QueryList<TemplateRef<any>>;

  columnVisibleMenus = [];
  @ViewChild('toolBtnTmp', { read: TemplateRef })
  toolBtnTmp: TemplateRef<any>;

  @ViewChild('numberInput', { read: TemplateRef })
  numberInput: TemplateRef<any>;

  tbodyConf = [];
  theadConf = [];

  childKey = 'children';

  randomClass=`full-screen-container_${Date.now()}`;

  private isFullScreenStatus = false;
  private IS_EDIT_COLUMN_TYPE = ['select', 'checkbox', 'autoComplete', 'input', 'inputNumber'];
  constructor(private cdRef: ChangeDetectorRef) {}
  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.columns?.currentValue?.length) {
      this.onColumnChanges();
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
    return filterTableData(this.nzData, {
      childKey: this.childKey,
      primaryKey: this.setting.primaryKey,
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
    return this.columns.some((col) => this.IS_EDIT_COLUMN_TYPE.includes(col.type));
  }

  btnClick(btnItem, index, item, apis) {
    console.log('eo-table-pro:btnClick:', btnItem, index, item, apis);
    if (btnItem.click) {
      btnItem.click(item, index, apis);
      return;
    }
    if (btnItem.confirmFn) {
      btnItem.confirmFn(item, index, apis);
      return;
    }
    if (btnItem.fnName) {
      if (!apis[btnItem.fnName]) {
        console.error(`EO_ERROR: Can't find ${btnItem.fnName} function`);
        return;
      }
      switch (btnItem.fnName) {
        case 'insertRow': {
          apis[btnItem.fnName](index, 'down', false);
          break;
        }
        default: {
          apis[btnItem.fnName](index);
          break;
        }
      }
    }
  }

  screenAll() {
    this.isFullScreenStatus = !this.isFullScreenStatus;
    const domElem = document.getElementsByClassName(this.randomClass)[0];
    if (this.isFullScreenStatus) {
      if (!domElem.className.includes('eo-ng-table-full-screen')) {
        domElem.className += ' eo-ng-table-full-screen';
      }
    } else {
      domElem.className = domElem.className.replace(' eo-ng-table-full-screen', '');
    }
  }
  toggleColumnVisible($event: any, item?: any) {
    $event.stopPropagation();
    this.columnVisibleStatus[item.key] = !this.columnVisibleStatus[item.key];
    this.columnVisibleStatusChange.emit(this.columnVisibleStatus);
  }
  checkAdd(item) {
    return true;
  }
  //* Use pro custom template to generate icon btn
  private needCustomTempalte(btn) {
    if (btn.type === 'dropdown' || btn.icon || this.BTN_TYPE_NEED_CUSTOMER.includes(btn.action)) {
      return true;
    }
    return false;
  }
  private onColumnChanges() {
    this.nzScroll = Object.assign({ x: this.columns.length * 100 }, this.nzScroll);
    this.setting.isEdit = this.autoSetIsEdit();
    this.generateBtnTemplate();
    //SetTimeout be sure the icon child template ready
    setTimeout(() => {
      this.initConfig();
    }, 0);
  }
  private initConfig() {
    const theaderConf = [];
    const tbodyConf = [];
    let tmpIndex = 0;
    //Set level
    if (this.setting.isLevel) {
      if (!this.setting.primaryKey) {
        throw new Error('EO_ERROR[eo-table-pro]: Lack of primaryKey');
      }
    }

    //Set RowSortable
    if (this.setting.rowSortable) {
      theaderConf.push({
        width: 25,
      });
      tbodyConf.push({
        type: 'sort',
      });
    }
    //Set ColumnVisible
    this.setting.toolButton = this.setting.toolButton || {};
    if (!_.has(this.setting.toolButton, 'columnVisible')) {
      this.setting.toolButton.columnVisible = this.columns.length >= 6 ? true : false;
    }
    this.columns.forEach((col) => {
      const colID = col.id || col.key;
      //Set component
      const header = omitBy(
        { title: col.title, left: col.left, right: col.right, resizeable: col.resizeable },
        isUndefined
      );
      const body: any = omitBy(
        { key: col.slot || col.key, left: col.left, type: col.type, right: col.right, errorTip: col.errorTip },
        isUndefined
      );
      switch (col.type) {
        case 'select': {
          body.opts = col.enums.map((item) => ({ label: item.title, value: item.value }));
          break;
        }
        case 'checkbox': {
          header.type = 'checkbox';
          body.type = 'checkbox';
          break;
        }
        case 'inputNumber': {
          body.keyName = col.key;
          body.key = this.numberInput;
          body.type = '';
          body.placeholder = col.placeholder || col.title || '';
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
          //Disable resizeable prevent x-scroll bar
          header.resizeable = false;
          body.type = 'btn';
          body.btns = col.btns.map((btn) => {
            const defaultBtn = this.TABLE_DEFAULT_BTN[btn.action];
            const newBtn: any = omitBy({ icon: btn.icon, click: btn.click, type: btn.type }, isUndefined);
            //Use custom btn template
            if (this.needCustomTempalte(btn)) {
              newBtn.title = this.iconBtnTmp.get(tmpIndex++);
            } else {
              //User eo-ng-table defualt icon template
              newBtn.icon = btn.icon || defaultBtn?.icon;
              newBtn.title = btn.title || defaultBtn?.title;
              if (defaultBtn) {
                newBtn.action = defaultBtn.fnName;
              }
            }
            switch (btn.type) {
              case 'dropdown': {
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
      if (col.type === 'btnList') {
        header.width = col.width || body.btns.length * 20 + 50;
      } else if (col.width) {
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

      if (col.showFn) {
        body.showFn = header.showFn = col.showFn;
      }
      if (col.columnVisible !== 'fixed' && col.type !== 'btnList') {
        this.columnVisibleStatus[colID] = col.columnVisible === false ? 0 : 1;
        this.columnVisibleMenus.push({
          title: col.title,
          key: colID,
          checked: this.columnVisibleStatus[colID],
        });
        if (!col.showFn) {
          body.showFn = header.showFn = (item) => this.columnVisibleStatus[colID];
        }
      }

      theaderConf.push(header);
      tbodyConf.push(body);
    });
    this.theadConf = theaderConf;
    this.tbodyConf = tbodyConf;
    // console.log(this.theadConf, this.tbodyConf);
  }
  private deleteButtonShowFn(item, index, apis) {
    //The last row can't be deleted
    return item.level !== 0 || !apis.checkIsCurrentLevelLastItem(item);
  }
  private generateBtnTemplate() {
    this.iconBtns=[];
    this.columns.forEach((col, index) => {
      if (col.type !== 'btnList') {
        return;
      }
      //Operate btnList
      col.btns.forEach((btn) => {
        if (!this.needCustomTempalte(btn)) {
          return;
        }
        //Use eo-ng-table default template
        const iconBtn: any = omitBy(
          {
            action: btn.action,
            showFn: btn.showFn,
            confirm: btn.confirm,
            click: btn.click,
            confirmFn: btn.confirmFn,
            confirmTitle: btn.confirmTitles,
          },
          isUndefined
        );
        if (btn.icon) {
          iconBtn.icon = btn.icon;
        }
        if (btn.action === 'delete') {
          iconBtn.showFn = iconBtn.showFn || this.deleteButtonShowFn;
        }
        const defaultBtn = this.TABLE_DEFAULT_BTN[btn.action];

        iconBtn.icon = btn.icon || defaultBtn?.icon;
        iconBtn.title = btn.title || defaultBtn?.title;
        if (btn.confirm) {
          iconBtn.confirmTitle = btn.confirmTitle || defaultBtn?.confirmTitle;
        }
        if (defaultBtn) {
          iconBtn.fnName = defaultBtn.fnName;
        }
        this.iconBtns.push(iconBtn);
      });
    });
  }
}
