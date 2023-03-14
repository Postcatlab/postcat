import { Environment } from '../../../../../../services/storage/index.model';
/**
 * Test response from  test server to ui
 */
export interface TestServerRes {
  status: 'finish' | 'error';
  id: string;
  response: ApiTestResData;
  globals?: object;
}
export interface ApiTestResHeader {
  name: string;
  value: string;
}
export interface ApiTestResData {
  statusCode: number;
  time: string;
  /**
   * Inject Code println
   */
  reportList: Array<{ type: 'throw' | 'interrupt'; content: string }>;
  downloadRate: string;
  downloadSize: number;
  redirectTimes: number;
  responseLength: number;
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

  responseType: 'text' | 'longText' | 'stream';
  blobFileName?: string;
  //Response Content Type
  contentType: string;
  headers: ApiTestResHeader[];
  body: string;
  request: {
    uri: string;
    body: string | object;
    headers: ApiTestResHeader[];
    contentType: 'formdata' | 'raw' | 'binary';
  };
}

export interface TestServer {
  init: (receiveMessage: (message: any) => void) => void;
  send: (action: string, message: any) => void;
  /**
   * Format UI Request Data To Server Request Data
   *
   * @param input
   */
  formatRequestData: (apiData, opts: requestDataOpts) => any;
  /**
   * Format TestResult to TestData
   *
   * @param report test result after test finish
   * @param history storage test history
   */
  formatResponseData: (res) => TestServerRes;
  close: () => void;
}

export interface requestDataOpts {
  env: Environment | any;
  globals: object;
  lang: string;
}
