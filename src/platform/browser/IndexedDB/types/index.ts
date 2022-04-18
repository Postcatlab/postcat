import { Observable } from 'rxjs';

/**
 * 数据对象基础模型
 */
interface StorageModel {
  /**
   * 主键UUID，字符串UUID或数值型
   * @type {string|number}
   */
  uuid?: string|number;

  /**
   * 名称
   * @type {string}
   */
  name?: string;

  /**
   * 备注信息
   * @type {string}
   */
  description?: string;

  /**
   * 创建时间，可为空
   * @type {Date}
   */
  createdAt?: Date;

  /**
   * 更新时间，可为空
   * @type {Date}
   */
  updatedAt?: Date;
}

/**
 * 环境对象接口
 */
export interface Environment extends StorageModel {
  /**
   * 名称
   * @type {string}
   */
  name: string;

  /**
   * 项目主键ID
   * @type {string|number}
   */
  projectID: string|number;

  /**
   * 前置url
   * @type {string}
   */
  hostUri: string;

  /**
   * 环境变量（可选）
   * @type {object}
   */
  parameters?: object;
}


/**
 * 分组对象接口
 */
export interface Group extends StorageModel {
  /**
   * 名称
   * @type {string}
   */
  name: string;

  /**
   * 项目主键ID
   * @type {string|number}
   */
  projectID: string|number;

  /**
   * 上级分组主键，最顶层是0
   * @type {string|number}
   */
  parentID?: string|number;

  /**
   * 分组排序号
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
  responseLength: number;
  testDeny: string;
  /**
   * Inject Code println
   */
  reportList: string[] | object[];
}

/**
 * General indicators
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

  /**
   * HTTP Request
   * @type {object}
   */
  request: {
    uri: string;
    protocol: string;
    method: string;
    requestHeaders: any | object[];
    requestBodyJsonType: JsonRootType | string;
    requestBodyType: string | 'formData' | 'raw';
    requestBody: any | object[] | string;
  };

  /**
   * HTTP response
   * @type {object}
   */
  response: {
    headers: object[];
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
   * @type {string|number}
   */
  projectID: string | number;

  /**
   * Bind API primary key ID
   * @type {string|number}
   */
  apiDataID: string | number;
}

export enum ApiBodyType {
  'Form-data' = 'formData',
  JSON = 'json',
  XML = 'xml',
  Raw = 'raw',
  // Binary = 'binary',
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
 * API数据对象接口
 */
export interface ApiData extends StorageModel {
  /**
   * 名称
   * @type {string}
   */
  name: string;

  /**
   * 文档所属项目主键ID
   *
   * @type {string|number}
   */
  projectID?: string | number;

  /**
   * 文档所属分组主键ID
   *
   * @type {string|number}
   */
  groupID: string | number;

  /**
   * 请求地址
   *
   * @type {string}
   */
  uri: string;
  /**
   * API协议 [http, https, ...]
   *
   * @type {RequestProtocol|string}
   */
  protocol: RequestProtocol | string;

  /**
   * 请求方法 [POST, GET, PUT, ...]
   *
   * @type {RequestMethod|string}
   */
  method: RequestMethod | string;

  /**
   * 分组排序号
   *
   * @type {number}
   */
  weight?: number;

  /**
   * 请求的参数类型
   *
   * @type {ApiBodyType|string}
   */
  requestBodyType?: ApiBodyType | string;

  /**
   * 请求头数据，数据用json存储
   *
   * @type {object}
   */
  requestHeaders?: ApiEditHeaders[];

  /**
   * 请求的json参数根类型
   *
   * @type {JsonRootType|string}
   */
  requestBodyJsonType?: JsonRootType | string;

  /**
   * 请求参数(多层结构)，数据用json存储
   *
   * @type {object}
   */
  requestBody?: ApiEditBody[] | string;

  /**
   * get请求参数，数据用json存储
   *
   * @type {object[]}
   */
  queryParams?: object[];

  /**
   * rest请求参数，数据用json存储
   *
   * @type {object[]}
   */
  restParams?: object[];

  /**
   * 返回头数据，数据用json存储
   *
   * @type {object}
   */
  responseHeaders?: ApiEditHeaders[];

  /**
   * 返回参数(多层结构)，数据用json存储
   *
   * @type {ApiEditBody[] | string}
   */
  responseBody?: ApiEditBody[] | string;

  /**
   * 返回的参数类型
   *
   * @type {ApiBodyType|string}
   */
  responseBodyType?: ApiBodyType | string;

  /**
   * 返回参数json根类型
   *
   * @type {JsonRootType|string}
   */
  responseBodyJsonType?: JsonRootType | string;
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
  // Project
  projectCreate: (item: Project) => Observable<object>;
  projectUpdate: (item: Project, uuid: number|string) => Observable<object>;
  projectBulkCreate: (items: Array<Project>) => Observable<object>;
  projectBulkUpdate: (items: Array<Project>) => Observable<object>;
  projectRemove: (uuid: number|string) => Observable<boolean>;
  projectBulkRemove: (uuids: Array<number|string>) => Observable<boolean>;
  projectLoad: (uuid: number|string) => Observable<object>;
  projectBulkLoad: (uuids: Array<number|string>) => Observable<Array<object>>;
  // Environment
  environmentCreate: (item: Environment) => Observable<object>;
  environmentUpdate: (item: Environment, uuid: number|string) => Observable<object>;
  environmentBulkCreate: (items: Array<Environment>) => Observable<object>;
  environmentBulkUpdate: (items: Array<Environment>) => Observable<object>;
  environmentRemove: (uuid: number|string) => Observable<boolean>;
  environmentBulkRemove: (uuids: Array<number|string>) => Observable<boolean>;
  environmentLoad: (uuid: number|string) => Observable<object>;
  environmentBulkLoad: (uuids: Array<number|string>) => Observable<Array<object>>;
  environmentLoadAllByProjectID: (projectID: number|string) => Observable<Array<object>>;
  // Group
  groupCreate: (item: Group) => Observable<object>;
  groupUpdate: (item: Group, uuid: number|string) => Observable<object>;
  groupBulkCreate: (items: Array<Group>) => Observable<object>;
  groupBulkUpdate: (items: Array<Group>) => Observable<object>;
  groupRemove: (uuid: number|string) => Observable<boolean>;
  groupBulkRemove: (uuids: Array<number|string>) => Observable<boolean>;
  groupLoad: (uuid: number|string) => Observable<object>;
  groupBulkLoad: (uuids: Array<number|string>) => Observable<Array<object>>;
  groupLoadAllByProjectID: (projectID: number|string) => Observable<Array<object>>;
  // Api Data
  apiDataCreate: (item: ApiData) => Observable<object>;
  apiDataUpdate: (item: ApiData, uuid: number|string) => Observable<object>;
  apiDataBulkCreate: (items: Array<ApiData>) => Observable<object>;
  apiDataBulkUpdate: (items: Array<ApiData>) => Observable<object>;
  apiDataRemove: (uuid: number|string) => Observable<boolean>;
  apiDataBulkRemove: (uuids: Array<number|string>) => Observable<boolean>;
  apiDataLoad: (uuid: number|string) => Observable<object>;
  apiDataBulkLoad: (uuids: Array<number|string>) => Observable<Array<object>>;
  apiDataLoadAllByProjectID: (projectID: number|string) => Observable<Array<object>>;
  apiDataLoadAllByGroupID: (groupID: number|string) => Observable<Array<object>>;
  apiDataLoadAllByProjectIDAndGroupID: (projectID: number|string, groupID: number|string) => Observable<Array<object>>;
  // Api Test History
  apiTestHistoryCreate: (item: ApiTestHistory) => Observable<object>;
  apiTestHistoryUpdate: (item: ApiTestHistory, uuid: number|string) => Observable<object>;
  apiTestHistoryBulkCreate: (items: Array<ApiTestHistory>) => Observable<object>;
  apiTestHistoryBulkUpdate: (items: Array<ApiTestHistory>) => Observable<object>;
  apiTestHistoryRemove: (uuid: number|string) => Observable<boolean>;
  apiTestHistoryBulkRemove: (uuids: Array<number|string>) => Observable<boolean>;
  apiTestHistoryLoad: (uuid: number|string) => Observable<object>;
  apiTestHistoryBulkLoad: (uuids: Array<number|string>) => Observable<Array<object>>;
  apiTestHistoryLoadAllByProjectID: (projectID: number|string) => Observable<Array<object>>;
  apiTestHistoryLoadAllByApiDataID: (apiDataID: number|string) => Observable<Array<object>>;
}

export type StorageItem = Project | Environment | Group | ApiData | ApiTestHistory;

export interface StorageHandleArgs {
  type?: StorageProcessType;
  action: string;
  params: Array<any>;
}

export interface StorageHandleResult {
  status: StorageHandleStatus;
  data: any;
}

export enum StorageHandleStatus {
  success = 'success',
  empty = 'empty',
  error = 'error',
  invalid = 'invalid'
}

export enum StorageProcessType {
  default = 'default',
  remote = 'remote',
  sync = 'sync' 
}