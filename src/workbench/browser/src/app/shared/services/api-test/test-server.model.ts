import { Environment, ApiTestHistoryResponse, ApiTestResGeneral, ApiTestHistoryFrame } from '../storage/index.model';
export interface ApiTestRes {
  status: 'finish' | 'error';
  id: number;
  response: ApiTestHistoryResponse | any;
  report?: any;
  general?: ApiTestResGeneral;
  history?: ApiTestHistoryFrame | any;
}
export interface TestServer {
  init: (receiveMessage: (message: any) => void) => void;
  send: (action: string, message: any) => void;
  formatRequestData: (apiData, opts: requestDataOpts) => any;
  formatResponseData: (res) => ApiTestRes;
  close: () => void;
}

export interface requestDataOpts {
  env: Environment;
  beforeScript: string;
  afterScript: string;
  lang: string;
}
