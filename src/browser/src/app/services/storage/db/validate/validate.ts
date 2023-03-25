import Ajv from 'ajv';
import { safeStringify } from 'ajv/dist/compile/codegen/code';
import { ApiBodyType } from 'pc/browser/src/app/pages/workspace/project/api/api.model';
import { ApiData, Environment, Group } from 'pc/browser/src/app/services/storage/db/models';
import { whatType } from 'pc/browser/src/app/shared/utils/index.utils';

import apiDataSchema from '../schema/apiData.json';
import envSchema from '../schema/env.json';
export const parseAndCheckApiData = (apiData): { validate: boolean; data?: ApiData; error?: any } => {
  const ajv = new Ajv({
    useDefaults: true,
    removeAdditional: true
  });
  const validate = ajv.compile<ApiData>(apiDataSchema);
  if (validate(apiData)) {
    ['requestBody', 'responseBody'].forEach(keyName => {
      if (
        [ApiBodyType['FormData'], ApiBodyType.JSON, ApiBodyType.XML].includes(apiData[`${keyName}Type`]) &&
        whatType(apiData[keyName]) !== 'array'
      ) {
        //Handle xml\formdata\json  data
        apiData[keyName] = [];
      } else if ([ApiBodyType.Raw, ApiBodyType.Binary].includes(apiData[`${keyName}Type`]) && whatType(apiData[keyName]) !== 'string') {
        //Handle raw\binary data
        apiData[keyName] = '';
      }
    });
    return { validate: true, data: apiData };
  } else {
    console.error(validate.errors, apiData);
    return { validate: false, error: validate.errors };
  }
};

export const parseAndCheckEnv = (env): { validate: boolean; data?: Environment; error?: any } => {
  const ajv = new Ajv({
    useDefaults: true,
    removeAdditional: true
  });
  const validate = ajv.compile<Environment>(envSchema);
  if (validate(env)) {
    return {
      validate: true,
      data: {
        workSpaceUuid: env.workSpaceUuid,
        projectUuid: env.projectUuid,
        name: env.name,
        hostUri: env.hostUri,
        parameters: typeof env.parameters === 'object' ? safeStringify(env.parameters) : env.parameters
      }
    };
  } else {
    console.error(validate.errors, env);
    return { validate: false, error: validate.errors };
  }
};

export const parseAndCheckCollections = (collections = []) => {
  return collections.reduce((prev, curr) => {
    const isAPI = !!curr.uri;
    //Group
    if (!isAPI) {
      prev.push(curr);
      if (curr.children?.length) {
        curr.children = parseAndCheckCollections(curr.children);
      }
      return prev;
    }

    const res = parseAndCheckApiData(curr);
    if (res.validate) {
      prev.push(res.data);
    }
  }, []);
};
