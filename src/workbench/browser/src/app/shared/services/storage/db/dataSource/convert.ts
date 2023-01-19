import { ContentType, RequestMethod } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { ApiData, BodyParam } from 'eo/workbench/browser/src/app/shared/services/storage/db/models/apiData';

import { ApiData as OldApiData, Environment as OldEnvironment, BasiApiEditParams } from './oldApiData';

export const convertApiData = (apiData: OldApiData): ApiData => {
  const {
    name,
    uri,
    protocol,
    requestBody,
    queryParams,
    requestHeaders,
    restParams,
    responseHeaders,
    responseBody,
    method,
    requestBodyType,
    requestBodyJsonType,
    responseBodyType,
    responseBodyJsonType
  } = apiData;
  return {
    name,
    uri,
    protocol: ['http', 'https'].indexOf(protocol),
    apiAttrInfo: {
      requestMethod: RequestMethod[method.toLocaleUpperCase()],
      contentType: transformContentType(requestBodyType, requestBodyJsonType)
    },
    requestParams: {
      headerParams: transformParams(requestHeaders),
      queryParams: transformParams(queryParams),
      restParams: transformParams(restParams),
      bodyParams: transformRequestBody(requestBody)
    },
    responseList: [
      {
        isDefault: 1,
        contentType: transformContentType(responseBodyType, responseBodyJsonType),
        responseParams: {
          headerParams: transformParams(responseHeaders),
          bodyParams: transformRequestBody(responseBody)
        }
      }
    ]
  };
};

const transformContentType = (requestBodyType: OldApiData['responseBodyType'], requestBodyJsonType: OldApiData['requestBodyJsonType']) => {
  const type = requestBodyType?.toLocaleUpperCase();
  if (type === 'FORMDATA') {
    return ContentType.FROM_DATA;
  } else if (['RAW', 'XML', 'BINARY'].includes(type)) {
    return ContentType[type];
  } else if (type === 'JSON') {
    return requestBodyJsonType === 'object' ? ContentType.JSON_OBJECT : ContentType.JSON_ARRAY;
  } else {
    return ContentType.RAW;
  }
};

const transformParams = (params: BasiApiEditParams[] = []): BodyParam[] => {
  return params?.map((n, i) => ({
    name: n.name,
    orderNo: i,
    description: n.description,
    isRequired: Number(n.required),
    paramAttr: {
      example: n.example,
      paramValueList: JSON.stringify(n.enum)
    }
  }));
};

const transformRequestBody = (requestBody: OldApiData['requestBody'] = []): BodyParam[] => {
  if (typeof requestBody === 'string') {
    return requestBody
      ? [
          {
            name: '',
            isRequired: 1,
            binaryRawData: requestBody,
            paramAttr: {}
          }
        ]
      : [];
  } else {
    const bodyParams = transformParams(requestBody);
    bodyParams?.forEach((item, index) => {
      item.paramAttr.minLength = requestBody[index].minLength;
      item.paramAttr.maxLength = requestBody[index].maxLength;
      item.paramAttr.maxValue = requestBody[index].maximum;
      item.paramAttr.minValue = requestBody[index].minimum;

      if (requestBody[index]?.children) {
        item.childList = transformRequestBody(requestBody[index]?.children);
      }
    });
    return bodyParams || [];
  }
};
