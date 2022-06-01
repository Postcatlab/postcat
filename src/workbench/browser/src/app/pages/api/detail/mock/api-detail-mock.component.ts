import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ApiEditBody, ApiEditMock } from 'eo/platform/browser/IndexedDB';
import { ApiDetailService } from '../api-detail.service';
@Component({
  selector: 'eo-api-detail-mock',
  templateUrl: './api-detail-mock.component.html',
  styleUrls: ['./api-detail-mock.component.scss'],
})
export class ApiDetailMockComponent implements OnInit, OnChanges {
  @Input() model: ApiEditMock[];
  listConf: object = {};
  isVisible = false;
  mockListColumns = [
    { title: '名称', key: 'name' },
    { title: 'URL', slot: 'url' },
    { title: '', slot: 'action', width: '15%' },
  ];
  mockList = [];
  constructor(private detailService: ApiDetailService) {}

  ngOnInit(): void {
    this.mockList = [
      {
        name: '默认mock',
        url: 'http://localhost:3040/weather/cloud',
      },
      {
        name: '自定义mock',
        url: 'http://localhost:3040/weather/windcss',
      },
    ];
  }
  ngOnChanges(changes) {
    // if (changes.model&&!changes.model.previousValue&&changes.model.currentValue) {
    //   this.model.push(Object.assign({}, this.itemStructure));
    // }
  }

  handleEditMockItem(index: number) {}
  handleDeleteMockItem(index: number) {}
}
