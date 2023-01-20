import { Group, ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { toJS } from 'mobx';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';
import omitDeep from 'omit-deep-lodash';

import { GroupTreeItem } from '../../shared/models';
import { eoDeepCopy, whatType } from '../index.utils';

export type TreeToObjOpts = {
  key?: string;
  valueKey?: string;
  childKey?: string;
};
export const getTreeTotalCount = (trees): number => {
  if (whatType(trees) !== 'array') return 0;
  let result = 0;
  result += trees.length;
  trees.forEach(val => {
    if (val.childList?.length) {
      result += getTreeTotalCount(val.childList);
    }
  });
  return result;
};
const getValueByChian = (chain, object) => {
  return chain.reduce((o, i) => o?.[i], object);
};
/**
 * Table column key has quote child attribute,such as 'a.b.c'
 * Generate a new array with quote child attribute
 */
export const generateQuoteKeyValue = (chains, nzData, opts = { childKey: 'childList' }) => {
  let result = eoDeepCopy(nzData) || [];
  const loop = items => {
    items.forEach((item, index) => {
      chains.forEach(chain => {
        const value = getValueByChian(chain.arr, item);
        if (value) {
          item[chain.str] = value;
        }
      });
      if (item[opts.childKey]) {
        item[opts.childKey] = loop(item[opts.childKey]);
      }
    });
    return items;
  };
  result = loop(result);
  return result;
};
const filterTree = (
  result,
  filterFn,
  opts = {
    childKey: 'childList'
  }
) =>
  result.filter((item, index) => {
    const hasKeep = filterFn ? filterFn(item, index) : true;
    if (!hasKeep) {
      return false;
    }
    if (item[opts.childKey]) {
      item[opts.childKey] = filterTree(item[opts.childKey], filterFn, opts);
    }
    return true;
  });
export const filterTableData = (
  inData: any[],
  opts: {
    childKey?: string;
    primaryKey?: string;
    pickBy?: string[];
    omitBy?: string[];
    filterFn?: (item: any) => boolean;
  } = {}
) => {
  if (whatType(inData) !== 'array') return inData;
  //TODO add pickBy support
  //Set default Options
  opts.childKey = opts.childKey || 'childList';
  opts.omitBy = opts.omitBy || ['eoKey'];
  const result = inData.map(val => omitDeep(val, opts.omitBy));
  //Omit useless fieild
  // const result = JSON.parse(
  //   JSON.stringify(inData, (key, value) => {
  //     if (typeof key === 'string' && opts.omitBy.includes(key)) {
  //       return undefined;
  //     } else {
  //       return value;
  //     }
  //   })
  // );
  if (!opts.filterFn) {
    if (!opts.primaryKey) {
      pcConsole.error('filterTableData need primaryKey');
    } else {
      opts.filterFn = item => item[opts.primaryKey];
    }
  }
  return filterTree(result, opts.filterFn, {
    childKey: opts.childKey
  });
};

/**
 * Convert array items which has parent id to tree nodes.
 *
 * @param list Array<GroupTreeItem>
 * @param tree Array<GroupTreeItem>
 * @param parentID number|string
 */
export const listToTree = (list: GroupTreeItem[], tree: GroupTreeItem[], parentID: number | string): void => {
  list.forEach(data => {
    if (data.parentID === parentID) {
      const child = {
        ...data,
        childList: []
      };
      if (!data.isLeaf) {
        listToTree(list, child.childList, data.key);
      }
      if (child.childList.length <= 0) {
        delete child.childList;
      }
      tree.push(child);
    }
  });
};
export const flatData = data => {
  // * DFS
  const arr = [];
  data.forEach(item => {
    const loop = ({ childList = [], ...it }) => {
      arr.push(it);
      childList.forEach(x => loop(x));
    };
    loop(item);
  });
  return arr;
};

export const getExpandGroupByKey: (component: NzTreeComponent | NzTreeSelectComponent, key) => string[] = (component, key) => {
  if (!component) {
    return [];
  }
  let treeNode = component.getTreeNodeByKey(key);
  if (!treeNode) {
    return;
  }
  const expandKeys = [];
  while (treeNode.parentNode) {
    expandKeys.push(treeNode.parentNode.key);
    treeNode = treeNode.parentNode;
  }
  return expandKeys;
};

/**
 * 将树形数据转成 key => value 对象
 *
 * @param list
 * @param opts
 * @returns
 */
export const tree2obj = (list: any[] = [], opts: TreeToObjOpts = {}, initObj = {}) => {
  const { key = 'name', valueKey = 'description', childKey = 'childList' } = opts;
  return list?.reduce?.((prev, curr) => {
    try {
      curr = typeof curr === 'string' ? JSON.parse(curr) : curr;
      const namePath = valueKey.split('.');
      const lastKey = namePath.pop();
      prev[curr[key]] = namePath.reduce((p, v) => p?.[v], curr)?.[lastKey] || fieldTypeMap.get(curr.type);
      if (Array.isArray(curr[childKey]) && curr[childKey].length > 0) {
        tree2obj(curr[childKey], opts, (prev[curr[key]] = {}));
      } else if (curr?.example) {
        prev[curr[key]] = curr?.example;
      }
    } catch (error) {
      console.log('error==>', `prev: ${prev} == curr: ${curr} == key: ${key}`);
    }
    return prev;
  }, initObj);
};

export const fieldTypeMap = new Map<string, any>([
  ['boolean', false],
  ['array', []],
  ['object', {}],
  ['number', 0],
  ['null', null],
  ['string', 'default_value']
]);

export const genApiGroupTree = (apiGroups: Group[] = [], apiDatas: ApiData[] = [], groupId: number) => {
  const apiDataFilters = apiDatas.filter(apiData => {
    apiData['title'] = apiData.name;
    apiData['key'] = apiData['apiUuid'];
    apiData['isLeaf'] = true;
    return apiData.groupId === groupId;
  });
  const apiGroupFilters = apiGroups.filter(n => n?.parentId === groupId);
  return [
    ...apiGroupFilters.map(group => ({
      ...group,
      title: group.name,
      key: group.id,
      children: genApiGroupTree([...(group.children || [])], apiDatas, group.id)
    })),
    ...apiDataFilters
  ];
};
