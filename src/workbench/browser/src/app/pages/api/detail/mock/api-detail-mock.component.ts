import { Component, Input, OnChanges } from '@angular/core';
import { ApiEditMock } from 'eo/platform/browser/IndexedDB';
import { ApiDetailService } from '../api-detail.service';
@Component({
  selector: 'eo-api-detail-mock',
  templateUrl: './api-detail-mock.component.html',
  styleUrls: ['./api-detail-mock.component.scss'],
})
export class ApiDetailMockComponent implements OnChanges {
  @Input() model: ApiEditMock[] = [];
  @Input() mockList = [];
  listConf: object = {};
  isVisible = false;
  mockListColumns = [
    { title: '名称', key: 'name' },
    { title: 'URL', slot: 'url' },
    { title: '', slot: 'action', width: '15%' },
  ];
  constructor(private detailService: ApiDetailService) {}

  ngOnChanges(changes) {
    // if (changes.model&&!changes.model.previousValue&&changes.model.currentValue) {
    //   this.model.push(Object.assign({}, this.itemStructure));
    // }
  }

  handleEditMockItem(index: number) {}
  handleDeleteMockItem(index: number) {}
}
