import { OpenAPIParser } from './OpenAPIParser';
import type { OpenAPIV3 } from './type';

export const parseOpenAPI = (openapi: any) => {
  if (Object.keys(openapi).length === 0) {
    return [null, { msg: '请上传合法的文件' }];
  }

  const openapiVersion = openapi.openapi || openapi['swagger'];

  if (!openapiVersion && !openapiVersion) {
    return [null, { msg: '文件不合法，缺乏 OpenAPI 字段' }];
  }

  if (Number.parseFloat(openapiVersion) < 3) {
    return [null, { msg: '仅支持 openapi 3.0 以上版本' }];
  }

  const data = new OpenAPIParser(openapi).data;
  return [data, null];
};
