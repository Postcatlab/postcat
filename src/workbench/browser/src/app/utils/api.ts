import { ApiTestQuery } from 'eo/workbench/browser/src/app/shared/services/api-test/api-test.model';

/**
 * get rest param from url,format like {restName}
 *
 * @param url
 * @returns
 */
export const getRest: (url: string) => string[] = (url) =>
  [...url.replace(/{{(.*?)}}/g, '').matchAll(/{(.*?)}/g)].map((val) => val[1]);

export const uniqueSlash = (path: string) => path.replace(/(?<!:)\/{2,}/g, '/');

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
  opts: { base: string; replaceType: string } = {
    base: 'url',
    replaceType: 'replace',
  }
) => {
  const urlQuery = [];
  const uiQuery = query;
  //Get url query
  new URLSearchParams(url.split('?').slice(1).join('?')).forEach((val, name) => {
    const item: ApiTestQuery = {
      required: true,
      name,
      value: val,
    };
    urlQuery.push(item);
  });
  //Get replace result
  const origin = opts.base === 'url' ? uiQuery : urlQuery;
  const replace = opts.base === 'url' ? urlQuery : uiQuery;
  if (opts.replaceType === 'replace') {
    origin.forEach((val) => (val.name ? (val.required = false) : ''));
  }
  const result = [...replace, ...origin];
  for (let i = 0; i < result.length; ++i) {
    for (let j = i + 1; j < result.length; ++j) {
      if (result[i].name === result[j].name) {
        result.splice(j--, 1);
      }
    }
  }
  //Joint query
  let search = '';
  result.forEach((val) => {
    if (!val.name || !val.required) {
      return;
    }
    search += `${val.name}=${val.value === undefined ? val.example : val.value}&`;
  });
  search = search ? `?${search.slice(0, -1)}` : '';
  url = `${url.split('?')[0]}${search}`;
  return {
    url,
    query: result,
  };
};
