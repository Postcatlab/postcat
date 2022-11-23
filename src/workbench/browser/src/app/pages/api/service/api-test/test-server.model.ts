import { Environment, ApiTestHistoryResponse, ApiTestResGeneral, ApiTestHistoryFrame } from '../../../../shared/services/storage/index.model';
/**
 * Test response from  test server to ui
 */
export interface ApiTestRes {
  status: 'finish' | 'error';
  id: string;
  response: ApiTestHistoryResponse | any;
  request?: any;
  globals?: object;
  general?: ApiTestResGeneral;
  /**
   * Test history
   */
  history?: ApiTestHistoryFrame;
}
export interface TestServer {
  init: (receiveMessage: (message: any) => void) => void;
  send: (action: string, message: any) => void;
  formatRequestData: (apiData, opts: requestDataOpts) => any;
  formatResponseData: (res) => ApiTestRes;
  close: () => void;
}

export interface requestDataOpts {
  env: Environment | any;
  globals: object;
  beforeScript: string;
  afterScript: string;
  lang: string;
}
