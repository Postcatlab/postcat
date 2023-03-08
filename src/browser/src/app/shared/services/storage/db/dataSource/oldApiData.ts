export type eoAPIType = {
  version: string;
  environment: string;
  group: Array<{ name: string; uuid: number }>;
  project: { name: string };
  apiData: ApiData[];
};

export type ValueOf<T> = T[keyof T];

export type ApiGroup = {
  /** 名称 */
  name?: string;
  /** 子节点 */
  children?: Child[];
};

export type Child = ApiGroup | ApiData;

export type EnvParameters = {
  name: string;
  value: string;
  description?: string;
};

export type Environment = {
  /** 名称  */
  name: string;
  /** 前置url  */
  hostUri: string;
  /** 环境变量（可选）*/
  parameters?: EnvParameters[];
};

export type Collections = {
  collections: Child[];
  environments: Environment[];
};

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

export enum ApiBodyEnum {
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
export enum RequestProtocol {
  HTTP = 'http',
  HTTPS = 'https'
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

export type ApiEditBody = BasiApiEditParams & {
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
};

export type BasiApiEditParams = {
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
};
export type ApiEditHeaders = BasiApiEditParams;
export type ApiEditQuery = BasiApiEditParams;
export type ApiEditRest = BasiApiEditParams;

export interface ApiData {
  groupID?: number;
  /**
   * name
   *
   * @type {string}
   */
  name: string;

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
   * api show order
   *
   * @type {number}
   */
  weight?: number;

  /**
   * 请求的参数类型
   *
   * @type {ApiBodyType|string}
   */
  requestBodyType?: ApiBodyEnum;

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
  requestBodyJsonType?: JsonRootType;

  /**
   * 请求参数(多层结构)，数据用json存储
   *
   * @type {object}
   */
  requestBody: ApiEditBody[] | string;

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
   * @type {object}
   */
  responseHeaders?: ApiEditHeaders[];

  /**
   * Response(多层结构)，数据用json存储
   *
   * @type {ApiEditBody[] | string}
   */
  responseBody?: ApiEditBody[] | string;

  /**
   * 返回的参数类型
   *
   * @type {ApiBodyType|string}
   */
  responseBodyType?: ApiBodyEnum;

  /**
   * Responsejson根类型
   *
   * @type {JsonRootType|string}
   */
  responseBodyJsonType?: JsonRootType;
}
