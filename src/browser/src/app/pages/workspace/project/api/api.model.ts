import { ColumnItem, TableProSetting } from '../../../../components/eo-ui/table-pro/table-pro.model';
import { enumsToArr, enumsToObject } from '../../../../shared/utils/index.utils';
import { ApiTestResData } from './service/test-server/test-server.model';
/**
 * API body FormData param type
 */
export enum ApiParamsType {
  string = 0,
  file = 1,
  json = 2,
  int = 3,
  float = 4,
  double = 5,
  date = 6,
  datetime = 7,
  boolean = 8,
  byte = 9,
  short = 10,
  long = 11,
  array = 12,
  object = 13,
  number = 14,
  null = 15
}

export const DEFAULT_UNIT_TEST_RESULT: { response: ApiTestResData } = {
  response: {
    redirectTimes: 0,
    downloadSize: 0,
    downloadRate: '0',
    time: '0',
    statusCode: 0,
    timingSummary: [],
    headers: [],
    responseLength: 0,
    responseType: 'text',
    contentType: 'text/html',
    body: $localize`The test service connection failed, please submit an Issue to contact the community`,
    reportList: [],
    request: {
      uri: 'http:///',
      headers: [{ name: 'Content-Type', value: 'application/json' }],
      body: '{}',
      contentType: 'raw'
    }
  }
};
export enum ContentType {
  FROM_DATA = 0,
  RAW = 1,
  JSON_OBJECT = 2,
  XML = 3,
  BINARY = 4,
  OTHER = 5,
  JSON_ARRAY = 6
}
export enum Protocol {
  HTTP = 0,
  HTTPS = 1,
  WS = 2,
  WSS = 3,
  TCP = 4,
  UDP = 5,
  SOCKET = 6,
  WEBSOCKET = 7,
  SOAP = 8,
  HSF = 9,
  DUBBO = 10,
  GRPC = 11
}

export const protocalMap = enumsToObject(Protocol);

export const ApiParamsTypeByNumber = enumsToArr(ApiParamsType).map(val => ({
  title: val.key,
  value: val.value
}));
/**
 * API body Json or xml param type
 */
export enum ApiParamsTypeJsonOrXml {
  string = ApiParamsType.string,
  array = 12,
  object = 13,
  number = 14,
  json = 2,
  int = 3,
  float = 4,
  double = 5,
  date = 6,
  datetime = 7,
  boolean = 8,
  short = 10,
  long = 11,
  null = 15
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

export enum RequestMethod {
  POST = 0,
  GET = 1,
  PUT = 2,
  DELETE = 3,
  HEAD = 4,
  OPTIONS = 5,
  PATCH = 6
}

export const requestMethodMap = enumsToObject(RequestMethod);

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

export enum ApiBodyType {
  FormData = 0,
  JSON = 2,
  JSONArray = 6,
  XML = 3,
  Raw = 1,
  Binary = 4
}
export const API_BODY_TYPE = [
  {
    key: 'Form-Data',
    value: ApiBodyType.FormData
  },
  {
    key: 'JSON',
    value: ApiBodyType.JSON
  },
  {
    key: 'XML',
    value: ApiBodyType.XML
  },
  {
    key: 'Raw',
    value: ApiBodyType.Raw
  },
  {
    key: 'Binary',
    value: ApiBodyType.Binary
  }
];
/**
 * Json Root Type
 *
 * @description body type is json,set root type of object/array
 */
export enum JsonRootType {
  Object = 2,
  Array = 6
}
/**
 * Import string by api body type
 */
export const IMPORT_MUI = {
  2: 'json',
  3: 'xml',
  4: 'binary',
  1: 'raw',
  0: 'formData',
  6: 'json'
};
