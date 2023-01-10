export interface ApiDataDto {
  apiList: ApiList[];
  projectUuid: string;
  workSpaceUuid: string;
}

export interface ApiList {
  id: number;
  groupId: number;
  groupName: string;
  projectId: number;
  lifecycle: number;
  name: string;
  uri: string;
  protocol: number;
  status: number;
  starred: number;
  encoding: string;
  isShared: number;
  tag: string;
  orderNum: number;
  hashkey: string;
  managerId: number;
  managerName: string;
  updateUserId: number;
  updateUserName: string;
  createUserId: number;
  createUserName: string;
  createTime: number;
  updateTime: number;
  introduction: Introduction;
  relation: Relation;
  apiAttrInfo: ApiAttrInfo;
  dubboApiAttrInfo: DubboApiAttrInfo;
  soapApiAttrInfo: SoapApiAttrInfo;
  grpcApiAttrInfo: GrpcApiAttrInfo;
  requestParams: RequestParams;
  responseList: ResponseList[];
  resultList: ResultList[];
  writeHistory: number;
  historyInfo: HistoryInfo;
}

export interface Introduction {
  apiUuid: string;
  noteType: number;
  noteRaw: string;
  note: string;
  createTime: number;
  updateTime: number;
}

export interface Relation {
  apiUuid: string;
  bindAmtApiId: number;
  swaggerId: string;
  fileName: string;
  fileUrl: string;
  fileId: string;
}

export interface ApiAttrInfo {
  beforeInject: string;
  afterInject: string;
  authInfo: string;
  requestMethod: number;
  contentType: number;
  createTime: number;
  updateTime: number;
}

export interface DubboApiAttrInfo {
  serverHost: string;
  interfaceName: string;
  methodName: string;
  appName: string;
  group: string;
  version: string;
  apiNumber: number;
  createTime: number;
  updateTime: number;
}

export interface SoapApiAttrInfo {
  beforeInject: string;
  afterInject: string;
  authInfo: string;
  requestMethod: number;
  contentType: number;
  wsdlContent: string;
  testData: string;
  soapOperation: string;
  soapAction: string;
  soapBinding: string;
  soapService: string;
  createTime: number;
  updateTime: number;
}

export interface GrpcApiAttrInfo {
  authInfo: string;
  serverHost: string;
  interfaceName: string;
  methodName: string;
  appName: string;
  group: string;
  version: string;
  proto: string;
  apiRequestMetadata: string;
  responseMetadata: string;
  responseTrailingMetadata: string;
  createTime: number;
  updateTime: number;
}

export interface RequestParams {
  headerParams: HeaderParam[];
  bodyParams: BodyParam[];
  queryParams: QueryParam[];
  restParams: RestParam[];
}

export interface HeaderParam {
  responseUuid: string;
  name: string;
  paramType: number;
  partType: number;
  dataType: number;
  dataTypeValue: string;
  structureId: number;
  structureParamId: string;
  contentType: string;
  isRequired: number;
  binaryRawData: string;
  description: string;
  orderNo: number;
  createTime: number;
  updateTime: number;
  paramAttr: ParamAttr;
  childList: any[];
}

export interface ParamAttr {
  minLength: number;
  maxLength: number;
  minValue: MinValue;
  maxValue: MaxValue;
  paramLimit: string;
  paramValueList: string;
  paramMock: string;
  attr: string;
  structureIsHide: number;
  example: string;
  createTime: number;
  updateTime: number;
  dbArr: string;
  paramNote: string;
}

export interface MinValue {}

export interface MaxValue {}

export interface BodyParam {
  responseUuid: string;
  name: string;
  paramType: number;
  partType: number;
  dataType: number;
  dataTypeValue: string;
  structureId: number;
  structureParamId: string;
  contentType: string;
  isRequired: number;
  binaryRawData: string;
  description: string;
  orderNo: number;
  createTime: number;
  updateTime: number;
  paramAttr: ParamAttr2;
  childList: any[];
}

export interface ParamAttr2 {
  minLength: number;
  maxLength: number;
  minValue: MinValue2;
  maxValue: MaxValue2;
  paramLimit: string;
  paramValueList: string;
  paramMock: string;
  attr: string;
  structureIsHide: number;
  example: string;
  createTime: number;
  updateTime: number;
  dbArr: string;
  paramNote: string;
}

export interface MinValue2 {}

export interface MaxValue2 {}

export interface QueryParam {
  responseUuid: string;
  name: string;
  paramType: number;
  partType: number;
  dataType: number;
  dataTypeValue: string;
  structureId: number;
  structureParamId: string;
  contentType: string;
  isRequired: number;
  binaryRawData: string;
  description: string;
  orderNo: number;
  createTime: number;
  updateTime: number;
  paramAttr: ParamAttr3;
  childList: any[];
}

export interface ParamAttr3 {
  minLength: number;
  maxLength: number;
  minValue: MinValue3;
  maxValue: MaxValue3;
  paramLimit: string;
  paramValueList: string;
  paramMock: string;
  attr: string;
  structureIsHide: number;
  example: string;
  createTime: number;
  updateTime: number;
  dbArr: string;
  paramNote: string;
}

export interface MinValue3 {}

export interface MaxValue3 {}

export interface RestParam {
  responseUuid: string;
  name: string;
  paramType: number;
  partType: number;
  dataType: number;
  dataTypeValue: string;
  structureId: number;
  structureParamId: string;
  contentType: string;
  isRequired: number;
  binaryRawData: string;
  description: string;
  orderNo: number;
  createTime: number;
  updateTime: number;
  paramAttr: ParamAttr4;
  childList: any[];
}

export interface ParamAttr4 {
  minLength: number;
  maxLength: number;
  minValue: MinValue4;
  maxValue: MaxValue4;
  paramLimit: string;
  paramValueList: string;
  paramMock: string;
  attr: string;
  structureIsHide: number;
  example: string;
  createTime: number;
  updateTime: number;
  dbArr: string;
  paramNote: string;
}

export interface MinValue4 {}

export interface MaxValue4 {}

export interface ResponseList {
  responseUuid: string;
  apiUuid: string;
  name: string;
  httpCode: string;
  contentType: number;
  isDefault: number;
  createTime: number;
  updateTime: number;
  responseParams: ResponseParams;
}

export interface ResponseParams {
  headerParams: HeaderParam2[];
  bodyParams: BodyParam2[];
  queryParams: QueryParam2[];
  restParams: RestParam2[];
}

export interface HeaderParam2 {
  responseUuid: string;
  name: string;
  paramType: number;
  partType: number;
  dataType: number;
  dataTypeValue: string;
  structureId: number;
  structureParamId: string;
  contentType: string;
  isRequired: number;
  binaryRawData: string;
  description: string;
  orderNo: number;
  createTime: number;
  updateTime: number;
  paramAttr: ParamAttr5;
  childList: any[];
}

export interface ParamAttr5 {
  minLength: number;
  maxLength: number;
  minValue: MinValue5;
  maxValue: MaxValue5;
  paramLimit: string;
  paramValueList: string;
  paramMock: string;
  attr: string;
  structureIsHide: number;
  example: string;
  createTime: number;
  updateTime: number;
  dbArr: string;
  paramNote: string;
}

export interface MinValue5 {}

export interface MaxValue5 {}

export interface BodyParam2 {
  responseUuid: string;
  name: string;
  paramType: number;
  partType: number;
  dataType: number;
  dataTypeValue: string;
  structureId: number;
  structureParamId: string;
  contentType: string;
  isRequired: number;
  binaryRawData: string;
  description: string;
  orderNo: number;
  createTime: number;
  updateTime: number;
  paramAttr: ParamAttr6;
  childList: any[];
}

export interface ParamAttr6 {
  minLength: number;
  maxLength: number;
  minValue: MinValue6;
  maxValue: MaxValue6;
  paramLimit: string;
  paramValueList: string;
  paramMock: string;
  attr: string;
  structureIsHide: number;
  example: string;
  createTime: number;
  updateTime: number;
  dbArr: string;
  paramNote: string;
}

export interface MinValue6 {}

export interface MaxValue6 {}

export interface QueryParam2 {
  responseUuid: string;
  name: string;
  paramType: number;
  partType: number;
  dataType: number;
  dataTypeValue: string;
  structureId: number;
  structureParamId: string;
  contentType: string;
  isRequired: number;
  binaryRawData: string;
  description: string;
  orderNo: number;
  createTime: number;
  updateTime: number;
  paramAttr: ParamAttr7;
  childList: any[];
}

export interface ParamAttr7 {
  minLength: number;
  maxLength: number;
  minValue: MinValue7;
  maxValue: MaxValue7;
  paramLimit: string;
  paramValueList: string;
  paramMock: string;
  attr: string;
  structureIsHide: number;
  example: string;
  createTime: number;
  updateTime: number;
  dbArr: string;
  paramNote: string;
}

export interface MinValue7 {}

export interface MaxValue7 {}

export interface RestParam2 {
  responseUuid: string;
  name: string;
  paramType: number;
  partType: number;
  dataType: number;
  dataTypeValue: string;
  structureId: number;
  structureParamId: string;
  contentType: string;
  isRequired: number;
  binaryRawData: string;
  description: string;
  orderNo: number;
  createTime: number;
  updateTime: number;
  paramAttr: ParamAttr8;
  childList: any[];
}

export interface ParamAttr8 {
  minLength: number;
  maxLength: number;
  minValue: MinValue8;
  maxValue: MaxValue8;
  paramLimit: string;
  paramValueList: string;
  paramMock: string;
  attr: string;
  structureIsHide: number;
  example: string;
  createTime: number;
  updateTime: number;
  dbArr: string;
  paramNote: string;
}

export interface MinValue8 {}

export interface MaxValue8 {}

export interface ResultList {
  id: number;
  name: string;
  httpCode: string;
  httpContentType: string;
  type: number;
  content: string;
  createTime: number;
  updateTime: number;
}

export interface HistoryInfo {
  oldId: number;
  updateDesc: string;
  versionId: number;
  projectVersionId: number;
}
