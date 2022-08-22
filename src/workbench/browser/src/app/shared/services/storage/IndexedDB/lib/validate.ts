import Ajv, { JSONSchemaType } from 'ajv';
import { ApiData, Group } from '../../index.model';
import apiDataSchema from '../schema/apiData.json';
export const parseAndCheckApiData = (apiData): { validate: boolean; data?: ApiData; error?: any } => {
  const ajv = new Ajv({
    useDefaults: true,
  });
  const validate = ajv.compile<ApiData>(apiDataSchema);
  if (validate(apiData)) {
    return { validate: true, data: apiData };
  } else {
    return { validate: false, error: validate.errors };
  }
};

export const parseAndCheckGroup = (group): { validate: boolean; data?: Group}  => {
  if (group.name) {
    return {
      validate:true,
      data:{
        projectID:group.projectID,
        parentID:group.parentID,
        name:group.name
      }
    };
  } else {
    return { validate: false };
  }
};
