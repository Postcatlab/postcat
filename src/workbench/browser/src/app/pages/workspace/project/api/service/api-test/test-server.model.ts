import { Environment } from '../../../../../../shared/services/storage/index.model';
/**
 * Test response from  test server to ui
 */
export interface TestServerRes {
  status: 'finish' | 'error';
  id: string;
  response: ApiTestResData;
  globals?: object;
}
export interface ApiTestResData {
  statusCode: number;
  /**
   * Inject Code println
   */
  reportList: Array<{ type: 'throw' | 'interrupt'; content: string }>;
  downloadRate: string;
  downloadSize: number;
  redirectTimes: number;
  time: string;
  contentType: string;
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
  headers: object[];
  body: string;
  responseType: 'text' | 'longText' | 'stream';
  blobFileName?: string;
  responseLength: number;
  testDeny: string;
  request: {
    body: '';
    headers: [];
    contentType: 'formdata' | 'raw';
  };
}

export interface TestServer {
  init: (receiveMessage: (message: any) => void) => void;
  send: (action: string, message: any) => void;
  formatRequestData: (apiData, opts: requestDataOpts) => any;
  formatResponseData: (res) => TestServerRes;
  close: () => void;
}

export interface requestDataOpts {
  env: Environment | any;
  globals: object;
  lang: string;
}
