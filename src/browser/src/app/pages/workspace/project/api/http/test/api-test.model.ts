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
    title: 'form-data',
    value: 'multiple/form-data'
  }
] as const;
export type ContentType = (typeof CONTENT_TYPE_BY_ABRIDGE)[number]['value'] | (typeof FORMDATA_CONTENT_TYPE_BY_ABRIDGE)[number]['value'];
