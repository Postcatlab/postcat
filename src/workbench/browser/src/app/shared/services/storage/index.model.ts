import { ApiTestBody, ApiTestBodyType, ApiTestHeaders, ApiTestQuery } from './../api-test/api-test.model';
import { Observable } from 'rxjs';

/**
 * 数据对象基础模型
 */
interface StorageModel {
  /**
   * 主键UUID，字符串UUID或数值型
   *
   * @type {number}
   */
  uuid?: number;

  /**
   * 名称
   *
   * @type {string}
   */
  name?: string;

  /**
   * 创建时间，可为空
   *
   * @type {Date}
   */
  createdAt?: Date;

  /**
   * 更新时间，可为空
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
  parameters?: { name: string; value: string; description: string }[];
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

export interface ApiTestHistoryResponse {
  headers: object[];
  statusCode: number;
  body: string;
  contentType: string;
  responseType: 'text' | 'longText' | 'stream';
  blobFileName?: string;
  responseLength: number;
  testDeny: string;
  /**
   * Inject Code println
   */
  reportList: { type: 'throw' | 'interrupt'; content: string }[];
}

/**
 * General indicators
 *
 * @type {object}
 */
export interface ApiTestResGeneral {
  downloadRate: string;
  downloadSize: number;
  redirectTimes: number;
  time: string;
  timingSummary: {
    dnsTiming: string;
    tcpTiming: string;
    /**
     * SSL/TSL
     */
    tlsTiming: string;
    /**
     * The request is being sent until recieve firstByte
     */
    requestSentTiming: string;
    /**
     * Content download
     */
    contentDeliveryTiming: string;
    /**
     * Waiting (TTFB) - Time To First Byte
     */
    firstByteTiming: string;
    /**
     * Total Time
     */
    responseTiming: string;
  }[];
}

export interface ApiTestHistoryFrame {
  /**
   * General indicators
   *
   * @type {object}
   */
  general: {
    downloadRate: string;
    downloadSize: number;
    redirectTimes: number;
    time: string;
    timingSummary: {
      dnsTiming: string;
      tcpTiming: string;
      /**
       * SSL/TSL
       */
      tlsTiming: string;
      /**
       * The request is being sent until recieve firstByte
       */
      requestSentTiming: string;
      /**
       * Content download
       */
      contentDeliveryTiming: string;
      /**
       * Waiting (TTFB) - Time To First Byte
       */
      firstByteTiming: string;
      /**
       * Total Time
       */
      responseTiming: string;
    }[];
  };
  beforeScript: string;
  afterScript: string;
  /**
   * HTTP Request
   *
   * @type {object}
   */
  request: {
    uri: string;
    protocol: string;
    method: string;
    requestHeaders: any | ApiTestHeaders[];
    requestBodyType: string | 'formData' | 'raw';
    requestBody: any | object[] | string;
  };

  /**
   * HTTP response
   *
   * @type {object}
   */
  response: {
    headers: any[];
    statusCode: number;
    body: string;
    contentType: string;
    responseType: 'text' | 'longText' | 'stream';
    responseLength: number;
    testDeny: string;
    /**
     * Inject Code println
     */
    reportList: string[] | object[];
  };
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

export enum ApiBodyType {
  'Form-data' = 'formData',
  JSON = 'json',
  XML = 'xml',
  Raw = 'raw',
  Binary = 'binary',
}
/**
 * Json Root Type
 *
 * @description body type is json,set root type of object/array
 */
export enum JsonRootType {
  Object = 'object',
  Array = 'array',
}

export enum RequestMethod {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
}
export enum RequestProtocol {
  HTTP = 'http',
  HTTPS = 'https',
}

/**
 * API Data
 */
interface BasicApiData extends StorageModel {
  /**
   * name
   *
   * @type {string}
   */
  name: string;

  /**
   * Request url,Usually value is path
   *
   */
  uri: string;

  /**
   * API protocol [http, https, ...]
   *
   */
  protocol: RequestProtocol;

  /**
   * Request method [POST, GET, PUT, ...]
   *
   */
  method: RequestMethod;

  /**
   * api show order
   *
   * @type {number}
   */
  weight?: number;

  /**
   * 请求的参数类型
   *
   */
  requestBodyType?: ApiBodyType;

  /**
   * 请求头数据，数据用json存储
   *
   */
  requestHeaders?: ApiEditHeaders[];

  /**
   * 请求的json参数根类型
   *
   */
  requestBodyJsonType?: JsonRootType;

  /**
   * 请求参数(多层结构)，数据用json存储
   */
  requestBody?: ApiEditBody[] | string;

  /**
   * get请求参数，数据用json存储
   *
   * @type {object[]}
   */
  queryParams?: ApiEditQuery[];

  /**
   * rest请求参数，数据用json存储
   *
   * @type {object[]}
   */
  restParams?: ApiEditRest[];

  /**
   * 返回头数据，数据用json存储
   *
   */
  responseHeaders?: ApiEditHeaders[];

  /**
   * Response(多层结构)，数据用json存储
   */
  responseBody?: ApiEditBody[] | string;

  /**
   * 返回的参数类型
   */
  responseBodyType?: ApiBodyType;

  /**
   * Responsejson根类型
   */
  responseBodyJsonType?: JsonRootType;
}
export interface ApiData extends BasicApiData {
  /**
   * Belongs to which project
   *
   */
  projectID: number;
  groupID: number;
}
/**
 * API data view model
 */
export interface ApiEditViewData extends BasicApiData {
  groupID: string;
}
/**
 * API Test Data
 * Only has request info
 */
export interface ApiTestData {
  /**
   * For adding test history
   */
  uuid: number;
  groupID: number;
  /**
   * For adding test history
   */
  name?: string;
  /**
   * Request url,Usually value is path
   *
   * @type {string}
   */
  uri: string;
  /**
   * API protocol [http, https, ...]
   *
   * @type {RequestProtocol|string}
   */
  protocol: RequestProtocol | string;

  /**
   * Request method [POST, GET, PUT, ...]
   *
   * @type {RequestMethod|string}
   */
  method: RequestMethod | string;

  /**
   * 请求的参数类型
   *
   * @type {ApiTestBodyType|string}
   */
  requestBodyType?: ApiTestBodyType | string;

  /**
   * 请求头数据，数据用json存储
   */
  requestHeaders?: ApiTestHeaders[];

  /**
   * 请求的json参数根类型
   *
   * @type {JsonRootType|string}
   */
  requestBodyJsonType?: JsonRootType | string;

  /**
   * 请求参数(多层结构)，数据用json存储
   *
   */
  requestBody?: ApiTestBody[] | string;

  /**
   * get请求参数，数据用json存储
   *
   * @type {object[]}
   */
  queryParams?: ApiTestQuery[];

  /**
   * rest请求参数，数据用json存储
   *
   * @type {object[]}
   */
  restParams?: Record<string, any>[];
  /**
   * Javascript code before test
   */
  beforeScript?: string;
  /**
   * Javascript code after api response
   */
  afterScript?: string;
}

/**
 * API body FormData param type
 */
export enum ApiParamsTypeFormData {
  string = 'string',
  file = 'file',
  json = 'json',
  int = 'int',
  float = 'float',
  double = 'double',
  date = 'date',
  datetime = 'datetime',
  boolean = 'boolean',
  byte = 'byte',
  short = 'short',
  long = 'long',
  array = 'array',
  object = 'object',
  number = 'number',
  null = 'null',
}

/**
 * API body Json or xml param type
 */
export enum ApiParamsTypeJsonOrXml {
  string = 'string',
  array = 'array',
  object = 'object',
  number = 'number',
  json = 'json',
  int = 'int',
  float = 'float',
  double = 'double',
  date = 'date',
  datetime = 'datetime',
  boolean = 'boolean',
  short = 'short',
  long = 'long',
  char = 'char',
  null = 'null',
}

export interface ParamsEnum {
  /**
   * is default param value
   */
  default: boolean;
  /**
   * param value
   */
  value: string;
  /**
   * param value description
   */
  description: string;
}

export type ApiEditMock = {
  /** mock名称 */
  name: string;
  /** mock地址 */
  url: string;
  /** mock返回值 */
  response: string;
  /** 0 is system default mock; 1 is user custom mock */
  createWay: 'system' | 'custom';
};

export interface BasiApiEditParams {
  /**
   * 参数名
   */
  name: string;
  /**
   * is response/request must contain param
   */
  required: boolean;
  /**
   * param example
   */
  example: string;
  /**
   * 说明
   */
  description: string;
  /**
   * 值可能性
   */
  enum?: ParamsEnum[];
}
export type ApiEditHeaders = BasiApiEditParams;
export type ApiEditQuery = BasiApiEditParams;
export type ApiEditRest = BasiApiEditParams;
export interface ApiEditBody extends BasiApiEditParams {
  /**
   * 参数类型
   */
  type: ApiParamsTypeFormData | ApiParamsTypeJsonOrXml | string;
  /**
   * 最小值
   */
  minimum?: number;
  /**
   * 最大值
   */
  maximum?: number;
  /**
   * 最小长度
   */
  minLength?: number;
  /**
   * 最大长度
   */
  maxLength?: number;
  /**
   * XML attribute
   */
  attribute?: string;
  /**
   * 子参数
   */
  children?: ApiEditBody[];
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
  projectCreate: (item: Project) => Observable<object>;
  projectUpdate: (item: Project, uuid: number | string) => Observable<object>;
  projectBulkUpdate: (items: Array<Project>) => Observable<object>;
  projectRemove: (uuid: number | string) => Observable<object>;
  projectBulkRemove: (uuids: Array<number | string>) => Observable<object>;
  projectLoad: (uuid: number | string) => Observable<object>;
  projectBulkLoad: (uuids: Array<number | string>) => Observable<object>;
  projectExport: (projectID?) => Observable<object>;
  // Environment
  environmentCreate: (item: Environment) => Observable<object>;
  environmentUpdate: (item: Environment, uuid: number | string) => Observable<object>;
  environmentBulkCreate: (items: Array<Environment>) => Observable<object>;
  environmentBulkUpdate: (items: Array<Environment>) => Observable<object>;
  environmentRemove: (uuid: number | string) => Observable<object>;
  environmentBulkRemove: (uuids: Array<number | string>) => Observable<object>;
  environmentLoad: (uuid: number | string) => Observable<object>;
  environmentBulkLoad: (uuids: Array<number | string>) => Observable<object>;
  environmentLoadAllByProjectID: (projectID: number | string) => Observable<object>;
  // Group
  groupCreate: (item: Group) => Observable<object>;
  groupUpdate: (item: Group, uuid: number | string) => Observable<object>;
  groupBulkCreate: (items: Array<Group>) => Observable<object>;
  groupBulkUpdate: (items: Array<Group>) => Observable<object>;
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
   * Create apiData item.
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
  apiDataBulkCreate: (items: Array<ApiData>) => Observable<object>;

  /**
   * Bulk update apiData items.
   *
   * @param items
   */
  apiDataBulkUpdate: (items: Array<ApiData>) => Observable<object>;
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
  apiTestHistoryBulkCreate: (items: Array<ApiTestHistory>) => Observable<object>;
  apiTestHistoryBulkUpdate: (items: Array<ApiTestHistory>) => Observable<object>;
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
  params: Array<any>;
}

export interface StorageRes {
  status: StorageResStatus;
  data: any;
  /**
   * Error tips
   */
  message?: string;
  /**
   * Error reason
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
  invalid = 'not connect',
}

export enum StorageProcessType {
  default = 'default',
  remote = 'remote',
  sync = 'sync',
}
