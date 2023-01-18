import { ApiBodyType } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { BodyParam, HeaderParam } from 'eo/workbench/browser/src/app/shared/services/storage/db/models/apiData';

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
export type ContentType = (typeof CONTENT_TYPE_BY_ABRIDGE)[number]['value'];

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
    requestHeaders: any | HeaderParam[];
    requestBodyType: number | ApiBodyType.FormData | ApiBodyType.Raw;
    requestBody: any | BodyParam[] | string;
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
