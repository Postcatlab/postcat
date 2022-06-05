import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiEditMock } from 'eo/platform/browser/IndexedDB';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'eo-api-edit-mock',
  templateUrl: './api-edit-mock.component.html',
  styleUrls: ['./api-edit-mock.component.scss'],
})
export class ApiEditMockComponent {
  @Input() model: ApiEditMock[];
  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  isVisible = false;
  mockListColumns = [
    { title: '名称', key: 'name' },
    { title: 'URL', slot: 'url' },
    { title: '', slot: 'action', width: '15%' },
  ];
  /** 是否为编辑 */
  isEdit = true;
  /** 当前被编辑的mock */
  currentEditMock: ApiEditMock;
  private destroy$: Subject<void> = new Subject<void>();
  private rawChange$: Subject<string> = new Subject<string>();
  constructor() {
    this.rawChange$.pipe(debounceTime(700), takeUntil(this.destroy$)).subscribe(() => {});
  }

  rawDataChange() {
    this.rawChange$.next(this.currentEditMock.response);
  }

  handleEditMockItem(mock: ApiEditMock) {
    this.currentEditMock = mock;
    this.isEdit = true;
    this.isVisible = true;
  }
  handleDeleteMockItem(index: number) {
    this.model.splice(index, 1);
    this.model = [...this.model];
  }
  handleSave() {
    this.isVisible = false;
    this.model = [...this.model, this.currentEditMock];
    this.modelChange.emit(this.model);
  }
  handleCancel() {
    this.isVisible = false;
  }
  openAddModal() {
    this.isEdit = false;
    this.isVisible = true;
    this.currentEditMock = {
      url: this.model.at(0).url,
      name: '',
      response: '',
    };
  }
}
