import { StorageModel } from '../../shared/services/storage/index.model';
import { ColumnItem, TableProSetting } from '../eo-ui/table-pro/table-pro.model';

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
  null = 'null'
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
  null = 'null'
}
export interface ParamsEnum {
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
export enum ApiBodyType {
  'Form-data' = 'formData',
  JSON = 'json',
  XML = 'xml',
  Raw = 'raw',
  Binary = 'binary'
}
/**
 * Json Root Type
 *
 * @description body type is json,set root type of object/array
 */
export enum JsonRootType {
  Object = 'object',
  Array = 'array'
}

export enum RequestMethod {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH'
}
/**
 * @deprecated auto judge from url
 */
export enum RequestProtocol {
  HTTP = 'http',
  HTTPS = 'https'
}

/**
 * API Data
 */
export interface BasicApiData extends StorageModel {
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
   * 请求的 JSON 参数根类型
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
/**
 * API data view model
 */
export interface ApiEditViewData extends BasicApiData {
  groupID: string;
}

export interface ApiTableConf {
  columns?: ColumnItem[];
  setting?: TableProSetting;
}
export const DEFAULT_HEADER = [
  { title: 'Authorization', restricted: false },
  { title: 'Accept', restricted: false },
  { title: 'Accept-Language', restricted: false },
  { title: 'Access-Control-Request-Headers', restricted: true },
  { title: 'Access-Control-Request-Method', restricted: true },
  { title: 'Accept-Charset', restricted: true },
  { title: 'Accept-Encoding', restricted: true },
  { title: 'Cache-Control', restricted: false },
  { title: 'Content-MD5', restricted: false },
  { title: 'Content-Type', restricted: false },
  { title: 'Cookie', restricted: false },
  { title: 'Content-Length', restricted: true },
  { title: 'Content-Transfer-Encoding', restricted: true },
  { title: 'Date', restricted: true },
  { title: 'Expect', restricted: true },
  { title: 'From', restricted: false },
  { title: 'Host', restricted: true },
  { title: 'If-Match', restricted: false },
  { title: 'If-Modified-Since', restricted: false },
  { title: 'If-None-Match', restricted: false },
  { title: 'If-Range', restricted: false },
  { title: 'If-Unmodified-Since', restricted: false },
  { title: 'Keep-Alive', restricted: true },
  { title: 'Max-Forwards', restricted: false },
  { title: 'Origin', restricted: true },
  { title: 'Pragma', restricted: false },
  { title: 'Proxy-Authorization', restricted: false },
  { title: 'Range', restricted: false },
  { title: 'Referer', restricted: true },
  { title: 'TE', restricted: true },
  { title: 'Trailer', restricted: true },
  { title: 'Transfer-Encoding', restricted: true },
  { title: 'Upgrade', restricted: true },
  { title: 'User-Agent', restricted: true },
  { title: 'Via', restricted: true },
  { title: 'Warning', restricted: false },
  { title: 'X-Requested-With', restricted: false },
  { title: 'X-Do-Not-Track', restricted: false },
  { title: 'DNT', restricted: false },
  { title: 'x-api-key', restricted: false },
  { title: 'Connection', restricted: true }
];
