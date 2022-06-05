import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ApiEditBody, ApiEditMock } from 'eo/platform/browser/IndexedDB';

@Component({
  selector: 'eo-api-edit-mock',
  templateUrl: './api-edit-mock.component.html',
  styleUrls: ['./api-edit-mock.component.scss'],
})
export class ApiEditMockComponent implements OnInit, OnChanges {
  @Input() mockList: ApiEditMock[];
  listConf: object = {};
  isVisible = false;
  mockListColumns = [
    { title: '名称', key: 'name' },
    { title: 'URL', slot: 'url' },
    { title: '', slot: 'action', width: '15%' },
  ];
  /** 当前被编辑的mock */
  currentEditMock: ApiEditMock;
  constructor() {}

  ngOnInit(): void {
    this.mockList = [
      {
        name: '默认mock',
        url: 'http://localhost:3040/weather/cloud',
        response: '{}',
      },
      {
        name: '自定义mock',
        url: 'http://localhost:3040/weather/windcss',
        response: '{}',
      },
    ];
  }
  ngOnChanges(changes) {
    // if (changes.model&&!changes.model.previousValue&&changes.model.currentValue) {
    //   this.model.push(Object.assign({}, this.itemStructure));
    // }
  }

  handleEditMockItem(mock: ApiEditMock) {
    this.currentEditMock = mock;
    this.isVisible = true;
  }
  handleDeleteMockItem(index: number) {}
  handleSave() {
    this.isVisible = false;
  }
  handleCancel() {
    this.isVisible = false;
  }
}
