import { ApiBodyType } from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { AuthInfo } from 'pc/browser/src/app/pages/workspace/project/api/constants/auth.model';
import { RequestMethod } from 'pc/browser/src/app/services/storage/db/dataSource/oldApiData';

/**
 * Group list api data
 */
export interface ApiDataFromList extends ApiData {
  requestMethod?: number;
}

export interface ViewParamAttr extends ParamAttr {
  //string[]
  paramValueList?: any;
}

export interface ApiBaseRequest {
  apiAttrInfo: ApiAttrInfo;
  requestParams: RequestParams;
  authInfo?: AuthInfo;
}
export interface ApiData extends ApiBaseRequest {
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
  dubboApiAttrInfo?: DubboApiAttrInfo;
  soapApiAttrInfo?: SoapApiAttrInfo;
  grpcApiAttrInfo?: GrpcApiAttrInfo;
  responseList: ResponseList[];
  resultList?: ResultList[];
  writeHistory?: number;
  historyInfo?: HistoryInfo;
  //Use for view
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
  authInfo?: AuthInfo;
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
  paramAttr?: ParamAttr;
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
  paramAttr?: ParamAttr;
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
  paramAttr?: ParamAttr;
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
  paramAttr?: ParamAttr;
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
