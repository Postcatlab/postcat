import Ajv from 'ajv';
import { safeStringify } from 'ajv/dist/compile/codegen/code';
import { CollectionTypeEnum } from 'pc/browser/src/app/services/storage/db/dto/project.dto';
import { ApiData, Environment } from 'pc/browser/src/app/services/storage/db/models';

import apiDataSchema from '../schema/apiData.schema.json';
import envSchema from '../schema/env.schema.json';
/**
 * cache jsv
 */
const ajvHandler = {
  api: null,
  env: null
};
export const parseAndCheckApiData = (apiData): { validate: boolean; data?: ApiData; error?: any } => {
  let validate = ajvHandler.api;
  if (!validate) {
    const ajv = new Ajv({
      useDefaults: true,
      removeAdditional: true
    });
    validate = ajv.compile<ApiData>(apiDataSchema);
  }

  if (validate(apiData)) {
    return { validate: true, data: apiData };
  } else {
    console.error(validate.errors, apiData);
    return { validate: false, error: validate.errors };
  }
};

export const parseAndCheckEnv = (env): { validate: boolean; data?: Environment; error?: any } => {
  let validate = ajvHandler.env;
  if (!validate) {
    const ajv = new Ajv({
      useDefaults: true,
      removeAdditional: true
    });
    validate = ajv.compile<Environment>(envSchema);
  }

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
    //Group
    if (curr.collectionType === CollectionTypeEnum.GROUP) {
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
    return prev;
  }, []);
};
