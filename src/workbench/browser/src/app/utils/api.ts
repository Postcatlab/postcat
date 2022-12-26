import { ApiTestQuery } from 'eo/workbench/browser/src/app/pages/workspace/project/api/http/test/api-test.model';

import { ApiEditQuery, ApiEditRest } from '../modules/api-shared/api.model';

/**
 * get rest param from url,format like {restName}
 *
 * @param url
 * @returns
 */
export const getRest = (url = ''): string[] => [...url.replace(/{{(.+?)}}/g, '').matchAll(/{(.+?)}/g)].map(val => val[1]);
export const uniqueSlash = (path: string) =>
  path
    .replace(/:\/{2,}/g, ':::')
    .replace(/\/{2,}/g, '/')
    .replace(/:{3}/g, '://');
const jointQuery = (url = '', query: ApiTestQuery[] | ApiEditQuery[]) => {
  //Joint query
  let search = '';
  query.forEach(val => {
    if (!(val.name && val.required)) {
      return;
    }
    search += `${val.name}=${val.value === undefined ? val.example : val.value}&`;
  });
  search = search ? `?${search.slice(0, -1)}` : '';
  return `${url.split('?')[0]}${search}`;
};

/**
 * URL and Query transfer each other
 *
 * @description Add query to URL and read query form url
 * @param url - whole url include query
 * @param query - ui query param
 * @param opts.base - based on which,url or query,delete no exist and replace same
 * @param opts.replaceType 'replace'|'merge' replace means only keep replace array,merge means union
 * @returns - {url:"",query:[]}
 */
export const transferUrlAndQuery = (
  url = '',
  query = [],
  opts: { base: string; replaceType?: string } = {
    base: 'url',
    replaceType: 'replace'
  }
) => {
  const urlQuery = [];
  const uiQuery = query;
  //Get url query
  new URLSearchParams(url.split('?').slice(1).join('?')).forEach((val, name) => {
    const item: ApiTestQuery = {
      required: true,
      name,
      value: val
    };
    urlQuery.push(item);
  });
  let result = [];
  if (opts.replaceType === 'merge') {
    result = [...urlQuery, ...uiQuery];
    url = jointQuery(url, result);
  } else {
    if (opts.base === 'url') {
      result = [...urlQuery, ...uiQuery.filter(val => !val.required)];
    } else {
      result = uiQuery;
      url = jointQuery(url, result);
    }
  }
  return {
    url,
    query: result
  };
};

/**
 * Generate Rest Param From Url
 */
export const generateRestFromUrl = (url, rest): ApiEditRest[] => {
  const result: any = [];
  const newRests = getRest(url);
  newRests.forEach(newRest => {
    const hasFind = rest.find((val: ApiEditRest) => val.name === newRest);
    if (hasFind) {
      result.push(hasFind);
      return;
    }
    const restItem: ApiEditRest = {
      name: newRest,
      required: true,
      example: '',
      description: ''
    };
    result.splice(result.length - 1, 0, restItem);
  });
  return result;
};
