import { ApiParamsType, ContentType, RequestMethod } from 'pc/browser/src/app/pages/workspace/project/api/api.model';
import { mui } from 'pc/browser/src/app/pages/workspace/project/api/http/edit/api-edit-util.service';
import { ApiData, BodyParam } from 'pc/browser/src/app/services/storage/db/models/apiData';

import { ApiData as OldApiData, Environment as OldEnvironment, BasiApiEditParams, ApiEditBody } from './oldApiData';

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
      headerParams: transformParams(requestHeaders, 'headerParams'),
      queryParams: transformParams(queryParams, 'queryParams'),
      restParams: transformParams(restParams, 'restParams'),
      bodyParams: transformRequestBody(requestBody)
    },
    responseList: [
      {
        isDefault: 1,
        contentType: transformContentType(responseBodyType, responseBodyJsonType),
        responseParams: {
          headerParams: transformParams(responseHeaders, 'headerParams'),
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

const transformParams = (params: Array<Partial<ApiEditBody>> = [], partType): BodyParam[] => {
  return params?.map((n, i) => ({
    name: n.name,
    partType: mui[partType],
    dataType: Number(ApiParamsType[n?.type]),
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
    const bodyParams = transformParams(requestBody, 'bodyParams');
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
