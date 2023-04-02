import { ApiTestResData } from 'pc/browser/src/app/pages/workspace/project/api/service/test-server/test-server.model';
import { ApiCase } from 'pc/browser/src/app/services/storage/db/models';
import { ApiData } from 'pc/browser/src/app/services/storage/db/models/apiData';

export const WHAT_TEXT_TYPE_MAP = {
  xml: 'application/xml',
  json: 'application/json',
  html: 'text/html',
  text: 'text/plain'
} as const;
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
export const FORMDATA_CONTENT_TYPE_BY_ABRIDGE = [
  {
    title: 'x-www-form-urlencoded',
    value: 'application/x-www-form-urlencoded'
  },
  {
    title: 'multipart/form-data',
    value: 'multipart/form-data'
  }
] as const;
export type ContentType = (typeof CONTENT_TYPE_BY_ABRIDGE)[number]['value'] | (typeof FORMDATA_CONTENT_TYPE_BY_ABRIDGE)[number]['value'];

export interface testViewModel {
  testStartTime?: number;
  /**
   * User selected content type
   */
  userSelectedContentType: ContentType;
  requestTabIndex: number;
  responseTabIndex: number;
  request: Partial<ApiData | ApiCase>;
  testResult: ApiTestResData;
}

export enum TestPage {
  Blank = 'blankTest',
  History = 'historyTest',
  Case = 'caseTest',
  API = 'apiTest'
}
