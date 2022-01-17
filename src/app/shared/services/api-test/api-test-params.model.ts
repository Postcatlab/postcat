export enum ApiTestParamsTypeFormData {
  text = 'string',
  file = 'file',
}
export enum ApiTestParamsTypeJsonOrXml {
  string = 'string',
  boolean = 'boolean',
  array = 'array',
  object = 'object',
  number = 'number',
  null = 'null',
}
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
   * XML attribute
   */
  attribute?: string;
  /**
   * child param
   */
  children?: ApiTestBody[];
}
