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
  /** 当前被编辑的mock */
  currentEditMock: ApiEditMock;
  private destroy$: Subject<void> = new Subject<void>();
  private rawChange$: Subject<string> = new Subject<string>();
  constructor() {
    this.rawChange$.pipe(debounceTime(700), takeUntil(this.destroy$)).subscribe(() => {
      this.modelChange.emit(this.model);
    });
  }

  rawDataChange() {
    this.rawChange$.next(this.currentEditMock.response);
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
