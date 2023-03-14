import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import _, { attempt, has, isUndefined, omitBy } from 'lodash-es';

import { eoDeepCopy } from '../../../shared/utils/index.utils';
import StorageUtil from '../../../shared/utils/storage/storage.utils';
import { filterTableData, generateQuoteKeyValue, getTreeTotalCount } from '../../../shared/utils/tree/tree.utils';
import { ColumnItem, IconBtn, TableProSetting } from './table-pro.model';
import { TableProConfig, TABLE_PRO_CONFIG, TABLE_PRO_DEFUALT_CONFIG } from './table-pro.token';
@Component({
  selector: 'eo-ng-table-pro',
  templateUrl: './table-pro.component.html',
  styleUrls: ['./table-pro.component.scss']
})
export class EoTableProComponent implements OnInit, OnChanges {
  @Input() columns: ColumnItem[];
  @Input() nzData;
  @Input() setting: TableProSetting = {};
  @Input() nzDataItem?;
  @Input() nzScroll: { x?: string; y?: string } = {};
  /**
   * Expand tree data when init dom
   */
  @Input() nzExpand = true;
  @Input() columnVisibleStatus = {};

  @Input() nzCheckAddRow;
  @Input() nzCheckAddChild;
  @Input() nzDragCheck;

  @Input() nzTrClick: (...rest: any[]) => void;
  @Output() readonly nzDataChange = new EventEmitter();
  @Output() readonly columnVisibleStatusChange = new EventEmitter();

  @ViewChild('enumsTmp', { read: TemplateRef }) enumsTmp: TemplateRef<HTMLDivElement>;

  private BTN_TYPE_NEED_CUSTOMER = ['delete', 'insert', 'edit', 'addChild'];
  //Default buttom template match action
  private TABLE_DEFAULT_BTN: { [key: string]: Partial<IconBtn> };
  iconBtns: IconBtn[] = [];

  //Generate By iconBtns
  @ViewChildren('iconBtnTmp', { read: TemplateRef }) iconBtnTmp: QueryList<TemplateRef<HTMLButtonElement>>;

  columnVisibleMenus = [];
  @ViewChild('toolBtnTmp', { read: TemplateRef }) toolBtnTmp: TemplateRef<HTMLDivElement>;

  @ViewChild('numberInput', { read: TemplateRef }) numberInput: TemplateRef<HTMLInputElement>;

  tbodyConf = [];
  theadConf = [];

  randomClass = `full-screen-container_${Date.now()}`;

  private isFullScreenStatus = false;
  private IS_EDIT_COLUMN_TYPE = ['select', 'checkbox', 'autoComplete', 'input', 'inputNumber'];
  private COLUMN_VISIBLE_KEY: string;

  private COLUMN_WIDTH_KEY: string;

  //Default Table unique ID
  private DEFAULT_ID: string;
  private showItems = [];
  // private COLUMN_;
  constructor(private elRef: ElementRef, @Inject(TABLE_PRO_CONFIG) public tableConfig: TableProConfig) {
    this.tableConfig = Object.assign(eoDeepCopy(TABLE_PRO_DEFUALT_CONFIG), this.tableConfig);
    this.TABLE_DEFAULT_BTN = {
      add: {
        icon: this.tableConfig.btnAddChildRowIcon,
        title: this.tableConfig.btnAddRowTitle,
        //eo-ng-table fun action
        fnName: 'add'
      },
      addChild: {
        icon: this.tableConfig.btnAddChildRowIcon,
        title: this.tableConfig.btnAddChildRowTitle,
        fnName: 'addChildRow'
      },
      insert: {
        icon: this.tableConfig.btnInsertRowIcon,
        title: this.tableConfig.btnInsertRowTitle,
        fnName: 'insertRow'
      },
      edit: {
        icon: this.tableConfig.btnEditRowIcon,
        title: this.tableConfig.btnEditRowTitle
      },
      delete: {
        icon: this.tableConfig.btnDeleteRowIcon,
        title: this.tableConfig.btnDeleteRowTitle,
        fnName: 'deleteRow',
        confirmTitle: this.tableConfig.btnDeleteRowConfirmTitle
      }
    };
  }
  ngOnInit(): void {
    this.DEFAULT_ID = `${window.location.pathname}_${this.elRef.nativeElement?.parentElement?.localName || this.columns?.length}`;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.columns?.currentValue?.length) {
      this.onColumnChanges();
    }
    if (changes.nzData) {
      if (getTreeTotalCount(this.nzData) > 100) {
        this.nzExpand = false;
      }
      if (this.setting.isEdit && !this.setting.manualAdd) {
        if (!this.nzData) {
          return;
        }
        if (!(this.nzDataItem && this.setting.primaryKey)) {
          pcConsole.error('Please add nzDataItem and setting.primaryKey');
          return;
        }
        if (!this.nzData.length || this.nzData[this.nzData.length - 1][this.setting.primaryKey]) {
          this.nzData.push(eoDeepCopy(this.nzDataItem));
        }
      }
      const hasQuoteKey = this.columns.some(col => col.key?.includes('.'));
      if (hasQuoteKey && !this.setting.isEdit) {
        const chains = this.columns
          .filter(col => col.key?.includes('.'))
          .map(val => {
            const arr = val.key.split('.');
            const valResult = {
              arr,
              str: val.key,
              name: arr.at(-1)
            };
            return valResult;
          });
        this.nzData = generateQuoteKeyValue(chains, this.nzData, {
          childKey: this.tableConfig.childKey
        });
      }
    }
  }
  getPureNzData() {
    if (!this.nzData) {
      return;
    }
    return filterTableData(this.nzData, {
      childKey: this.tableConfig.childKey,
      primaryKey: this.setting.primaryKey
    });
  }
  handleDataChange(data) {
    this.nzDataChange.emit(data);
  }
  autoSetIsEdit() {
    if (_.has(this.setting, 'isEdit')) {
      return this.setting.isEdit;
    }
    return this.columns.some(col => this.IS_EDIT_COLUMN_TYPE.includes(col.type));
  }

  btnClick(btnItem, index, item, apis) {
    // console.log('eo-table-pro:btnClick:', btnItem, index, item, apis);
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
        pcConsole.error(`[eo-table-pro]: Can't find ${btnItem.fnName} function`);
        return;
      }
      switch (btnItem.fnName) {
        case 'insertRow': {
          apis.insertRow(index, 'down', false);
          break;
        }
        case 'addChildRow': {
          this.nzCheckAddChild?.(item, index);
          apis[btnItem.fnName](index);
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
    // this.nzScroll = { x: this.nzScroll.x, y: `${document.body.clientHeight + 400}px` };
    // console.log(this.nzScroll);
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
  toggleColumnVisible(item: { key: string; checked: boolean }, $event?: Event) {
    $event?.stopPropagation();
    item.checked = this.columnVisibleStatus[item.key] = !this.columnVisibleStatus[item.key];

    this.columnVisibleStatusChange.emit(this.columnVisibleStatus);
    window.localStorage.setItem(this.COLUMN_VISIBLE_KEY, JSON.stringify(this.columnVisibleStatus));
  }

  /**
   * Remeber coloum size after resize
   */
  nzResizeColumn(tableList) {
    //* If the first column is sortable, the first column will be removed from the tableList
    if (this.setting.rowSortable && this.columns[0].type !== 'sort') {
      tableList = tableList.slice(1);
    }
    const widthByKey = {};
    this.columns.forEach((val, key) => {
      const headerCol = tableList.find(col => col.title === val.title || col.key === val.key) || tableList[key];
      if (headerCol.width) {
        widthByKey[val.key || key] = headerCol.width;
      }
    });
    StorageUtil.set(this.COLUMN_WIDTH_KEY, widthByKey);
  }
  //* Use pro custom template to generate icon btn
  private needCustomTempalte(btn) {
    if (btn.type === 'dropdown' || btn.icon || this.BTN_TYPE_NEED_CUSTOMER.includes(btn.action)) {
      return true;
    }
    return false;
  }
  private onColumnChanges() {
    this.nzScroll = { x: `${this.columns.length * 100}px`, ...this.nzScroll };
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
        throw new Error('EO_ERROR[eo-table-pro]: Lack of primaryKey, please add it in setting!');
      }
    }
    //Set ColumnVisible
    this.initColumnVisible();

    //Set RowSortable
    if (this.setting.rowSortable && this.columns[0].type !== 'sort') {
      theaderConf.push({
        resizeable: false,
        width: 40
      });
      tbodyConf.push({
        type: 'sort'
      });
    }

    //Set columns width
    this.initColumnWidth();

    //Set columns
    this.columns.forEach((col: ColumnItem) => {
      const colID = col.key;
      //Set component
      const header = omitBy({ title: col.title, left: col.left, right: col.right, resizeable: col.resizeable }, isUndefined);
      const body: any = omitBy(
        {
          key: col.key,
          title: col.slot,
          maxlength: col.maxlength,
          left: col.left,
          change: col.change,
          //Slot priority higher than type
          type: col.slot ? null : col.type,
          right: col.right,
          errorTip: col.errorTip,
          disabledFn: col.disabledFn
        },
        isUndefined
      );
      switch (col.type) {
        case 'select': {
          body.opts = col.enums.map(item => ({ label: item.title, value: item.value }));
          break;
        }
        case 'autoComplete': {
          body.opts = col.enums;
          break;
        }
        case 'checkbox': {
          header.type = 'checkbox';
          body.type = 'checkbox';
          if (col.enums?.length) {
            body.valueRef = {
              true: col.enums[0].value,
              false: col.enums[1].value
            };
          }
          break;
        }
        case 'inputNumber': {
          body.keyName = col.key;
          body.key = this.numberInput;
          body.type = '';
          break;
        }
        case 'input': {
          break;
        }
        case 'btnList': {
          //Add toolBtn to btnList
          //TODO Add last when has two btnList
          header.title = this.toolBtnTmp;
          //Disable resizeable prevent x-scroll bar
          header.resizeable = false;
          body.type = 'btn';
          body.btns = col.btns.map(btn => {
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
          //Change value to enums text
          if (col.enums) {
            body.keyName = col.key;
            body.key = this.enumsTmp;
            body.enums = col.enums.reduce((a, v) => ({ ...a, [v.value]: { title: v.title, class: v.class } }), {});
          }
          break;
        }
      }
      //Set placeholder
      if (['autoComplete', 'inputNumber', 'input', 'autoComplete'].includes(col.type)) {
        body.placeholder = col.placeholder || (typeof col.title === 'string' ? col.title : '');
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
          pcConsole.warn('[eo-table-pro]: editable table use filterable may perform badly');
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
                  arr.forEach(item => {
                    if (selected.includes(item[col.key])) {
                      this.showItems.push(item.eoKey);
                      hasFind = true;
                    }
                    if (item[this.tableConfig.childKey]?.length) {
                      const chidHasFind = findNode(item[this.tableConfig.childKey]);
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
        header.filterOpts = col.enums.map(item => ({ text: item.title, value: item.value }));
      }
      //Set Sort
      if (col.sortable) {
        if (this.setting.isEdit) {
          pcConsole.warn('[eo-table-pro]: editable table use sortable may perform poorly');
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
          checked: this.columnVisibleStatus[colID]
        });
        if (!col.showFn) {
          body.showFn = header.showFn = item => this.columnVisibleStatus[colID];
        }
      }
      theaderConf.push(header);
      tbodyConf.push(body);
    });

    if (theaderConf.every(val => val.width)) {
      pcConsole.warn('[eo-table-pro]: all clumn item has set width,it will cause table width invalid,please rest');
    }

    this.theadConf = theaderConf;
    this.tbodyConf = tbodyConf;
    // pcConsole.log(this.theadConf, this.tbodyConf);
  }
  private initColumnWidth() {
    this.COLUMN_WIDTH_KEY = `TABLE_COLUMN_WIDTH_${this.setting.id || this.DEFAULT_ID}`;
    /**
     * Get column width from local storage
     */
    const columnWidth = StorageUtil.get(this.COLUMN_WIDTH_KEY);
    if (columnWidth) {
      this.columns.forEach((col, key) => {
        if (columnWidth[col.key || key]) {
          col.width = columnWidth[col.key];
        }
      });
    }
  }
  private initColumnVisible() {
    this.setting.toolButton = this.setting.toolButton || {};
    if (!_.has(this.setting.toolButton, 'columnVisible')) {
      this.setting.toolButton.columnVisible = this.columns.length >= 6 ? true : false;
    }
    if (this.setting.toolButton.columnVisible) {
      if (!this.setting.id) {
        pcConsole.warn('[eo-table-pro]: Lack of setting.id, the storage key for table columnVisible may repeat!');
      }
      this.COLUMN_VISIBLE_KEY = `TABLE_COLUMN_VISIBLE_${this.setting.id || this.DEFAULT_ID}`;
      this.columnVisibleStatus = attempt(() => JSON.parse(window.localStorage.getItem(this.COLUMN_VISIBLE_KEY))) || {};
    }
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
      col.btns.forEach(btn => {
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
            confirmTitle: btn.confirmTitle
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
