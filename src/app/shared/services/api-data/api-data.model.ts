import { StorageModel } from '../../../modules/storage/storage.model';
import { ApiEditBody, ApiEditHeaders } from './api-edit-params.model';
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
