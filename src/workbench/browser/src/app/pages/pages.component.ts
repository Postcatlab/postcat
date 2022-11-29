import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';

@Component({
  selector: 'eo-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  model = [
    {
      status: 'solved',
      description: 'i am input text',
      type: 'string',
    },
    {
      status: 'pending',
      description: '',
      type: 'number',
    },
  ];
  setting = {
    columnResizable: true, //可改变列宽
    rowSortable: true, //可拖动排序行，默认 false
    isLevel: true, //树
    id: 'EO_TABLE_PRO', //[string]储存 ID，用于储存列表项，拖动距离
    primaryKey: 'description', //主键
    toolButton: {
      fullScreen: true, //是否可以全屏
      columnVisible: true, //列表项配置,默认 true
    }, //[false|object]
  };
  columns = [
    {
      title: '输入框',
      type: 'input',
      key: 'description', //单元格值对应的字段键
      placeholder: '请输入...',
      columnShow: 'fixed', //['fixed'|boolean]固定显示，不能被列表项操作,默认 true
      errorTip: '这是错误提示', //string | TemplateRef<void>
    },
    {
      title: '类型',
      id: 'select', //没填默认用 key 字段值作为 id，批量操作/拖动宽度使用
      key: 'type',
      width: 150,
      type: 'select', //默认 Text/checkbox/sort/input/btn/autoComplete
      filterable: true,
      columnShow: false,
      enums: [
        { title: 'string', value: 'string' },
        { title: 'number', value: 'number' },
      ], //筛选项&渲染
      filterFn: true, //不传或 true 则使用自定义过滤函数
    },
    {
      title: '状态',
      type: 'text', //默认 Text/checkbox/sort/input/btn/autoComplete
      key: 'status',
      width: 150,
      sortable: true, //排序
      filterable: true,
      enums: [
        { title: '已解决', value: 'solved', class: 'text-black' },
        { title: '处理中', value: 'pending' },
      ], //筛选项&渲染
      filterFn: (selected: string[], item: any) => selected.includes(item.data.type), //自定义 filterFun
    },
    {
      type: 'btnList',
      width: 170,
      resizeable: false, //如果 setting.columnResizable 为 true，默认 true
      right: true, //是否固定在右边
      btns: [
        {
          action: 'insert', //insert|add|addChild|delete
        },
        {
          action: 'addChild',
        },
        {
          icon: 'more',
          click: (item) => {
            console.log('more', item);
          },
        },
        {
          action: 'delete',
        },
        {
          type: 'dropdown',
          icon: 'list',
          menus: [
            {
              title: '编辑',
              click: (item) => {
                console.log('编辑', item);
              },
            },
            {
              title: '删除',
              click: () => {
                console.log('删除');
              },
            },
          ],
        },
      ],
    },
  ];
  fn() {
    console.log('fn works');
  }
  isShowNotification;
  constructor(public electron: ElectronService) {
    this.isShowNotification = false;
  }
  ngOnInit(): void {}
}
