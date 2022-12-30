import { JsonRootType, RequestMethod, RequestProtocol } from '../../../../../../modules/api-shared/api.model';

export enum ApiTestParamsTypeFormData {
  text = 'string',
  file = 'file'
}
export const CONTENT_TYPE_BY_ABRIDGE = [
  {
    title: 'Text',
    value: 'text/plain'
  },
  {
    title: 'JSON',
    value: 'application/json'
  },
  {
    title: 'XML',
    value: 'application/xml'
  },
  {
    title: 'HTML',
    value: 'text/html'
  },
  {
    title: 'Javascript',
    value: 'application/javascript'
  }
] as const;
export type ContentType = typeof CONTENT_TYPE_BY_ABRIDGE[number]['value'];
interface BasiApiTestParams {
  /**
   * send this param when test
   */
  required: boolean;
  /**
   * param name
   */
  name: string;
  /**
   * param value
   */
  value: string;
}
export type ApiTestHeaders = BasiApiTestParams;
export type ApiTestQuery = BasiApiTestParams;
export type ApiTestRest = BasiApiTestParams;
export interface ApiTestBody extends BasiApiTestParams {
  /**
   * param type
   */
  type: string;
  /**
   * If value is file,value is base64 string
   */
  files?: string;
  /**
   * XML attribute
   */
  attribute?: string;
  /**
   * child param
   */
  children?: ApiTestBody[];
}

export enum ApiTestBodyType {
  'Form-data' = 'formData',
  Raw = 'raw',
  Binary = 'binary'
}

export interface ApiTestHistoryResponse {
  headers: object[];
  statusCode: number;
  body: string;
  contentType: string;
  responseType: 'text' | 'longText' | 'stream';
  blobFileName?: string;
  responseLength: number;
  testDeny: string;
  /**
   * Inject Code println
   */
  reportList: Array<{ type: 'throw' | 'interrupt'; content: string }>;
}

/**
 * General indicators
 *
 * @type {object}
 */
export interface ApiTestResGeneral {
  downloadRate: string;
  downloadSize: number;
  redirectTimes: number;
  time: string;
  timingSummary: Array<{
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
  }>;
}

export interface ApiTestHistoryFrame {
  /**
   * General indicators
   *
   * @type {object}
   */
  general: {
    downloadRate: string;
    downloadSize: number;
    redirectTimes: number;
    time: string;
    timingSummary: Array<{
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
    }>;
  };
  beforeScript: string;
  afterScript: string;
  /**
   * HTTP Request
   *
   * @type {object}
   */
  request: {
    uri: string;
    protocol: string;
    method: string;
    requestHeaders: any | ApiTestHeaders[];
    requestBodyType: string | 'formData' | 'raw';
    requestBody: any | object[] | string;
  };

  /**
   * HTTP response
   *
   * @type {object}
   */
  response: {
    headers: any[];
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
 * API Test Data
 * Only has request info
 */
export interface ApiTestData {
  /**
   * For adding test history
   */
  uuid: number;
  projectID: number;
  groupID: number;
  /**
   * For adding test history
   */
  name?: string;
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
   * 请求的参数类型
   *
   * @type {ApiTestBodyType|string}
   */
  requestBodyType?: ApiTestBodyType | string;

  /**
   * 请求头数据，数据用json存储
   */
  requestHeaders?: ApiTestHeaders[];

  /**
   * 请求的 JSON 参数根类型
   *
   * @type {JsonRootType|string}
   */
  requestBodyJsonType?: JsonRootType | string;

  /**
   * 请求参数(多层结构)，数据用json存储
   *
   */
  requestBody?: ApiTestBody[] | string;

  /**
   * get请求参数，数据用json存储
   *
   * @type {object[]}
   */
  queryParams?: ApiTestQuery[];

  /**
   * rest请求参数，数据用json存储
   *
   * @type {object[]}
   */
  restParams?: Array<Record<string, any>>;
  /**
   * Javascript code before test
   */
  beforeScript?: string;
  /**
   * Javascript code after api response
   */
  afterScript?: string;
}
