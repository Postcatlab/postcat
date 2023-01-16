import { isNumber } from '@micro-zoe/micro-app/libs/utils';
import { reverseObjKV } from 'eo/workbench/browser/src/app/shared/services/storage/db/utils';

export enum ProtocolEnum {
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

export const protocalMap = reverseObjKV(ProtocolEnum);

export enum RequestMethodEnum {
  POST = 0,
  GET = 1,
  PUT = 2,
  DELETE = 3,
  HEAD = 4,
  OPTIONS = 5,
  PATCH = 6
}

export const requestMethodMap = reverseObjKV(RequestMethodEnum);

export enum ContentTypeEnum {
  FROM_DATA = 0,
  RAW = 1,
  JSON_OBJECT = 2,
  XML = 3,
  BINARY = 4,
  OTHER = 5,
  JSON_ARRAY = 6
}
export enum ApiBodyType {
  FormData = 0,
  Raw = 1,
  JSON = 2,
  JSONArray = 6,
  XML = 3,
  Binary = 4
}
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
