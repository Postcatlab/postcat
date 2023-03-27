import { ApiBodyType, RequestMethod } from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';

export interface ApiDataBulkCreateDto {
  apiList: Partial<ApiData[]>;
  projectUuid: string;
  workSpaceUuid: string;
}

export interface ApiDataUpdateDto {
  api: Partial<ApiData>;
  projectUuid: string;
  workSpaceUuid: string;
}

export interface ApiDataPageDto {
  projectUuid: string;
  workSpaceUuid: string;
  groupIds?: number[];
  keyword?: string;
  /** 排序正逆 ASC DESC(默认) */
  sort?: string;
  /** 排序字段 默认api_update_time */
  order?: string;
  page?: number;
  pageSize?: number;
}

export interface ApiDataBulkReadDto {
  projectUuid: string;
  workSpaceUuid?: string;
}

export interface ApiDataBulkReadDetailDto {
  apiUuids: string[];
  projectUuid: string;
  workSpaceUuid: string;
}

export interface ApiDataDeleteDto {
  apiUuids: string[];
  projectUuid: string;
  workSpaceUuid: string;
}

export interface ApiData {
  id?: number;
  apiUuid?: string;
  projectUuid?: string;
  workSpaceUuid?: string;
  groupId?: number;
  groupName?: string;
  projectId?: number;
  lifecycle?: number;
  name: string;
  uri: string;
  protocol: number;
  status?: number;
  starred?: number;
  encoding?: string;
  isShared?: number;
  tag?: string;
  orderNum?: number;
  /** 这个仅用于分组排序 */
  sort?: number;
  hashkey?: string;
  managerId?: number;
  managerName?: string;
  updateUserId?: number;
  updateUserName?: string;
  createUserId?: number;
  createUserName?: string;
  createTime?: number;
  updateTime?: number;
  introduction?: Introduction;
  relation?: Relation;
  apiAttrInfo: ApiAttrInfo;
  dubboApiAttrInfo?: DubboApiAttrInfo;
  soapApiAttrInfo?: SoapApiAttrInfo;
  grpcApiAttrInfo?: GrpcApiAttrInfo;
  requestParams: RequestParams;
  responseList: ResponseList[];
  resultList?: ResultList[];
  writeHistory?: number;
  historyInfo?: HistoryInfo;
  authInfo?: any;
  script?: {
    beforeScript: '';
    afterScript: '';
  };
}

export interface Introduction {
  apiUuid?: string;
  noteType?: number;
  noteRaw?: string;
  note?: string;
  createTime?: number;
  updateTime?: number;
}

export interface Relation {
  apiUuid?: string;
  bindAmtApiId?: number;
  swaggerId?: string;
  fileName?: string;
  fileUrl?: string;
  fileId?: string;
}

export interface ApiAttrInfo {
  contentType: ApiBodyType | number;
  requestMethod?: RequestMethod;
  beforeInject?: string;
  afterInject?: string;
  authInfo?: string;
  createTime?: number;
  updateTime?: number;
}

export interface DubboApiAttrInfo {
  serverHost?: string;
  interfaceName?: string;
  methodName?: string;
  appName?: string;
  group?: string;
  version?: string;
  apiNumber?: number;
  createTime?: number;
  updateTime?: number;
}

export interface SoapApiAttrInfo {
  beforeInject?: string;
  afterInject?: string;
  authInfo?: string;
  requestMethod?: number;
  contentType?: number;
  wsdlContent?: string;
  testData?: string;
  soapOperation?: string;
  soapAction?: string;
  soapBinding?: string;
  soapService?: string;
  createTime?: number;
  updateTime?: number;
}

export interface GrpcApiAttrInfo {
  authInfo?: string;
  serverHost?: string;
  interfaceName?: string;
  methodName?: string;
  appName?: string;
  group?: string;
  version?: string;
  proto?: string;
  apiRequestMetadata?: string;
  responseMetadata?: string;
  responseTrailingMetadata?: string;
  createTime?: number;
  updateTime?: number;
}

export interface RequestParams {
  headerParams?: HeaderParam[];
  bodyParams?: BodyParam[];
  queryParams?: QueryParam[];
  restParams?: RestParam[];
}

export interface HeaderParam {
  responseUuid?: string;
  name?: string;
  partType?: number;
  structureId?: number;
  structureParamId?: string;
  contentType?: string;
  isRequired?: number;
  binaryRawData?: string;
  description?: string;
  orderNo?: number;
  createTime?: number;
  updateTime?: number;
  paramAttr?: ParamAttr | ViewParamAttr;
}

interface ParamAttr {
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  paramLimit?: string;
  paramValueList?: string;
  paramMock?: string;
  attr?: string;
  structureIsHide?: number;
  example?: string;
  createTime?: number;
  updateTime?: number;
  dbArr?: string;
  paramNote?: string;
}
export interface ViewParamAttr extends ParamAttr {
  //string[]
  paramValueList?: any;
}

export enum ParamTypeEnum {
  REQUEST = 0,
  RESPONSE = 1
}

export interface BodyParam {
  responseUuid?: string;
  name?: string;
  paramType?: ParamTypeEnum;
  partType?: number;
  dataType?: number;
  dataTypeValue?: string;
  structureId?: number;
  structureParamId?: string;
  isRequired?: number;
  binaryRawData?: string;
  description?: string;
  orderNo?: number;
  createTime?: number;
  updateTime?: number;
  paramAttr?: ParamAttr | ViewParamAttr;
  childList?: BodyParam[];
}

export interface QueryParam {
  responseUuid?: string;
  name?: string;
  paramType?: ParamTypeEnum;
  partType?: number;
  structureId?: number;
  structureParamId?: string;
  contentType?: string;
  isRequired?: number;
  binaryRawData?: string;
  description?: string;
  orderNo?: number;
  createTime?: number;
  updateTime?: number;
  paramAttr?: ParamAttr | ViewParamAttr;
  childList?: QueryParam[];
}

export interface RestParam {
  responseUuid?: string;
  name?: string;
  paramType?: ParamTypeEnum;
  partType?: number;
  dataTypeValue?: string;
  structureId?: number;
  structureParamId?: string;
  contentType?: string;
  isRequired?: number;
  binaryRawData?: string;
  description?: string;
  orderNo?: number;
  createTime?: number;
  updateTime?: number;
  paramAttr?: ParamAttr | ViewParamAttr;
  childList?: RestParam[];
}

export interface ResponseList {
  responseUuid?: string;
  apiUuid?: string;
  name?: string;
  httpCode?: string;
  contentType?: number;
  isDefault: number;
  createTime?: number;
  updateTime?: number;
  responseParams: ResponseParams;
}

export interface ResponseParams {
  headerParams?: HeaderParam[];
  bodyParams?: BodyParam[];
}

export interface ResultList {
  id?: number;
  name?: string;
  httpCode?: string;
  httpContentType?: string;
  type?: number;
  content?: string;
  createTime?: number;
  updateTime?: number;
}

export interface HistoryInfo {
  oldId: number;
  updateDesc: string;
  versionId: number;
  projectVersionId: number;
}
