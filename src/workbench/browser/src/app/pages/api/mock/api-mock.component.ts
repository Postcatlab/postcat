import { Component, OnInit } from '@angular/core';
import { ApiData, ApiMockEntity, StorageRes, StorageResStatus } from '../../../shared/services/storage/index.model';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { ActivatedRoute } from '@angular/router';
import { tree2obj } from 'eo/workbench/browser/src/app/utils/tree/tree.utils';
import { eoFormatRequestData } from 'eo/workbench/browser/src/app/shared/services/api-test/api-test.utils';
import { ApiTestService } from 'eo/workbench/browser/src/app/pages/api/test/api-test.service';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/remote/remote.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'eo-api-edit-mock',
  templateUrl: './api-mock.component.html',
  styleUrls: ['./api-mock.component.scss'],
})
export class ApiMockComponent implements OnInit {
  isVisible = false;
  get mockUrl() {
    return this.remoteService.mockUrl;
  }
  mocklList: ApiMockEntity[] = [];
  apiData: ApiData;
  createWayMap = {
    system: '系统自动创建',
    custom: '手动创建',
  };
  mockListColumns = [
    { title: '名称', key: 'name' },
    { title: '创建方式', slot: 'createWay' },
    { title: 'URL', slot: 'url' },
    { title: '', slot: 'action', width: '15%' },
  ];
  /** 当前被编辑的mock */
  currentEditMock: ApiMockEntity;
  /** 当前被编辑的mock索引 */
  currentEditMockIndex = -1;
  /** 当前是否处于编辑状态 */
  get isEdit() {
    return this.currentEditMock?.uuid;
  }
  /** 响应内容 */
  get responseStr() {
    const response = this.currentEditMock.response;
    return typeof response === 'string' ? response : JSON.stringify(response, null, 2);
  }
  set responseStr(val) {
    this.currentEditMock.response = JSON.parse(val);
  }
  private destroy$: Subject<void> = new Subject<void>();
  private rawChange$: Subject<string> = new Subject<string>();

  constructor(
    private storageService: StorageService,
    private apiTest: ApiTestService,
    private route: ActivatedRoute,
    private remoteService: RemoteService,
    private message: NzMessageService
  ) {
    this.rawChange$.pipe(debounceTime(700), takeUntil(this.destroy$)).subscribe(() => {});
  }

  ngOnInit() {
    this.initMockList(Number(this.route.snapshot.queryParams.uuid));
  }

  async initMockList(apiDataID: number) {
    const mockRes = await this.getMockByApiDataID(apiDataID);
    this.apiData = await this.getApiData(apiDataID);
    console.log('apiDataRes', this.apiData, mockRes);
    if (window.eo?.getMockUrl && Array.isArray(mockRes) && mockRes.length === 0) {
      const mock = this.createMockObj({ name: '系统默认期望', createWay: 'system' });
      await this.createMock(mock);
      this.mocklList = [mock];
    } else {
      console.log('result.data', mockRes);
      this.mocklList = mockRes.map((item) => {
        item.url = this.getApiUrl(item);
        return item;
      });
    }
  }
  getApiUrl(apiData?: ApiData) {
    const data = eoFormatRequestData(this.apiData, { env: {} }, 'en-US');
    const uri = this.apiTest.transferUrlAndQuery(data.URL, this.apiData.queryParams, {
      base: 'query',
      replaceType: 'replace',
    }).url;
    console.log('this.mockUrl', this.mockUrl);
    const url = new URL(`${this.mockUrl}/${uri}`.replace(/(?<!:)\/{2,}/g, '/'));
    if (apiData || this.isEdit) {
      url.searchParams.set('mockID', (apiData || this.currentEditMock).uuid + '');
    }
    return decodeURIComponent(url.toString());
  }

  /**
   * create mock
   * @param mock
   * @returns
   */
  createMock(mock): Promise<StorageRes> {
    return new Promise((resolve, reject) => {
      this.storageService.run('mockCreate', [mock], (res: StorageRes) => {
        if (res.status === StorageResStatus.success) {
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  }
  /**
   * update mock
   * @param mock
   * @returns
   */
  updateMock(mock, uuid: number) {
    return new Promise((resolve, reject) => {
      this.storageService.run('mockUpdate', [mock, uuid], (res: StorageRes) => {
        if (res.status === StorageResStatus.success) {
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  }

  /**
   * remove mock
   * @param mock
   * @returns
   */
  removeMock(uuid: number) {
    return new Promise((resolve, reject) => {
      this.storageService.run('mockRemove', [uuid], (res: StorageRes) => {
        if (res.status === StorageResStatus.success) {
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  }

  /**
   * create mock object data
   * @param options
   * @returns
   */
  createMockObj(options: Record<string, any> = {}) {
    const { name = '', createWay = 'custom', ...rest } = options;
    return {
      name,
      url: this.getApiUrl(),
      apiDataID: this.apiData.uuid,
      projectID: 1,
      createWay,
      response: JSON.stringify(tree2obj([].concat(this.apiData.responseBody))),
      ...rest,
    };
  }
  /**
   * get mock list
   *
   * @param apiDataID
   * @returns
   */
  getMockByApiDataID(apiDataID: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storageService.run('apiMockLoadAllByApiDataID', [apiDataID], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          resolve(result.data);
        } else {
          reject(result);
        }
      });
    });
  }
  /**
   * get current api data
   *
   * @param apiDataID
   * @returns
   */
  getApiData(apiDataID: number): Promise<ApiData> {
    return new Promise((resolve, reject) => {
      this.storageService.run('apiDataLoad', [apiDataID], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          resolve(result.data);
        } else {
          reject(result);
        }
      });
    });
  }

  rawDataChange() {
    this.rawChange$.next(this.currentEditMock.response);
  }

  async handleDeleteMockItem(index: number) {
    const target = this.mocklList[index];
    await this.removeMock(Number(target.uuid));
    this.mocklList.splice(index, 1)[0];
    this.mocklList = [...this.mocklList];
    this.message.success('删除成功');
  }
  async handleSave() {
    this.isVisible = false;
    this.isEdit
      ? (this.mocklList[this.currentEditMockIndex] = this.currentEditMock)
      : this.mocklList.push(this.currentEditMock);

    if (this.currentEditMock.createWay === 'system') return;

    this.mocklList = [...this.mocklList];
    if (this.isEdit) {
      await this.updateMock(this.currentEditMock, Number(this.currentEditMock.uuid));
      this.message.success('修改成功');
    } else {
      const result = await this.createMock(this.currentEditMock);
      Object.assign(this.currentEditMock, result.data);
      this.message.success('新增成功');
    }
    this.currentEditMock.url = this.getApiUrl();
  }
  handleCancel() {
    this.isVisible = false;
  }
  addOrEditModal(editIndex = -1) {
    this.currentEditMockIndex = editIndex;
    this.isVisible = true;
    if (this.currentEditMockIndex === -1) {
      this.currentEditMock = this.createMockObj();
    } else {
      this.currentEditMock = { ...this.mocklList[this.currentEditMockIndex] };
    }
  }
}
