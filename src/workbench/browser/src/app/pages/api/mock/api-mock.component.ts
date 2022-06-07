import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ApiEditMock } from '../../../shared/services/storage/index.model';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'eo-api-edit-mock',
  templateUrl: './api-mock.component.html',
  styleUrls: ['./api-mock.component.scss'],
})
export class ApiMockComponent implements OnChanges {
  @Input() model: ApiEditMock[] = [];
  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  isVisible = false;
  mockUrl = window.eo?.getMockUrl?.();
  private $mocklList: ApiEditMock[] = [];
  get mocklList() {
    return this.$mocklList;
  }
  set mocklList(_) {
    this.$mocklList = this.model.map((item) => {
      const { pathname, search } = new URL(item.url, this.mockUrl);
      item.url = `${new URL(pathname + search, this.mockUrl)}`;
      return item;
    });
  }
  mockListColumns = [
    { title: '名称', key: 'name' },
    { title: 'URL', slot: 'url' },
    { title: '', slot: 'action', width: '15%' },
  ];
  /** 当前被编辑的mock */
  currentEditMock: ApiEditMock;
  /** 当前被编辑的mock索引 */
  currentEditMockIndex = -1;
  private destroy$: Subject<void> = new Subject<void>();
  private rawChange$: Subject<string> = new Subject<string>();
  constructor() {
    this.rawChange$.pipe(debounceTime(700), takeUntil(this.destroy$)).subscribe(() => {});
    this.mocklList = [...this.model];
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { model } = changes;

    if (model.currentValue) {
      this.mocklList = [...this.model];
    }
  }

  rawDataChange() {
    this.rawChange$.next(this.currentEditMock.response);
  }

  handleEditMockItem(index: number) {
    this.currentEditMock = { ...this.model[index] };
    this.currentEditMockIndex = index;
    this.isVisible = true;
  }
  handleDeleteMockItem(index: number) {
    this.model.splice(index, 1);
    this.mocklList = [...this.model];
  }
  handleSave() {
    this.isVisible = false;
    this.currentEditMockIndex === -1
      ? this.model.push(this.currentEditMock)
      : (this.model[this.currentEditMockIndex] = this.currentEditMock);
    this.mocklList = [...this.model];
    this.modelChange.emit([...this.model]);
  }
  handleCancel() {
    this.isVisible = false;
  }
  openAddModal() {
    this.currentEditMockIndex = -1;
    this.isVisible = true;
    this.currentEditMock = {
      url: this.model.at(0).url,
      name: '',
      response: '',
    };
  }
}
