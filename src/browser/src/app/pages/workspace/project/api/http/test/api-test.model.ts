import { ApiBodyType } from 'pc/browser/src/app/modules/api-shared/api.model';
import { BodyParam, HeaderParam } from 'pc/browser/src/app/shared/services/storage/db/models/apiData';

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
