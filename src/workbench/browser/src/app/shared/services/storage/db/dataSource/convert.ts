import { ApiData as NewApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';

export const convertApiData = (apiData: ApiData): NewApiData => {
  const { uri, protocol } = apiData;
  return {
    uri,
    protocol: ['http', 'https'].indexOf(protocol)
  };
};
