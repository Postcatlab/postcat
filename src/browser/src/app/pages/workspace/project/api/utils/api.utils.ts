import { method } from 'lodash-es';

import { QueryParam, RestParam } from '../../../../../services/storage/db/models/apiData';

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
const jointQuery = (url = '', query: QueryParam[]) => {
  //Joint query
  let search = '';
  query.forEach(val => {
    if (!(val.name && val.isRequired)) {
      return;
    }
    search += `${val.name}=${val['paramAttr.example'] || ''}&`;
  });
  search = search ? `?${search.slice(0, -1)}` : '';
  return `${url.split('?')[0]}${search}`;
};

/**
 * Sync URL and Query
 *
 * @description Add query to URL and read query form url
 * @param url - whole url include query
 * @param query - ui query param
 * @param opts.method - sync method
 * @returns - {url:"",query:[]}
 */
export const syncUrlAndQuery = (
  url = '',
  query = [],
  opts: {
    nowOperate?: 'url' | 'query';
    method: 'replace' | 'keepBoth';
  } = {
    method: 'replace',
    nowOperate: 'url'
  }
) => {
  const urlQuery = [];
  const uiQuery = query;
  //Get url query
  new URLSearchParams(url.split('?').slice(1).join('?')).forEach((val, name) => {
    const item: QueryParam | any = {
      isRequired: 1,
      name,
      'paramAttr.example': val
    };
    urlQuery.push(item);
  });
  const pre = opts.nowOperate === 'url' ? uiQuery : urlQuery;
  const next = opts.nowOperate === 'url' ? urlQuery : uiQuery;
  const result = {
    url,
    query
  };
  if (opts.method === 'replace') {
    result.query = [...next, ...pre.filter(val => !val.isRequired)];
  } else {
    result.query = [
      ...next.map(val => Object.assign(pre.find(val1 => val1.name === val.name) || {}, val)),
      ...pre.filter((val: QueryParam) => urlQuery.every(val1 => val1.name !== val.name))
    ];
  }
  result.url = jointQuery(url, result.query);
  return result;
};

/**
 * Generate Rest Param From Url
 */
export const generateRestFromUrl = (url, rest): RestParam[] => {
  const result: any = [];
  const newRests = getRest(url);
  newRests.forEach(newRest => {
    const hasFind = rest.find((val: RestParam) => val.name === newRest);
    if (hasFind) {
      result.push(hasFind);
      return;
    }
    const restItem: RestParam = {
      name: newRest,
      isRequired: 1,
      paramAttr: {
        example: ''
      },
      description: ''
    };
    result.splice(result.length - 1, 0, restItem);
  });
  return [...result, ...rest.filter((val: QueryParam) => result.every(val1 => val1.name !== val.name))];
};
