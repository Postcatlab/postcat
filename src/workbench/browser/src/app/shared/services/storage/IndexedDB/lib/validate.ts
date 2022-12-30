import Ajv from 'ajv';
import { ApiBodyType } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { whatType } from 'eo/workbench/browser/src/app/utils/index.utils';

import { ApiData, Environment, Group } from '../../index.model';
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
        [ApiBodyType['Form-data'], ApiBodyType.JSON, ApiBodyType.XML].includes(apiData[`${keyName}Type`]) &&
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

export const parseAndCheckGroup = (group): { validate: boolean; data?: Group } => {
  if (group.name) {
    return {
      validate: true,
      data: {
        projectID: group.projectID,
        parentID: group.parentID,
        name: group.name
      }
    };
  } else {
    return { validate: false };
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
        projectID: env.projectID,
        name: env.name,
        hostUri: env.hostUri,
        parameters: env.parameters
      }
    };
  } else {
    console.error(validate.errors, env);
    return { validate: false, error: validate.errors };
  }
};
