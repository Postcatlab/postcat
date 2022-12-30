import { Observable } from 'rxjs';

import { BasicApiData } from '../../../modules/api-shared/api.model';
import { ApiTestHistoryFrame } from '../../../pages/workspace/project/api/http/test/api-test.model';

/**
 * Date base model
 */
export interface StorageModel {
  /**
   * uuid
   *
   * @type {number}
   */
  uuid?: number;

  /**
   * date name
   *
   * @type {string}
   */
  name?: string;

  /**
   * cteate time
   *
   * @type {Date}
   */
  createdAt?: Date;

  /**
   * update time
   *
   * @type {Date}
   */
  updatedAt?: Date;
}

/**
 * 环境对象接口
 */
export interface Environment extends StorageModel {
  /**
   * 主键UUID，字符串UUID或数值型
   *
   * @type {number}
   */
  uuid?: number;
  /**
   * Env name
   *
   * @type {string}
   */
  name: string;

  /**
   * Project primary ID
   *
   * @type {number}
   */
  projectID: number;

  /**
   * Host uri
   *
   * @type {string}
   */
  hostUri?: string;

  /**
   * Env parameters
   */
  parameters?: Array<{ name: string; value: string; description: string }>;
}

/**
 * 分组对象接口
 */
export interface Group extends StorageModel {
  /**
   * 名称
   *
   * @type {string}
   */
  name: string;

  /**
   * 项目主键ID
   *
   * @type {string|number}
   */
  projectID: string | number;

  /**
   * 上级分组主键，最顶层是0
   *
   * @type {string|number}
   */
  parentID?: string | number;

  /**
   * 分组排序号
   *
   * @type {number}
   */
  weight?: number;
}

/**
 * 项目对象接口
 */
export interface Project extends StorageModel {
  /**
   * 名称
   *
   * @type {string}
   */
  name: string;
}

/**
 * API测试历史对象接口
 */
export interface ApiTestHistory extends ApiTestHistoryFrame, StorageModel {
  /**
   * Project primary key ID
   *
   * @type {string|number}
   */
  projectID: string | number;

  /**
   * Bind API primary key ID
   *
   * @type {string|number}
   */
  apiDataID: string | number;
}

export type ApiMockEntity = StorageModel & {
  /** mock name */
  name: string;
  /** mock url */
  url: string;
  /**
   * Project primary key ID
   *
   * @type {string|number}
   */
  projectID: string | number;

  /**
   * Bind API primary key ID
   *
   * @type {string|number}
   */
  apiDataID: string | number;

  /** 0 is system default mock; 1 is user custom mock */
  createWay: 'system' | 'custom';

  /** mock response data */
  response: string;
};

export interface ApiData extends BasicApiData {
  /**
   * Belongs to which project
   *
   */
  projectID: number;
  groupID: number;
}
/**
 * Storage CURD Interface.
 */
export interface StorageInterface {
  //System
  /**
   * Check remote storage connect success
   */
  systemCheck?: () => Observable<object>;
  // Project
  projectImport: (uuid: number, item: any, groupID?: number) => Observable<object>;
  projectCreate: (workspaceID: number, item: Project) => Observable<object>;
  projectUpdate: (workspaceID: number, item: Project, uuid: number | string) => Observable<object>;
  projectBulkUpdate: (items: Project[]) => Observable<object>;
  projectRemove: (workspaceID: number, uuid: number | string) => Observable<object>;
  projectBulkRemove: (uuids: Array<number | string>) => Observable<object>;
  projectLoad: (uuid: number | string) => Observable<object>;
  projectBulkLoad: (workspaceID: number) => Observable<object>;
  projectExport: (uuid?) => Observable<object>;
  // Environment
  environmentCreate: (item: Environment) => Observable<object>;
  environmentUpdate: (item: Environment, uuid: number | string) => Observable<object>;
  environmentBulkCreate: (items: Environment[]) => Observable<object>;
  environmentBulkUpdate: (items: Environment[]) => Observable<object>;
  environmentRemove: (uuid: number | string) => Observable<object>;
  environmentBulkRemove: (uuids: Array<number | string>) => Observable<object>;
  environmentLoad: (uuid: number | string) => Observable<object>;
  environmentBulkLoad: (uuids: Array<number | string>) => Observable<object>;
  environmentLoadAllByProjectID: (projectID: number | string) => Observable<object>;
  // Group
  groupCreate: (item: Group) => Observable<object>;
  groupUpdate: (item: Group, uuid: number | string) => Observable<object>;
  groupBulkCreate: (items: Group[]) => Observable<object>;
  groupBulkUpdate: (items: Group[]) => Observable<object>;
  groupRemove: (uuid: number | string) => Observable<object>;
  groupBulkRemove: (uuids: Array<number | string>) => Observable<object>;
  groupLoad: (uuid: number | string) => Observable<object>;
  groupBulkLoad: (uuids: Array<number | string>) => Observable<object>;
  /**
   * Load all group items by projectID.
   *
   * @param projectID
   */
  groupLoadAllByProjectID: (projectID: number | string) => Observable<object>;
  // Api Data
  /**
   * New apiData item.
   *
   * @param item
   */
  apiDataCreate: (item: ApiData) => Observable<object>;
  apiDataUpdate: (item: ApiData, uuid: number | string) => Observable<object>;

  /**
   * Bulk create apiData items.
   *
   * @param items
   */
  apiDataBulkCreate: (items: ApiData[]) => Observable<object>;

  /**
   * Bulk update apiData items.
   *
   * @param items
   */
  apiDataBulkUpdate: (items: ApiData[]) => Observable<object>;
  apiDataRemove: (uuid: number | string) => Observable<object>;
  /**
   * Bulk delete apiData items.
   *
   * @param uuids
   */
  apiDataBulkRemove: (uuids: Array<number | string>) => Observable<object>;
  /**
   * Load apiData item with primary key.
   *
   * @param uuid
   */
  apiDataLoad: (uuid: number | string) => Observable<object>;
  /**
   * Bulk load apiData items.
   *
   * @param uuids
   */
  apiDataBulkLoad: (uuids: Array<number | string>) => Observable<object>;

  /**
   * Load all apiData items by projectID.
   *
   * @param projectID
   */
  apiDataLoadAllByProjectID: (projectID: number | string) => Observable<object>;

  /**
   * Load all apiData items by groupID.
   *
   * @param groupID
   */

  apiDataLoadAllByGroupID: (groupID: number | string) => Observable<object>;
  apiDataLoadAllByProjectIDAndGroupID: (projectID: number | string, groupID: number | string) => Observable<object>;
  // Api Test History
  apiTestHistoryCreate: (item: ApiTestHistory) => Observable<object>;
  apiTestHistoryUpdate: (item: ApiTestHistory, uuid: number | string) => Observable<object>;
  apiTestHistoryBulkCreate: (items: ApiTestHistory[]) => Observable<object>;
  apiTestHistoryBulkUpdate: (items: ApiTestHistory[]) => Observable<object>;
  apiTestHistoryRemove: (uuid: number | string) => Observable<object>;
  apiTestHistoryBulkRemove: (uuids: Array<number | string>) => Observable<object>;
  apiTestHistoryLoad: (uuid: number | string) => Observable<object>;
  apiTestHistoryBulkLoad: (uuids: Array<number | string>) => Observable<object>;
  apiTestHistoryLoadAllByProjectID: (projectID: number | string) => Observable<object>;
  apiTestHistoryLoadAllByApiDataID: (apiDataID: number | string) => Observable<object>;
}

export type StorageItem = Project | Environment | Group | ApiData | ApiTestHistory;

export interface StorageHandleArgs {
  type?: StorageProcessType;
  callback?: any;
  action: string;
  params: any[];
}

export interface StorageRes {
  status: StorageResStatus;
  data: any;
  /**
   * Error description
   */
  message?: string;
  /**
   * Error code|detail
   */
  error?: string;
  callback: any;
}

export enum StorageResStatus {
  success = 200,
  empty = 201,
  unAuthorize = 401,
  notFind = 404,
  error = 500,
  invalid = 'not connect'
}

export enum StorageProcessType {
  default = 'default',
  remote = 'remote',
  sync = 'sync'
}
