import { Component, OnInit } from '@angular/core';
import { ApiEditMock, StorageRes, StorageResStatus } from '../../../shared/services/storage/index.model';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'eo-api-edit-mock',
  templateUrl: './api-mock.component.html',
  styleUrls: ['./api-mock.component.scss'],
})
export class ApiMockComponent implements OnInit {
  isVisible = false;
  mockUrl = window.eo?.getMockUrl?.();
  private mocklList: ApiEditMock[] = [];
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
  constructor(private storageService: StorageService, private route: ActivatedRoute) {
    this.rawChange$.pipe(debounceTime(700), takeUntil(this.destroy$)).subscribe(() => {});
  }
  ngOnInit() {
    this.initMockList(Number(this.route.snapshot.queryParams.uuid));
  }

  initMockList(apiDataID: number) {
    this.storageService.run('apiMockLoadAllByApiDataID', [apiDataID], (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        if (Array.isArray(result.data) && result.data.length === 0) {
          const mock = {
            apiDataID,
            name: '系统默认期望',
            projectID: 1,
            response: '',
            url: '',
          };
          this.storageService.run('mockCreate', [mock], (res: StorageRes) => {
            if (result.status === StorageResStatus.success) {
              console.log(res);
            } else {
            }
            this.mocklList = [mock];
          });
        } else {
          console.log('result.data', result.data);
          this.mocklList = result.data;
        }
      }
    });
  }

  // getMockByApiDataID() {}

  // getApiData(id: number) {
  //   return new Promise((resolve, reject) => {
  //     this.storageService.run('apiDataLoad', [id], (result: StorageRes) => {
  //       if (result.status === StorageResStatus.success) {
  //         resolve(result.data)
  //       } else {
  //         reject(result)
  //       }
  //     }
  //   })
  // }

  rawDataChange() {
    this.rawChange$.next(this.currentEditMock.response);
  }

  handleEditMockItem(index: number) {
    this.currentEditMock = { ...this.mocklList[index] };
    this.currentEditMockIndex = index;
    this.isVisible = true;
  }
  handleDeleteMockItem(index: number) {
    this.mocklList.splice(index, 1);
    this.mocklList = [...this.mocklList];
  }
  handleSave() {
    this.isVisible = false;
    this.currentEditMockIndex === -1
      ? this.mocklList.push(this.currentEditMock)
      : (this.mocklList[this.currentEditMockIndex] = this.currentEditMock);
    this.mocklList = [...this.mocklList];
  }
  handleCancel() {
    this.isVisible = false;
  }
  openAddModal() {
    this.currentEditMockIndex = -1;
    this.isVisible = true;
    this.currentEditMock = {
      url: this.mocklList.at(0).url,
      name: '',
      response: '',
    };
  }
}
