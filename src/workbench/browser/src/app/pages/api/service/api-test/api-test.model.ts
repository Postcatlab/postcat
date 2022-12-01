export enum ApiTestParamsTypeFormData {
  text = 'string',
  file = 'file',
}
export const CONTENT_TYPE_BY_ABRIDGE = [
  {
    title: 'Auto',
    value: '',
  },
  {
    title: 'application/x-www-form-urlencoded',
    value: 'application/x-www-form-urlencoded',
  },
  {
    title: 'multipart/form-data',
    value: 'multipart/form-data',
  },
  {
    title: 'Text(text/plain)',
    value: 'text/plain',
  },
  {
    title: 'JSON(application/json)',
    value: 'application/json',
  },
  {
    title: 'Javascript(application/javascript)',
    value: 'application/javascript',
  },
  {
    title: 'XML(application/xml)',
    value: 'application/xml',
  },
  {
    title: 'XML(text/xml)',
    value: 'text/xml',
  },
  {
    title: 'HTML(text/html)',
    value: 'text/html',
  },
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
  Binary = 'binary',
}
