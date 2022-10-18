import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiData, ApiMockEntity, StorageRes, StorageResStatus } from '../../../../shared/services/storage/index.model';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { ActivatedRoute } from '@angular/router';
import { tree2obj } from 'eo/workbench/browser/src/app/utils/tree/tree.utils';
import { formatUri } from 'eo/workbench/browser/src/app/shared/services/api-test/api-test.utils';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { copyText } from 'eo/workbench/browser/src/app/utils/index.utils';
import { transferUrlAndQuery } from 'eo/workbench/browser/src/app/utils/api';
import { WorkspaceService } from 'eo/workbench/browser/src/app/shared/services/workspace/workspace.service';
import { ProjectService } from 'eo/workbench/browser/src/app/shared/services/project/project.service';

@Component({
  selector: 'eo-api-mock-table',
  templateUrl: './api-mock.component.html',
  styleUrls: ['./api-mock.component.scss'],
})
export class ApiMockComponent implements OnInit {
  @Output() eoOnInit = new EventEmitter<ApiData>();
  @Input() mockListColumns = [
    { title: $localize`Name`, slot: 'name', width: '20%' },
    { title: $localize`Created Type`, slot: 'createWay', width: '18%' },
    { title: 'URL', slot: 'url', width: '42%' },
    { title: '', slot: 'action', width: '20%', fixed: true },
  ];
  @Input() apiDataID: number;
  @Input() showToolBar = true;
  apiData: ApiData;
  isVisible = false;
  get mockUrl() {
    const prefix =
      this.workspaceService.currentWorkspaceID === -1
        ? this.dataSource.mockUrl
        : `${this.dataSource.mockUrl}/${this.workspaceService.currentWorkspaceID}/${this.projectService.currentProjectID}`;
    return `${prefix}/mock`;
  }
  get modalTitle() {
    return `${
      this.currentEditMockIndex === -1
        ? $localize`Add`
        : this.currentEditMock.createWay === 'system'
        ? $localize`:@@mockPreview:Preview`
        : $localize`Edit`
    } Mock`;
  }
  get isSystemMock() {
    return this.currentEditMock.createWay === 'system';
  }
  mocklList: ApiMockEntity[] = [];
  createWayMap = {
    system: $localize`System creation`,
    custom: $localize`Manual creation`,
  };

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
    private route: ActivatedRoute,
    private dataSource: DataSourceService,
    private message: NzMessageService,
    private workspaceService: WorkspaceService,
    private projectService: ProjectService
  ) {
    this.rawChange$.pipe(debounceTime(700), takeUntil(this.destroy$)).subscribe(() => {});
  }

  ngOnInit() {
    this.init();
  }
  init() {
    this.initMockList(this.apiDataID || Number(this.route.snapshot.queryParams.uuid));
  }

  async initMockList(apiDataID: number) {
    const mockRes = await this.getMockByApiDataID(apiDataID);
    this.apiData = await this.getApiData(apiDataID);
    this.eoOnInit.emit(this.apiData);
    this.mocklList = mockRes.map((item) => {
      item.url = this.getApiUrl(item);
      return item;
    });
  }

  getApiUrl(mock?: ApiMockEntity) {
    const uri = transferUrlAndQuery(formatUri(this.apiData.uri, this.apiData.restParams), this.apiData.queryParams, {
      base: 'query',
      replaceType: 'replace',
    }).url;
    const url = new URL(
      `${this.mockUrl}/${mock?.uuid || ''}/${uri}`.replace(/(?<!:)\/{2,}/g, '/'),
      'https://github.com/'
    );
    return decodeURIComponent(url.toString());
  }

  /**
   * create mock
   *
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
   *
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
   *
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
   *
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
    console.log('target', target);
    await this.removeMock(Number(target.uuid));
    this.mocklList.splice(index, 1)[0];
    this.mocklList = [...this.mocklList];
    this.message.success($localize`Delete Succeeded`);
  }
  async handleSave() {
    this.isVisible = false;

    if (this.currentEditMock.createWay === 'system') {
      return;
    }

    if (this.isEdit) {
      await this.updateMock(this.currentEditMock, Number(this.currentEditMock.uuid));
      this.message.success($localize`Edited successfully`);
      this.mocklList[this.currentEditMockIndex] = this.currentEditMock;
    } else {
      const result = await this.createMock(this.currentEditMock);
      Object.assign(this.currentEditMock, result.data);
      this.message.success($localize`Added successfully`);
      this.mocklList.push(this.currentEditMock);
    }
    this.currentEditMock.url = this.getApiUrl(this.currentEditMock);
    this.mocklList = [...this.mocklList];
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

  async copyText(text: string) {
    await copyText(text);
    this.message.success($localize`Copied`);
  }
}
