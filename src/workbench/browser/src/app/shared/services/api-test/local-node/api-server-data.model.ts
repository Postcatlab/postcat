/**
 * Test Server need  transfer from ui API data
 */
export interface TestLocalNodeData {
  URL: string;
  /**
   * Request Method,GET/POST/PUT...
   * @type {string}
   */
  method: string;
  /**
   * Request Method ID,0,1,2...
   * @type {string}
   */
  methodType: string;
  /**
   * API  protocal type
   * @type {string}
   */
  httpHeader: number;

  /**
   * API request body type
   * @type {string}
   */
  requestType: string;
  /**
   * json root type when request body is json
   * @type {string}
   */
  apiRequestParamJsonType: string;
  headers: {
    checkbox: boolean;
    headerName: string;
    headerValue: string;
  }[];
  /**
   * request body
   * @type {string|array}
   */
  params:string|{
    checkbox: boolean;
    paramKey: string;
    paramType: string;
    /**
     * value
     */
    paramInfo: string;
    childList: object[];
  }[];
  /**
   * request auth,baisc auth/jwt
   * @type {object}
   */
  auth: { status: string; [propName: string]: any };
  /**
   * execute script before test
   * @type {string}
   */
  beforeInject?: null;
  /**
   * execute script after response
   * @type {string}
   */
  afterInject?: null;

  /**
   * advanced http setting
   * @type {string}
   */
  advancedSetting: {
    requestRedirect: number;
    checkSSL: number;
    sendEoToken: number;
    sendNocacheToken: number;
  };
  env: any;
  testTime: string;
  globals?: object;
  globalHeader?: object;
}
