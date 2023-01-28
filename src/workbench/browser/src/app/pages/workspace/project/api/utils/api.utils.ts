import { QueryParam, RestParam } from '../../../../../shared/services/storage/db/models/apiData';

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
    search += `${val.name}=${val.paramAttr?.example || ''}&`;
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
    const item: QueryParam = {
      isRequired: 1,
      name,
      paramAttr: {
        example: val
      }
    };
    urlQuery.push(item);
  });
  let result = [];
  if (opts.replaceType === 'merge') {
    result = [...urlQuery, ...uiQuery];
    url = jointQuery(url, result);
  } else {
    if (opts.base === 'url') {
      result = [...urlQuery, ...uiQuery.filter((val: QueryParam) => !val.isRequired)];
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
  return result;
};
