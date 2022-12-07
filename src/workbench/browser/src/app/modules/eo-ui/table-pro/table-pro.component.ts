import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import _, { attempt, has } from 'lodash-es';
import { isUndefined, omitBy } from 'lodash-es';
import { eoDeepCopy } from '../../../utils/index.utils';
import { filterTableData } from '../../../utils/tree/tree.utils';
import { ColumnItem, IconBtn, TableProSetting } from './table-pro.model';
import { TableProConfig, TABLE_PRO_CONFIG, TABLE_PRO_DEFUALT_CONFIG } from './table-pro.token';
@Component({
  selector: 'eo-ng-table-pro',
  templateUrl: './table-pro.component.html',
  styleUrls: ['./table-pro.component.scss'],
})
export class EoTableProComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() columns: ColumnItem[];
  @Input() nzData;
  @Input() setting: TableProSetting = {};
  @Input() nzDataItem?;
  @Input() nzScroll = {};
  @Input() nzExpand = false;
  @Input() columnVisibleStatus = {};

  @Input() nzCheckAddRow;
  @Input() nzDragCheck;

  @Input() nzTrClick: (...rest: any[]) => void;
  @Output() nzDataChange = new EventEmitter();
  @Output() columnVisibleStatusChange = new EventEmitter();

  @ViewChild('enums', { read: TemplateRef })
  enums: TemplateRef<HTMLDivElement>;

  private BTN_TYPE_NEED_CUSTOMER = ['delete', 'insert', 'edit'];
  //Default buttom template match action
  private TABLE_DEFAULT_BTN: { [key: string]: Partial<IconBtn> } = {
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
  iconBtns: IconBtn[] = [];

  //Generate By iconBtns
  @ViewChildren('iconBtnTmp', { read: TemplateRef })
  iconBtnTmp: QueryList<TemplateRef<HTMLButtonElement>>;

  columnVisibleMenus = [];
  @ViewChild('toolBtnTmp', { read: TemplateRef })
  toolBtnTmp: TemplateRef<HTMLDivElement>;

  @ViewChild('numberInput', { read: TemplateRef })
  numberInput: TemplateRef<HTMLInputElement>;

  tbodyConf = [];
  theadConf = [];

  randomClass = `full-screen-container_${Date.now()}`;

  private isFullScreenStatus = false;
  private IS_EDIT_COLUMN_TYPE = ['select', 'checkbox', 'autoComplete', 'input', 'inputNumber'];
  private COLUMN_VISIBLE_KEY: string;
  //Default Table unique ID
  private DEFAULT_ID: string;
  private showItems = [];
  constructor(
    private cdRef: ChangeDetectorRef,
    private elRef: ElementRef,
    @Inject(TABLE_PRO_CONFIG) public CONFIG: TableProConfig
  ) {
    this.CONFIG = Object.assign(eoDeepCopy(TABLE_PRO_DEFUALT_CONFIG), this.CONFIG);
  }
  ngOnInit(): void {
    this.DEFAULT_ID = `${window.location.pathname}_${
      this.elRef.nativeElement?.parentElement?.localName || this.columns?.length
    }`;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.columns?.currentValue?.length) {
      this.onColumnChanges();
    }
    if (changes.nzData) {
      if (this.setting.isEdit && !this.setting.manualAdd) {
        if (!this.nzData) {
          return;
        }
        if (!this.nzDataItem || !this.setting.primaryKey) {
          console.error(`EO_ERROR: Please add nzDataItem and setting.primaryKey`);
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
      childKey: this.CONFIG.childKey,
      primaryKey: this.setting.primaryKey,
    });
  }
  ngAfterViewInit() {}
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
  toggleColumnVisible(item: { key: string }, $event?: Event) {
    $event?.stopPropagation();
    this.columnVisibleStatus[item.key] = !this.columnVisibleStatus[item.key];
    this.columnVisibleStatusChange.emit(this.columnVisibleStatus);
    window.localStorage.setItem(this.COLUMN_VISIBLE_KEY, JSON.stringify(this.columnVisibleStatus));
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
    Promise.resolve().then(() => {
      this.initConfig();
    });
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
    if (this.setting.rowSortable && this.columns[0].type !== 'sort') {
      theaderConf.push({
        resizeable: false,
        width: this.columns.length * 5,
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
    if (this.setting.toolButton.columnVisible) {
      if (!this.setting.id) {
        console.warn(`EO_WARN[eo-table-pro]: Lack of setting.id, the storage key for table columnVisible may repeat!`);
      }
      this.COLUMN_VISIBLE_KEY = this.setting.id || `TABLE_COLUMN_VISIBLE_${this.DEFAULT_ID}`;
      this.columnVisibleStatus = attempt(() => JSON.parse(window.localStorage.getItem(this.COLUMN_VISIBLE_KEY))) || {};
    }

    //Set columns
    this.columns.forEach((col: ColumnItem) => {
      const colID = col.key;
      //Set component
      const header = omitBy(
        { title: col.title, left: col.left, right: col.right, resizeable: col.resizeable },
        isUndefined
      );
      const body: any = omitBy(
        {
          key: col.key,
          title: col.slot,
          left: col.left,
          type: col.type,
          right: col.right,
          errorTip: col.errorTip,
          disabledFn: col.disabledFn,
        },
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
            const newBtn: any = omitBy({ icon: btn.icon, click: btn.click, type: btn.type }, isUndefined) as IconBtn;
            //Use custom btn template
            if (this.needCustomTempalte(btn)) {
              newBtn.title = this.iconBtnTmp?.get(tmpIndex++);
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
          console.warn(`[EO_WARN]: editable table use filterable may perform badly`);
        }
        header.filterMultiple = true;
        //Use custom filter
        if (!col.filterFn || col.filterFn === true) {
          if (this.setting.isLevel) {
            header.filterFn = (selected: string[], inItem: any) => {
              //First loop get all show item
              if (inItem.data.eoKey === this.nzData[0].eoKey) {
                this.showItems = [];
                const findNode = (arr): boolean => {
                  let hasFind = false;
                  arr.forEach((item) => {
                    if (selected.includes(item[col.key])) {
                      this.showItems.push(item.eoKey);
                      hasFind = true;
                    }
                    if (item[this.CONFIG.childKey]?.length) {
                      const chidHasFind = findNode(item[this.CONFIG.childKey]);
                      if (chidHasFind) {
                        if (!hasFind) {
                          this.showItems.push(item.eoKey);
                        }
                        hasFind = true;
                      }
                    }
                  });
                  return hasFind;
                };
                findNode(this.nzData);
              }
              if (this.showItems.includes(inItem.data.eoKey)) {
                return true;
              }
              return false;
            };
          } else {
            header.filterFn = (selected: string[], item: any) => selected.includes(item.data[col.key]);
          }
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
        //If not storage,use default to set column visible status
        if (!has(this.columnVisibleStatus, colID)) {
          this.columnVisibleStatus[colID] = col.columnVisible === false ? false : true;
        }
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
    this.iconBtns = [];
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
        const iconBtn: IconBtn = omitBy(
          {
            action: btn.action,
            showFn: btn.showFn,
            confirm: btn.confirm,
            click: btn.click,
            confirmFn: btn.confirmFn,
            confirmTitle: btn.confirmTitle,
          },
          isUndefined
        ) as IconBtn;
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
