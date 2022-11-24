import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ApiTestHeaders } from '../../../pages/api/service/api-test/api-test.model';
import { ApiTestUtilService } from '../../../pages/api/http/test/api-test-util.service';
@Component({
  selector: 'eo-api-test-header',
  templateUrl: './api-test-header.component.html',
  styleUrls: ['./api-test-header.component.scss'],
})
export class ApiTestHeaderComponent implements OnInit, OnChanges,OnDestroy {
  @Input() disabled: boolean;
  @Input() model: ApiTestHeaders[];
  @Output() modelChange: EventEmitter<any> = new EventEmitter();

  listConf: object = {};
  table1: any = {
    formDataThead: [
      {
        title: '',
        width: '30px',
      },
      {
        title: '参数名',
        key: 'paramKey',
        width: '250px',
        showSort: true,
        resizeable: true,
      },
      {
        title: '类型',
        showFn: () => this.table1.listShowRef.paramType,
        width: '250px',
        resizeable: true,
      },

      {
        type: 'checkbox',
        showFn: () => this.table1.listShowRef.paramNotNull,
      },
      {
        title: '必填',
        key: 'paramNotNull',
        width: '60px',
        showSort: true,
        showFn: () => this.table1.listShowRef.paramNotNull,
        resizeable: true,
      },
      {
        title: '说明',
        width: '250px',
        showFn: () => this.table1.listShowRef.paramValue,
        resizeable: true,
      },
      {
        title: '属性值',
        width: '250px',
        showFn: () => this.table1.listShowRef.attribute,
        resizeable: true,
      },
      {
        title: '操作',
        right: true,
      },
    ],
    formDataTbody: [
      {
        type: 'sort',
      },
      {
        key: 'paramKey',
        type: 'input',
        placeholder: '参数名',
      },
      {
        key: 'paramType',
        type: 'select',
        showFn: (item: any) => this.table1.listShowRef.paramType && item.paramKey,
        opts: [
          {
            value: '0',
            label: '[string]',
          },
          {
            value: '1',
            label: '[file]',
          },
          {
            value: '2',
            label: '[json]',
          },
          {
            value: '3',
            label: '[int]',
          },
          {
            value: '4',
            label: '[float]',
          },
          {
            value: '5',
            label: '[double]',
          },
          {
            value: '6',
            label: '[date]',
          },
          {
            value: '7',
            label: '[datetime]',
          },
          {
            value: '8',
            label: '[boolean]',
          },
          {
            value: '9',
            label: '[byte]',
          },
          {
            value: '10',
            label: '[short]',
          },
          {
            value: '11',
            label: '[long]',
          },
          {
            value: '12',
            label: '[array]',
          },
          {
            value: '13',
            label: '[object]',
          },
          {
            value: '14',
            label: '[number]',
          },
          {
            value: '15',
            label: '[null]',
          },
          {
            value: 'char',
            label: '[char]',
          },
        ],
      },
      {
        key: 'paramNotNull',
        type: 'checkbox',
        colspan: 2,
        valueRef: {
          true: '0',
          false: '1',
        },
        showFn: (item: any) => this.table1.listShowRef.paramNotNull && !!item.paramKey,
        click: (item: any, checked: boolean) => {
          if (item?.childList?.length) {
            const r = confirm(checked ? '是否确认勾选此层级下的所有子级' : '是否确认取消勾选此层级下的所有子级');
            if (r == true) {
              this.loopSetChecked(item, checked);
              return item;
            }
          }
        },
      },
      {
        key: 'paramValue',
        type: 'input',
        placeholder: '参数说明',
        showFn: (item: any) => this.table1.listShowRef.paramValue && !!item.paramKey,
      },

      {
        key: 'attribute',
        type: 'input',
        placeholder: '属性值',
        showFn: (item: any) => this.table1.listShowRef.attribute && !!item.paramKey,
      },
      {
        type: 'btn',
        right: true,
        showFn: (item: any) => !!item.paramKey,
        btns: [
          {
            type: 'addChild',
            title: '添加子字段',
          },
          {
            title: '更多设置',
            click: (item: any) => {
              item.paramKey = '这是更多设置';
              alert('更多设置');
            },
          },
          {
            type: 'add',
            title: '插入',
          },
          {
            type: 'delete',
            title: '删除',
          },
        ],
      },
      {
        type: 'btn',
        showFn: (item: any) => !item.paramKey,
        seColspan: (item: any) => {
          if (!item.paramKey) {
            let colspan = 1;
            for (const key in this.table1.listShowRef) {
              if (this.table1.listShowRef[key]) {
                colspan++;
              }
            }
            return colspan;
          }
          return 1;
        },
        btns: [
          {
            title: '引用现有的数据结构',
            click: (item: any) => {
              alert('添加数据结构');
            },
          },
          {
            title: '引用 Database Builder 数据库中的字段',
            click: (item: any) => {
              alert('引用 Database Builder 数据库中的字段');
            },
          },
        ],
      },
      {
        type: 'btn',
        right: true,
        showFn: (item: any) => {
          let colspan = 0;
          for (const key in this.table1.listShowRef) {
            if (this.table1.listShowRef[key]) {
              colspan++;
            }
          }
          return !item.paramKey && colspan;
        },
      },
    ],
    formData: [
      {
        paramNotNull: '0',
        paramType: '13',
        paramValue: '根目录',
        paramKey: 'root',
        paramName: '',
        paramLimit: '',
        paramNote: '',
        disabled: true,
        paramValueList: [],
        default: 0,
        attribute: 'attr="eo"',
        childList: [
          {
            paramNotNull: '1',
            paramType: '0',
            paramName: '',
            paramKey: 'a',
            paramValue: '',
            paramLimit: '',
            paramNote: '',
            paramValueList: [],
            default: 0,
            childList: [],
          },
          {
            paramNotNull: '1',
            paramType: '0',
            paramName: '',
            paramKey: 'b',
            paramValue: '',
            paramLimit: '',
            paramNote: '',
            paramValueList: [],
            default: 0,
            childList: [],
          },
          {
            paramNotNull: '0',
            paramType: '13',
            paramName: '',
            paramKey: 'c',
            paramValue: '',
            paramLimit: '',
            paramNote: '',
            paramValueList: [],
            default: 0,
            childList: [
              {
                paramNotNull: '0',
                paramType: '13',
                paramName: '',
                paramKey: 'c-a',
                paramValue: '',
                paramLimit: '',
                paramNote: '',
                paramValueList: [],
                default: 0,
                childList: [
                  {
                    paramNotNull: '1',
                    paramType: '0',
                    paramName: '',
                    paramKey: 'c-a-a',
                    paramValue: '',
                    paramLimit: '',
                    paramNote: '',
                    paramValueList: [],
                    default: 0,
                    childList: [],
                  },
                  {
                    paramNotNull: '1',
                    paramType: '13',
                    paramName: '',
                    paramKey: 'c-a-b',
                    paramValue: '',
                    paramLimit: '',
                    paramNote: '',
                    paramValueList: [],
                    default: 0,
                    childList: [
                      {
                        paramNotNull: '1',
                        paramType: '0',
                        paramName: '',
                        paramKey: 'c-a-b-a',
                        paramValue: '',
                        paramLimit: '',
                        paramNote: '',
                        paramValueList: [],
                        default: 0,
                        childList: [],
                      },
                    ],
                  },
                ],
              },
              {
                paramNotNull: '0',
                paramType: '0',
                paramName: '',
                paramKey: 'c-b',
                paramValue: '',
                paramLimit: '',
                paramNote: '',
                paramValueList: [],
                default: 0,
                childList: [],
              },
            ],
          },
        ],
      },
    ],
    paramItem: {
      paramNotNull: true,
      paramType: '0',
      paramName: '',
      paramKey: '',
      paramValue: '',
      paramLimit: '',
      paramNote: '',
      paramValueList: [],
      default: 0,
    },
    listShowRef: {
      paramType: true,
      attribute: true,
      paramValue: true,
      paramNotNull: true,
    },
    checkAdd: (item: any) => {
      if (item.disabled) {
        return false;
      }
      return true;
    },
  };
  private modelChange$: Subject<void> = new Subject();
  private destroy$: Subject<void> = new Subject();
  private itemStructure: ApiTestHeaders = {
    required: true,
    name: '',
    value: '',
  };
  constructor(private editService: ApiTestUtilService) {
    this.modelChange$.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe(() => {
      this.modelChange.emit(this.model);
    });
  }

  ngOnInit(): void {
    this.initListConf();
  }
  ngOnChanges(changes) {
    if (changes.model) {
      const currentVal = changes.model.currentValue;
      if (currentVal && (!currentVal.length || (currentVal.length && currentVal[currentVal.length - 1].name))) {
        this.model.push(Object.assign({}, this.itemStructure));
      }
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private loopSetChecked(data, checked: boolean) {
    data.paramNotNull = checked ? '0' : '1';
    if (data.childList) {
      data.childList.forEach((item: any) => {
        this.loopSetChecked(item, checked);
      });
    }
  }
  private initListConf() {
    this.listConf = this.editService.initListConf({
      dragCacheVar: 'DRAG_VAR_API_HEADER',
      itemStructure: this.itemStructure,
      title: $localize`:@@Header:Header`,
      nameTitle: $localize`Key`,
      valueTitle: $localize`Value`,
      watchFormLastChange: () => {
        this.modelChange$.next();
      },
    });
  }
}
